import React, { useState, useEffect } from 'react';

const SignLanguage = () => {
    const [inputText, setInputText] = useState('');
    const [isTranslating, setIsTranslating] = useState(false);
    const [centers, setCenters] = useState([]);
    const [explanation, setExplanation] = useState('');

    useEffect(() => {
        fetch('/api/sign-language/centers')
            .then(res => res.json())
            .then(data => setCenters(data))
            .catch(err => console.error('Error fetching centers:', err));
    }, []);

    const handleTranslate = async () => {
        if (!inputText.trim()) return;
        setIsTranslating(true);

        try {
            const res = await fetch('/api/sign-language/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: inputText })
            });
            const data = await res.json();
            if (data.explanation) {
                setExplanation(data.explanation);
            }
        } catch (err) {
            console.error("Translation error:", err);
        } finally {
            setIsTranslating(false);
        }
    };

    return (
        <div className="page" style={{ paddingTop: '80px' }}>
            <div className="container">
                <h1 className="hero-title animate-fadeIn" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
                    🤟 Sign Language Interpreter
                </h1>
                <p className="hero-subtitle animate-fadeIn" style={{ animationDelay: '0.1s', marginBottom: '3rem' }}>
                    Bridging the communication gap with AI-powered Text-to-Sign translation and resources.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>

                    {/* Translator Section */}
                    <section className="glass-panel animate-fadeIn" style={{ animationDelay: '0.2s', padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            🔤 Text to Sign (BETA)
                        </h2>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Enter text to translate</label>
                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Type something here (e.g., 'Hello, how are you?')"
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--color-bg)',
                                    border: '1px solid var(--color-border)',
                                    color: 'var(--color-text-primary)',
                                    minHeight: '100px',
                                    resize: 'vertical'
                                }}
                            />
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={handleTranslate}
                            disabled={isTranslating || !inputText}
                            style={{ width: '100%', marginBottom: '2rem' }}
                        >
                            {isTranslating ? 'Translating...' : 'Translate to Sign Language'}
                        </button>

                        {/* Video Placeholder */}
                        <div style={{
                            aspectRatio: '16/9',
                            background: '#000',
                            borderRadius: 'var(--radius-md)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '1px solid var(--color-border)',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            {isTranslating ? (
                                <div className="loading-spinner"></div>
                            ) : (
                                <div style={{ textAlign: 'center', color: '#888' }}>
                                    <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>👋</span>
                                    <p>{inputText ? "Visual representation would appear here" : "Sign language avatar area"}</p>
                                </div>
                            )}
                            <div style={{ position: 'absolute', bottom: '10px', right: '10px', background: 'rgba(0,0,0,0.7)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', color: 'white' }}>
                                AI PREVIEW
                            </div>
                        </div>

                        {explanation && (
                            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>AI Sign Description:</h3>
                                <p style={{ lineHeight: '1.6', color: 'var(--color-text-secondary)' }}>{explanation}</p>
                            </div>
                        )}
                    </section>

                    {/* Resources Section */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                        {/* Interpreters List */}
                        <section className="glass-panel animate-fadeIn" style={{ animationDelay: '0.3s', padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>📍 Nearby Interpretation Centers</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {centers.map((center, idx) => (
                                    <div key={center.id || idx} style={{
                                        padding: '1rem',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)',
                                        background: 'rgba(255,255,255,0.03)'
                                    }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', margin: 0 }}>{center.name}</h3>
                                            <span style={{
                                                fontSize: '0.75rem',
                                                padding: '0.1rem 0.5rem',
                                                borderRadius: '1rem',
                                                border: '1px solid currentColor',
                                                color: center.status.includes('Open') || center.status.includes('Available') ? 'var(--color-success)' : 'var(--color-text-secondary)'
                                            }}>{center.status}</span>
                                        </div>
                                        <p style={{ margin: '0 0 0.5rem 0', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>{center.address}</p>
                                        <a href={`tel:${center.phone}`} style={{ color: 'var(--color-primary-light)', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '500' }}>📞 {center.phone}</a>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Educational Resources */}
                        <section className="glass-panel animate-fadeIn" style={{ animationDelay: '0.4s', padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--color-bg-glass)', border: '1px solid var(--color-border)' }}>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>📚 Learn ASL</h2>
                            <ul style={{ paddingLeft: '1.5rem', color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--color-primary-light)' }}>Gallaudet University Free Online Courses</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--color-primary-light)' }}>Start ASL - Beginner Lessons</a></li>
                                <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ color: 'var(--color-primary-light)' }}>HandSpeak Dictionary</a></li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignLanguage;
