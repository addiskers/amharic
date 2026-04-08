import { useState, useRef, useCallback, useEffect } from 'react'

const SAMPLE_RATE = 16000

export default function useVoice() {
  const [isActive, setIsActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [inputTranscript, setInputTranscript] = useState('')
  const [outputTranscript, setOutputTranscript] = useState('')
  const [error, setError] = useState('')

  const wsRef = useRef(null)
  const audioContextRef = useRef(null)
  const processorRef = useRef(null)
  const streamRef = useRef(null)
  const playbackQueueRef = useRef([])
  const isPlayingRef = useRef(false)
  const playbackContextRef = useRef(null)
  const stopRef = useRef(null)

  // Play queued audio chunks
  const playNextChunk = useCallback(async () => {
    if (isPlayingRef.current || playbackQueueRef.current.length === 0) return
    isPlayingRef.current = true
    setIsSpeaking(true)

    while (playbackQueueRef.current.length > 0) {
      const pcmData = playbackQueueRef.current.shift()

      if (!playbackContextRef.current) {
        playbackContextRef.current = new AudioContext({ sampleRate: 24000 })
      }
      const ctx = playbackContextRef.current

      const int16 = new Int16Array(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength / 2)
      const float32 = new Float32Array(int16.length)
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000)
      audioBuffer.getChannelData(0).set(float32)

      const source = ctx.createBufferSource()
      source.buffer = audioBuffer
      source.connect(ctx.destination)

      await new Promise((resolve) => {
        source.onended = resolve
        source.start()
      })
    }

    isPlayingRef.current = false
    setIsSpeaking(false)
  }, [])

  const stop = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try { wsRef.current.send(JSON.stringify({ type: 'stop' })) } catch {}
      wsRef.current.close()
    }
    wsRef.current = null

    if (processorRef.current) {
      processorRef.current.disconnect()
      processorRef.current = null
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {})
      audioContextRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (playbackContextRef.current) {
      playbackContextRef.current.close().catch(() => {})
      playbackContextRef.current = null
    }

    playbackQueueRef.current = []
    isPlayingRef.current = false
    setIsActive(false)
    setIsListening(false)
    setIsSpeaking(false)
    setInputTranscript('')
    setOutputTranscript('')
  }, [])

  stopRef.current = stop

  const start = useCallback(async () => {
    setError('')

    try {
      // Step 1: Connect WebSocket FIRST
      console.log('[Voice] Connecting WebSocket...')
      const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      const wsHost = import.meta.env.DEV ? 'localhost:8000' : window.location.host
      const ws = new WebSocket(`${wsProto}//${wsHost}/api/voice`)
      wsRef.current = ws

      await new Promise((resolve, reject) => {
        ws.onopen = () => {
          console.log('[Voice] WebSocket connected')
          resolve()
        }
        ws.onerror = (e) => {
          console.error('[Voice] WebSocket error', e)
          reject(new Error('WebSocket connection failed'))
        }
        setTimeout(() => reject(new Error('WebSocket timeout')), 5000)
      })

      // Step 2: Handle incoming messages
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)

        if (msg.type === 'audio') {
          const raw = atob(msg.data)
          const bytes = new Uint8Array(raw.length)
          for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i)
          playbackQueueRef.current.push(bytes)
          playNextChunk()
        } else if (msg.type === 'text') {
          console.log('[Voice] Text response:', msg.text)
          setOutputTranscript((prev) => prev + msg.text)
        } else if (msg.type === 'input_transcript') {
          setInputTranscript((prev) => prev + msg.text)
        } else if (msg.type === 'output_transcript') {
          setOutputTranscript((prev) => prev + msg.text)
        } else if (msg.type === 'error') {
          console.error('[Voice] Server error:', msg.message)
          setError(msg.message)
          setTimeout(() => stopRef.current?.(), 2000)
        } else if (msg.type === 'turn_complete') {
          console.log('[Voice] Turn complete, ready for next input')
          setIsSpeaking(false)
          // Clear transcripts after a pause, ready for next turn
          setTimeout(() => {
            setInputTranscript('')
            setOutputTranscript('')
          }, 2000)
        }
      }

      ws.onclose = (e) => {
        console.log('[Voice] WebSocket closed', e.code, e.reason)
        // Only auto-stop if we didn't initiate the close
        if (wsRef.current) {
          stopRef.current?.()
        }
      }

      // Step 3: Get microphone
      console.log('[Voice] Requesting microphone...')
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      streamRef.current = stream
      console.log('[Voice] Mic stream tracks:', stream.getAudioTracks().map(t => t.label))

      // Step 4: Set up audio capture
      // Use native sample rate, then resample to 16kHz for Gemini
      const audioContext = new AudioContext()
      audioContextRef.current = audioContext
      const nativeSR = audioContext.sampleRate
      console.log('[Voice] AudioContext sample rate:', nativeSR)

      const source = audioContext.createMediaStreamSource(stream)
      const processor = audioContext.createScriptProcessor(2048, 1, 1)
      processorRef.current = processor

      let chunkCount = 0
      processor.onaudioprocess = (e) => {
        if (ws.readyState !== WebSocket.OPEN) return
        const float32 = e.inputBuffer.getChannelData(0)

        // Resample to 16kHz if needed
        let samples = float32
        if (nativeSR !== SAMPLE_RATE) {
          const ratio = nativeSR / SAMPLE_RATE
          const newLen = Math.round(float32.length / ratio)
          samples = new Float32Array(newLen)
          for (let i = 0; i < newLen; i++) {
            samples[i] = float32[Math.round(i * ratio)]
          }
        }

        // Convert to PCM16
        const int16 = new Int16Array(samples.length)
        for (let i = 0; i < samples.length; i++) {
          int16[i] = Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32768)))
        }

        // Log first few chunks to verify non-zero audio
        if (chunkCount < 3) {
          const maxVal = Math.max(...Array.from(int16).map(Math.abs))
          console.log(`[Voice] Audio chunk ${chunkCount}: ${int16.length} samples, max amplitude: ${maxVal}`)
          chunkCount++
        }

        const b64 = arrayBufferToBase64(int16.buffer)
        ws.send(JSON.stringify({ type: 'audio', data: b64 }))
      }

      source.connect(processor)
      processor.connect(audioContext.destination)

      setIsActive(true)
      setIsListening(true)
      console.log('[Voice] Streaming audio to server')

    } catch (err) {
      console.error('[Voice] Start failed:', err)
      setError(err.message)
      stop()
    }
  }, [stop, playNextChunk])

  useEffect(() => {
    return () => stopRef.current?.()
  }, [])

  return {
    isActive,
    isListening,
    isSpeaking,
    inputTranscript,
    outputTranscript,
    error,
    start,
    stop,
  }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}
