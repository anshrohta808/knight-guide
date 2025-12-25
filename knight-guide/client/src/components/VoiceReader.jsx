import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * VoiceReader - Text-to-Speech component using Web Speech API
 * 
 * Features:
 * - Read selected text or full page content
 * - Adjustable speech rate and pitch
 * - Play/pause/stop controls
 * - Keyboard accessible
 */
const VoiceReader = ({ textToRead = null }) => {
    const [isSupported, setIsSupported] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [rate, setRate] = useState(1);
    const [isExpanded, setIsExpanded] = useState(false);
    const utteranceRef = useRef(null);

    useEffect(() => {
        // Check Web Speech API support
        if ('speechSynthesis' in window) {
            setIsSupported(true);

            // Load available voices
            const loadVoices = () => {
                const availableVoices = speechSynthesis.getVoices();
                setVoices(availableVoices);

                // Select default English voice
                const englishVoice = availableVoices.find(v => v.lang.startsWith('en'));
                if (englishVoice) {
                    setSelectedVoice(englishVoice);
                }
            };

            loadVoices();
            speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if ('speechSynthesis' in window) {
                speechSynthesis.cancel();
            }
        };
    }, []);

    const getPageText = useCallback(() => {
        // Get main content text, excluding navigation and hidden elements
        const main = document.querySelector('main') || document.body;
        const walker = document.createTreeWalker(
            main,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const parent = node.parentElement;
                    if (
                        parent.closest('[aria-hidden="true"]') ||
                        parent.closest('.sr-only') ||
                        parent.closest('script') ||
                        parent.closest('style') ||
                        parent.closest('nav')
                    ) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    return node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const textParts = [];
        while (walker.nextNode()) {
            textParts.push(walker.currentNode.textContent.trim());
        }
        return textParts.join(' ');
    }, []);

    const speak = useCallback((text) => {
        if (!isSupported || !text) return;

        // Cancel any ongoing speech
        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.rate = rate;
        utterance.pitch = 1;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        speechSynthesis.speak(utterance);
    }, [isSupported, selectedVoice, rate]);

    const handleReadPage = () => {
        const text = textToRead || getPageText();
        speak(text);
    };

    const handleReadSelection = () => {
        const selection = window.getSelection().toString().trim();
        if (selection) {
            speak(selection);
        }
    };

    const handlePause = () => {
        if (isSpeaking && !isPaused) {
            speechSynthesis.pause();
            setIsPaused(true);
        }
    };

    const handleResume = () => {
        if (isPaused) {
            speechSynthesis.resume();
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    };

    if (!isSupported) {
        return null;
    }

    return (
        <div className="voice-controls" role="region" aria-label="Voice reader controls">
            {/* Main toggle button */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`voice-btn ${isExpanded ? 'active' : ''}`}
                aria-label={isExpanded ? 'Close voice reader controls' : 'Open voice reader controls'}
                aria-expanded={isExpanded}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                >
                    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                </svg>
            </button>

            {/* Expanded controls */}
            {isExpanded && (
                <div
                    className="card"
                    style={{
                        position: 'absolute',
                        bottom: '70px',
                        right: 0,
                        width: '280px',
                        zIndex: 101
                    }}
                    role="group"
                    aria-label="Voice reader options"
                >
                    <h3 className="card-header" style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>
                        Voice Reader
                    </h3>

                    {/* Playback controls */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        {!isSpeaking ? (
                            <>
                                <button
                                    onClick={handleReadPage}
                                    className="btn btn-primary"
                                    style={{ flex: 1, minHeight: '40px', padding: '0.5rem' }}
                                    aria-label="Read entire page content"
                                >
                                    Read Page
                                </button>
                                <button
                                    onClick={handleReadSelection}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, minHeight: '40px', padding: '0.5rem' }}
                                    aria-label="Read selected text"
                                >
                                    Read Selection
                                </button>
                            </>
                        ) : (
                            <>
                                {isPaused ? (
                                    <button
                                        onClick={handleResume}
                                        className="btn btn-primary"
                                        style={{ flex: 1, minHeight: '40px', padding: '0.5rem' }}
                                        aria-label="Resume reading"
                                    >
                                        Resume
                                    </button>
                                ) : (
                                    <button
                                        onClick={handlePause}
                                        className="btn btn-secondary"
                                        style={{ flex: 1, minHeight: '40px', padding: '0.5rem' }}
                                        aria-label="Pause reading"
                                    >
                                        Pause
                                    </button>
                                )}
                                <button
                                    onClick={handleStop}
                                    className="btn btn-danger"
                                    style={{ flex: 1, minHeight: '40px', padding: '0.5rem' }}
                                    aria-label="Stop reading"
                                >
                                    Stop
                                </button>
                            </>
                        )}
                    </div>

                    {/* Speed control */}
                    <div style={{ marginBottom: '0.75rem' }}>
                        <label
                            htmlFor="speech-rate"
                            style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}
                        >
                            Speed: {rate}x
                        </label>
                        <input
                            id="speech-rate"
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.25"
                            value={rate}
                            onChange={(e) => setRate(parseFloat(e.target.value))}
                            style={{ minHeight: '20px' }}
                            aria-valuemin="0.5"
                            aria-valuemax="2"
                            aria-valuenow={rate}
                            aria-valuetext={`${rate} times speed`}
                        />
                    </div>

                    {/* Voice selection */}
                    {voices.length > 0 && (
                        <div>
                            <label
                                htmlFor="voice-select"
                                style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}
                            >
                                Voice
                            </label>
                            <select
                                id="voice-select"
                                value={selectedVoice?.name || ''}
                                onChange={(e) => {
                                    const voice = voices.find(v => v.name === e.target.value);
                                    setSelectedVoice(voice);
                                }}
                                style={{ fontSize: '0.875rem', padding: '0.5rem' }}
                            >
                                {voices.filter(v => v.lang.startsWith('en')).map((voice) => (
                                    <option key={voice.name} value={voice.name}>
                                        {voice.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Status announcement */}
                    <div
                        role="status"
                        aria-live="polite"
                        className="sr-only"
                    >
                        {isSpeaking
                            ? isPaused
                                ? 'Speech paused'
                                : 'Reading content'
                            : 'Speech stopped'
                        }
                    </div>
                </div>
            )}
        </div>
    );
};

export default VoiceReader;
