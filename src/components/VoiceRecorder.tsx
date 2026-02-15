'use client';

import { useState, useRef, useCallback } from 'react';

interface VoiceRecording {
    id: number;
    phrase_id: string;
    url: string;
    created_at: string;
}

interface VoiceRecorderProps {
    phraseId: string;
    recordings: VoiceRecording[];
    onRecordingComplete: (recording: VoiceRecording) => void;
    onRecordingDelete: (id: number) => void;
}

export default function VoiceRecorder({
    phraseId,
    recordings,
    onRecordingComplete,
    onRecordingDelete,
}: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const startRecording = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                stream.getTracks().forEach(track => track.stop());
                await uploadRecording(audioBlob);
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('Error starting recording:', error);
            alert('マイクへのアクセスが許可されていません');
        }
    }, []);

    const stopRecording = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    }, [isRecording]);

    const uploadRecording = async (audioBlob: Blob) => {
        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('audio', audioBlob, 'recording.webm');
            formData.append('phraseId', phraseId);

            const response = await fetch('/api/voice-recordings', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.success && data.recording) {
                onRecordingComplete(data.recording);
            } else {
                throw new Error(data.error || 'Upload failed');
            }
        } catch (error) {
            console.error('Error uploading recording:', error);
            alert('録音のアップロードに失敗しました');
        } finally {
            setIsUploading(false);
        }
    };

    const deleteRecording = async (recording: VoiceRecording) => {
        if (!confirm('この録音を削除しますか？')) return;

        try {
            const response = await fetch(
                `/api/voice-recordings?id=${recording.id}&url=${encodeURIComponent(recording.url)}`,
                { method: 'DELETE' }
            );

            const data = await response.json();
            if (data.success) {
                onRecordingDelete(recording.id);
            }
        } catch (error) {
            console.error('Error deleting recording:', error);
        }
    };

    const stopPlaying = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
        setIsPlaying(false);
    };

    // Play user recording
    const playUserRecording = (recordingUrl: string) => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        const audio = new Audio(recordingUrl);
        audioRef.current = audio;
        audio.onended = () => {
            setIsPlaying(false);
        };
        audio.play();
        setIsPlaying(true);
    };

    const latestRecording = recordings[0];
    const hasRecording = recordings.length > 0;

    // Mic icon SVG
    const MicIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
        </svg>
    );

    // Stop icon SVG
    const StopIcon = () => (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <rect x="4" y="4" width="16" height="16" rx="2"/>
        </svg>
    );

    // Compare/Play icon SVG
    const CompareIcon = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="6 3 20 12 6 21 6 3" fill="currentColor"/>
        </svg>
    );

    // Loading spinner
    const LoadingSpinner = () => (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
        </svg>
    );

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
        }}>
            {/* Record button */}
            {!isRecording ? (
                <button
                    onClick={startRecording}
                    disabled={isUploading}
                    title={hasRecording ? "Re-record" : "Record"}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: 'none',
                        background: isUploading
                            ? '#e5e5e5'
                            : 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                        color: isUploading ? '#999' : '#fff',
                        cursor: isUploading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: isUploading ? 'none' : '0 1px 4px rgba(0,0,0,0.15)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    {isUploading ? <LoadingSpinner /> : <MicIcon />}
                </button>
            ) : (
                <button
                    onClick={stopRecording}
                    title="Stop"
                    className="recording-pulse"
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: '2px solid #dc2626',
                        background: '#fef2f2',
                        color: '#dc2626',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <StopIcon />
                </button>
            )}

            {/* Play button (if recording exists) */}
            {hasRecording && (
                <>
                    <button
                        onClick={() => isPlaying ? stopPlaying() : playUserRecording(latestRecording.url)}
                        title={isPlaying ? 'Stop' : 'Play'}
                        style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            border: 'none',
                            background: isPlaying
                                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                                : 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                            color: isPlaying ? '#fff' : '#059669',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {isPlaying ? <StopIcon /> : <CompareIcon />}
                    </button>
                    <button
                        onClick={() => deleteRecording(latestRecording)}
                        title="Delete"
                        style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: 'none',
                            background: 'transparent',
                            color: '#ccc',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fef2f2';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = '#ccc';
                        }}
                    >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18M6 6l12 12"/>
                        </svg>
                    </button>
                </>
            )}

            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes recording-pulse {
                    0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
                    70% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
                }
                .recording-pulse {
                    animation: recording-pulse 1.5s ease-out infinite;
                }
            `}</style>
        </div>
    );
}
