import React, { useState, useEffect, useRef } from "react";

const emojiMap = {
  hello: "👋",
  thank: "🙏",
  assistance: "🆘",
  bathroom: "🚻",
  deaf: "🙉",
  slowly: "🐌",
  help: "🆘",
  you: "👉",
  how: "🤔",
};

const SignLanguage = () => {
  const [inputText, setInputText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [centers, setCenters] = useState([]);
  const [explanation, setExplanation] = useState("");
  const [mode, setMode] = useState("text-to-sign"); // 'text-to-sign' or 'sign-to-text'
  const [isRecording, setIsRecording] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [previewEmojis, setPreviewEmojis] = useState([]);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetch("/api/sign-language/centers")
      .then((res) => res.json())
      .then((data) => setCenters(data))
      .catch((err) => console.error("Error fetching centers:", err));
  }, []);

  useEffect(() => {
    const words = inputText.toLowerCase().split(/\s+/);
    const emojis = new Set();
    words.forEach((word) => {
      const cleanWord = word.replace(/[^\w]/g, "");
      if (emojiMap[cleanWord]) {
        emojis.add(emojiMap[cleanWord]);
      }
    });
    setPreviewEmojis(Array.from(emojis));
  }, [inputText]);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);

    try {
      const res = await fetch("/api/sign-language/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
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

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Camera access denied or not available.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      stopCamera();
      // Mock recognition
      const mockTexts = [
        "Hello, how are you?",
        "Thank you for your help",
        "I need assistance",
        "Where is the bathroom?",
        "I am deaf",
        "Please speak slowly",
      ];
      const randomText =
        mockTexts[Math.floor(Math.random() * mockTexts.length)];
      setRecognizedText(randomText);
    } else {
      setIsRecording(true);
      startCamera();
    }
  };

  return (
    <div className="page" style={{ paddingTop: "80px" }}>
      <div className="container">
        <h1
          className="hero-title animate-fadeIn"
          style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
        >
          🤟 Sign Language Interpreter
        </h1>
        <p
          className="hero-subtitle animate-fadeIn"
          style={{ animationDelay: "0.1s", marginBottom: "3rem" }}
        >
          Bridging the communication gap with AI-powered Text-to-Sign
          translation and resources.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "3rem",
          }}
        >
          {/* Mode Selector */}
          <div
            className="glass-panel animate-fadeIn"
            style={{
              animationDelay: "0.1s",
              padding: "1rem",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg-glass)",
              border: "1px solid var(--color-border)",
              marginBottom: "1rem",
            }}
          >
            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                className={`btn ${
                  mode === "text-to-sign" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setMode("text-to-sign")}
              >
                Text to Sign
              </button>
              <button
                className={`btn ${
                  mode === "sign-to-text" ? "btn-primary" : "btn-outline"
                }`}
                onClick={() => setMode("sign-to-text")}
              >
                Sign to Text
              </button>
            </div>
          </div>

          {/* Translator Section */}
          <section
            className="glass-panel animate-fadeIn"
            style={{
              animationDelay: "0.2s",
              padding: "2rem",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-bg-glass)",
              border: "1px solid var(--color-border)",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {mode === "text-to-sign"
                ? "🔤 Text to Sign (BETA)"
                : "📹 Sign to Text (BETA)"}
            </h2>

            {mode === "text-to-sign" ? (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Enter text to translate
                  </label>
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type something here (e.g., 'Hello, how are you?')"
                    style={{
                      width: "100%",
                      padding: "1rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-bg)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-primary)",
                      minHeight: "100px",
                      resize: "vertical",
                    }}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={handleTranslate}
                  disabled={isTranslating || !inputText}
                  style={{ width: "100%", marginBottom: "2rem" }}
                >
                  {isTranslating
                    ? "Translating..."
                    : "Translate to Sign Language"}
                </button>
              </>
            ) : (
              <>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                    }}
                  >
                    Use camera to sign
                  </label>
                  <button
                    className={`btn ${
                      isRecording ? "btn-danger" : "btn-primary"
                    }`}
                    onClick={handleRecord}
                    style={{ width: "100%", marginBottom: "1rem" }}
                  >
                    {isRecording ? "Stop Recording" : "Start Recording"}
                  </button>
                </div>
                {recognizedText && (
                  <div
                    style={{
                      marginBottom: "1.5rem",
                      padding: "1rem",
                      background: "rgba(34, 197, 94, 0.1)",
                      borderRadius: "var(--radius-md)",
                      border: "1px solid rgba(34, 197, 94, 0.3)",
                    }}
                  >
                    <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                      Recognized Text:
                    </h3>
                    <p
                      style={{
                        lineHeight: "1.6",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {recognizedText}
                    </p>
                  </div>
                )}
              </>
            )}

            {/* Video Section */}
            <div
              style={{
                aspectRatio: "16/9",
                background: "#000",
                borderRadius: "var(--radius-md)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid var(--color-border)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {mode === "text-to-sign" ? (
                isTranslating ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <div style={{ textAlign: "center", color: "#fff" }}>
                    <span
                      style={{
                        fontSize: "3rem",
                        display: "block",
                        marginBottom: "1rem",
                      }}
                    >
                      {previewEmojis.length > 0
                        ? previewEmojis.join(" ")
                        : "👋"}
                    </span>
                    <p>
                      {inputText
                        ? "Visual representation would appear here"
                        : "Sign language avatar area"}
                    </p>
                  </div>
                )
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
              <div
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  background: "rgba(0,0,0,0.7)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontSize: "0.7rem",
                  color: "white",
                }}
              >
                {mode === "text-to-sign" ? "AI PREVIEW" : "LIVE CAMERA"}
              </div>
            </div>

            {mode === "text-to-sign" && explanation && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>
                  AI Sign Description:
                </h3>
                <p
                  style={{
                    lineHeight: "1.6",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {explanation}
                </p>
              </div>
            )}
          </section>

          {/* Resources Section */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
          >
            {/* Interpreters List */}
            <section
              className="glass-panel animate-fadeIn"
              style={{
                animationDelay: "0.3s",
                padding: "2rem",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-bg-glass)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1.5rem" }}>
                📍 Nearby Interpretation Centers
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {centers.map((center, idx) => (
                  <div
                    key={center.id || idx}
                    style={{
                      padding: "1rem",
                      border: "1px solid var(--color-border)",
                      borderRadius: "var(--radius-md)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.25rem",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "600",
                          margin: 0,
                        }}
                      >
                        {center.name}
                      </h3>
                      <span
                        style={{
                          fontSize: "0.75rem",
                          padding: "0.1rem 0.5rem",
                          borderRadius: "1rem",
                          border: "1px solid currentColor",
                          color:
                            center.status.includes("Open") ||
                            center.status.includes("Available")
                              ? "var(--color-success)"
                              : "var(--color-text-secondary)",
                        }}
                      >
                        {center.status}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: "var(--color-text-secondary)",
                        fontSize: "0.9rem",
                      }}
                    >
                      {center.address}
                    </p>
                    <a
                      href={`tel:${center.phone}`}
                      style={{
                        color: "var(--color-primary-light)",
                        textDecoration: "none",
                        fontSize: "0.9rem",
                        fontWeight: "500",
                      }}
                    >
                      📞 {center.phone}
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Educational Resources */}
            <section
              className="glass-panel animate-fadeIn"
              style={{
                animationDelay: "0.4s",
                padding: "2rem",
                borderRadius: "var(--radius-lg)",
                background: "var(--color-bg-glass)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
                📚 Learn ASL
              </h2>
              <ul
                style={{
                  paddingLeft: "1.5rem",
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.6",
                }}
              >
                <li style={{ marginBottom: "0.5rem" }}>
                  <a href="#" style={{ color: "var(--color-primary-light)" }}>
                    Gallaudet University Free Online Courses
                  </a>
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <a href="#" style={{ color: "var(--color-primary-light)" }}>
                    Start ASL - Beginner Lessons
                  </a>
                </li>
                <li style={{ marginBottom: "0.5rem" }}>
                  <a href="#" style={{ color: "var(--color-primary-light)" }}>
                    HandSpeak Dictionary
                  </a>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignLanguage;
