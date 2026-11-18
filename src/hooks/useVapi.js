import { useState, useEffect, useRef, useCallback } from 'react';
import Vapi from '@vapi-ai/web';

/**
 * Custom React hook for Vapi Web SDK integration.
 * Manages live WebRTC audio stream, microphone states, real-time events,
 * and conversational transcript capture.
 */
export function useVapi() {
  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'connecting' | 'active' | 'ended' | 'error'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState(null);
  const [transcripts, setTranscripts] = useState([]);
  const [liveUtterance, setLiveUtterance] = useState({ speaker: null, text: '' });

  const vapiRef = useRef(null);
  const isMountedRef = useRef(true);

  // Initialize Vapi SDK instance safely
  const getVapiInstance = useCallback(() => {
    if (!vapiRef.current) {
      const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error('Vapi public API key (VITE_VAPI_PUBLIC_KEY) is missing in frontend environment.');
      }
      vapiRef.current = new Vapi(publicKey);
    }
    return vapiRef.current;
  }, []);

  // Start Call with Session Assistant Overrides
  const startCall = useCallback(
    async (assistantOverrides = {}) => {
      setError(null);
      setCallStatus('connecting');
      setIsSpeaking(false);
      setLiveUtterance({ speaker: null, text: '' });

      const assistantId = import.meta.env.VITE_VAPI_ASSISTANT_ID;
      if (!assistantId) {
        const msg = 'Vapi Assistant ID (VITE_VAPI_ASSISTANT_ID) is missing in frontend environment.';
        setError(msg);
        setCallStatus('error');
        return;
      }

      try {
        const vapi = getVapiInstance();

        // Remove any previous listeners to prevent duplicates
        vapi.removeAllListeners();

        // 1. Call Started
        vapi.on('call-start', () => {
          if (!isMountedRef.current) return;
          setCallStatus('active');
          setError(null);
          setIsMuted(vapi.isMuted ? vapi.isMuted() : false);
        });

        // 2. Call Ended
        vapi.on('call-end', () => {
          if (!isMountedRef.current) return;
          setCallStatus('ended');
          setIsSpeaking(false);
          setLiveUtterance({ speaker: null, text: '' });
        });

        // 3. Assistant Speech Start & End
        vapi.on('speech-start', () => {
          if (!isMountedRef.current) return;
          setIsSpeaking(true);
        });

        vapi.on('speech-end', () => {
          if (!isMountedRef.current) return;
          setIsSpeaking(false);
        });

        // 4. Real-time Transcript & Message Handling
        vapi.on('message', (message) => {
          if (!isMountedRef.current || !message) return;

          // Transcript messages
          if (message.type === 'transcript') {
            const role = message.role === 'assistant' ? 'interviewer' : 'candidate';
            const text = message.transcript || '';

            if (message.transcriptType === 'partial') {
              // Update live partial utterance
              setLiveUtterance({ speaker: role, text });
            } else if (message.transcriptType === 'final') {
              // Commit final transcript entry
              setLiveUtterance({ speaker: null, text: '' });
              if (text.trim()) {
                setTranscripts((prev) => {
                  // Deduplicate immediate repeat of the same utterance
                  const last = prev[prev.length - 1];
                  if (last && last.speaker === role && last.text === text.trim()) {
                    return prev;
                  }
                  return [
                    ...prev,
                    {
                      speaker: role,
                      text: text.trim(),
                      timestamp: new Date().toISOString(),
                      messageId: message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`
                    }
                  ];
                });
              }
            }
          }
        });

        // 5. Error Handler (mic permission, network, etc.)
        vapi.on('error', (err) => {
          if (!isMountedRef.current) return;
          console.error('[Vapi WebRTC Error]:', err?.message || err);

          let userFriendlyMessage = 'An error occurred during the voice interview session.';
          const errorStr = (err?.message || err?.error || JSON.stringify(err) || '').toLowerCase();

          if (
            errorStr.includes('notallowed') ||
            errorStr.includes('permission denied') ||
            errorStr.includes('permission')
          ) {
            userFriendlyMessage =
              'Microphone access was denied. Please allow microphone permissions in your browser to speak with the interviewer.';
          } else if (errorStr.includes('network') || errorStr.includes('connection')) {
            userFriendlyMessage = 'Network connection to the voice service was interrupted. Please check your connection.';
          } else if (err?.message) {
            userFriendlyMessage = err.message;
          }

          setError(userFriendlyMessage);
          setCallStatus('error');
          setIsSpeaking(false);
        });

        // Start call with configured assistant ID and session overrides
        await vapi.start(assistantId, assistantOverrides);
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error('[Vapi Start Failure]:', err?.message || err);

        let userMsg = 'Failed to connect to the voice interview.';
        const errStr = (err?.message || '').toLowerCase();
        if (errStr.includes('permission') || errStr.includes('notallowed')) {
          userMsg =
            'Microphone access was denied. Please allow microphone access in your browser settings and try again.';
        } else if (err?.message) {
          userMsg = err.message;
        }

        setError(userMsg);
        setCallStatus('error');
      }
    },
    [getVapiInstance]
  );

  // Stop Call Safely
  const stopCall = useCallback(async () => {
    try {
      if (vapiRef.current) {
        await vapiRef.current.stop();
      }
    } catch (err) {
      console.warn('[Vapi Stop Warning]:', err?.message || err);
    } finally {
      if (isMountedRef.current) {
        setCallStatus('ended');
        setIsSpeaking(false);
        setLiveUtterance({ speaker: null, text: '' });
      }
    }
  }, []);

  // Toggle Microphone Mute
  const toggleMute = useCallback(() => {
    if (!vapiRef.current) return;
    try {
      const nextMuted = !isMuted;
      vapiRef.current.setMuted(nextMuted);
      setIsMuted(nextMuted);
    } catch (err) {
      console.warn('[Vapi Mute Error]:', err?.message || err);
    }
  }, [isMuted]);

  // Clean up on component unmount
  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      if (vapiRef.current) {
        try {
          vapiRef.current.stop();
          vapiRef.current.removeAllListeners();
        } catch {
          // Ignore cleanup errors during unmount
        }
      }
    };
  }, []);

  return {
    callStatus,
    isSpeaking,
    isMuted,
    error,
    transcripts,
    liveUtterance,
    startCall,
    stopCall,
    toggleMute,
    setTranscripts
  };
}
