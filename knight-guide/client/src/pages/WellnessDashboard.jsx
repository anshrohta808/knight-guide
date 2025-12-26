import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const WellnessDashboard = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("Disconnected");
  const [showReport, setShowReport] = useState(false);
  const [simulationHistory, setSimulationHistory] = useState([]);

  // Initial health metrics
  const [metrics, setMetrics] = useState({
    heartRate: {
      value: 0,
      unit: "bpm",
      status: "Disconnected",
      avg: 0,
      min: 0,
      max: 0,
    },
    bloodPressure: {
      systolic: 0,
      diastolic: 0,
      map: 0,
      status: "Disconnected",
    },
    bloodSugar: { value: 0, unit: "mg/dL", status: "Disconnected", last: 0 },
    stressScore: { value: 0, status: "Disconnected", trend: "stable" },
    movement: {
      value: 0,
      unit: "steps",
      status: "Disconnected",
      lastHr: 0,
      goal: 10000,
    },
  });

  useEffect(() => {
    if (isConnected) {
      setMetrics({
        heartRate: {
          value: 72,
          unit: "bpm",
          status: "Good",
          avg: 72,
          min: 50,
          max: 100,
        },
        bloodPressure: {
          systolic: 120,
          diastolic: 78,
          map: 92,
          status: "Good",
        },
        bloodSugar: { value: 110, unit: "mg/dL", status: "Good", last: 110 },
        stressScore: { value: 32, status: "Good", trend: "stable" },
        movement: {
          value: 180,
          unit: "steps",
          status: "Good",
          lastHr: 180,
          goal: 10000,
        },
      });
    } else {
      setMetrics({
        heartRate: {
          value: 0,
          unit: "bpm",
          status: "Disconnected",
          avg: 0,
          min: 0,
          max: 0,
        },
        bloodPressure: {
          systolic: 0,
          diastolic: 0,
          map: 0,
          status: "Disconnected",
        },
        bloodSugar: {
          value: 0,
          unit: "mg/dL",
          status: "Disconnected",
          last: 0,
        },
        stressScore: { value: 0, status: "Disconnected", trend: "stable" },
        movement: {
          value: 0,
          unit: "steps",
          status: "Disconnected",
          lastHr: 0,
          goal: 10000,
        },
      });
    }
  }, [isConnected]);

  // Toggle Simulation
  const toggleSimulation = () => {
    if (isSimulating) {
      setShowReport(true);
      // Generate mock report data if history is short
      if (simulationHistory.length < 10) {
        const mockData = [];
        const startTime = new Date();
        for (let i = 0; i < 20; i++) {
          const time = new Date(
            startTime.getTime() + i * 2000
          ).toLocaleTimeString();
          mockData.push({
            time,
            heartRate: 70 + Math.floor(Math.random() * 20), // 70-90 bpm
            systolic: 115 + Math.floor(Math.random() * 15), // 115-130
            diastolic: 75 + Math.floor(Math.random() * 10), // 75-85
            steps: 180 + i * 5 + Math.floor(Math.random() * 10), // increasing steps
            stress: 30 + Math.floor(Math.random() * 20), // 30-50
          });
        }
        setSimulationHistory(mockData);
      }
    } else {
      setShowReport(false);
      setSimulationHistory([]);
    }
    setIsSimulating(!isSimulating);
  };

  // Connect Smartwatch Mock
  const handleConnect = () => {
    if (isConnected) {
      setIsConnected(false);
      setConnectionStatus("Disconnected");
      setIsSimulating(false);
      return;
    }

    setConnectionStatus("Searching...");
    setTimeout(() => {
      setConnectionStatus("Connecting...");
      setTimeout(() => {
        setIsConnected(true);
        setConnectionStatus("Connected to Galaxy Watch 6");
        setIsSimulating(true); // Auto start simulation on connect
      }, 1500);
    }, 1000);
  };

  // SOS Trigger
  const handleSOS = () => {
    const confirmSOS = window.confirm(
      "INITIATE EMERGENCY SOS?\n\nThis will alert your emergency contacts and share your current location and health vitals."
    );
    if (confirmSOS) {
      alert("SOS ALERT SENT! Emergency services have been notified.");
    }
  };

  // Simulation Effect
  useEffect(() => {
    let interval;
    if (isSimulating) {
      interval = setInterval(() => {
        setMetrics((prev) => {
          // Fluctuate Heart Rate
          const newHr = textClamp(
            prev.heartRate.value +
              (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3),
            60,
            95
          );

          // Fluctuate BP
          const newSys = textClamp(
            prev.bloodPressure.systolic +
              (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2),
            110,
            130
          );
          const newDia = textClamp(
            prev.bloodPressure.diastolic +
              (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2),
            70,
            85
          );

          // Steps increase
          const newSteps = prev.movement.value + Math.floor(Math.random() * 5);

          const newMetrics = {
            ...prev,
            heartRate: {
              ...prev.heartRate,
              value: newHr,
              status: newHr > 100 ? "Warning" : "Good",
            },
            bloodPressure: {
              ...prev.bloodPressure,
              systolic: newSys,
              diastolic: newDia,
              map: Math.floor((newSys + 2 * newDia) / 3),
            },
            movement: {
              ...prev.movement,
              value: newSteps,
            },
          };

          // Add to history
          setSimulationHistory((hist) => [
            ...hist,
            {
              time: new Date().toLocaleTimeString(),
              heartRate: newHr,
              systolic: newSys,
              diastolic: newDia,
              steps: newSteps,
              stress:
                prev.stressScore.value + Math.floor(Math.random() * 5 - 2),
            },
          ]);

          return newMetrics;
        });
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isSimulating]);

  const textClamp = (val, min, max) => Math.min(Math.max(val, min), max);

  // Helper for status color
  const getStatusColor = (status) => {
    switch (status) {
      case "Good":
        return "#22c55e"; // Green
      case "Warning":
        return "#f59e0b"; // Amber
      case "Danger":
        return "#ef4444"; // Red
      default:
        return "#9ca3af";
    }
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: "1200px" }}>
        {/* Header */}
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
              }}
            >
              AI Wellness Dashboard
            </h1>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "1.1rem",
              }}
            >
              Live health overview — works with smartwatches and mobile sensors.
            </p>
          </div>

          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={handleConnect}
              className={`btn ${isConnected ? "btn-outline" : "btn-secondary"}`}
              style={{ minWidth: "180px" }}
            >
              {isConnected ? "✓ Connected" : "Connect Smartwatch"}
            </button>

            <button
              onClick={toggleSimulation}
              className="btn btn-primary"
              disabled={!isConnected}
              style={{ opacity: isConnected ? 1 : 0.5 }}
            >
              {isSimulating ? "Pause Simulation" : "Start Simulation"}
            </button>

            <button
              onClick={handleSOS}
              className="btn"
              style={{
                background: "#ef4444",
                color: "white",
                fontWeight: "bold",
                padding: "0.75rem 1.5rem",
                boxShadow: "0 0 15px rgba(239, 68, 68, 0.5)",
              }}
            >
              SOS
            </button>
          </div>
        </header>

        {/* Connection Status Bar if connecting */}
        {connectionStatus !== "Disconnected" &&
          connectionStatus !== "Connected to Galaxy Watch 6" && (
            <div
              style={{
                background: "rgba(37, 99, 235, 0.1)",
                color: "var(--color-primary-light)",
                padding: "0.75rem",
                borderRadius: "8px",
                marginBottom: "2rem",
                textAlign: "center",
                fontWeight: "600",
              }}
            >
              ⌚ {connectionStatus}
            </div>
          )}

        {/* Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {/* Heart Rate Card */}
          <MetricCard
            title="Heart Rate"
            status={metrics.heartRate.status}
            statusColor={getStatusColor(metrics.heartRate.status)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "2.5rem", fontWeight: "800" }}>
                {metrics.heartRate.value}
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  marginLeft: "0.5rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                bpm
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <span>
                Normal range: {metrics.heartRate.min}-{metrics.heartRate.max}{" "}
                bpm
              </span>
              <span>Avg: {metrics.heartRate.avg} bpm</span>
            </div>
          </MetricCard>

          {/* Blood Pressure Card */}
          <MetricCard
            title="Blood Pressure"
            status={metrics.bloodPressure.status}
            statusColor={getStatusColor(metrics.bloodPressure.status)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "2.5rem", fontWeight: "800" }}>
                {metrics.bloodPressure.systolic} /{" "}
                {metrics.bloodPressure.diastolic}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <span>Target: below 140/90</span>
              <span>MAP: {metrics.bloodPressure.map}</span>
            </div>
          </MetricCard>

          {/* Blood Sugar Card */}
          <MetricCard
            title="Blood Sugar"
            status={metrics.bloodSugar.status}
            statusColor={getStatusColor(metrics.bloodSugar.status)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "2.5rem", fontWeight: "800" }}>
                {metrics.bloodSugar.value}
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  marginLeft: "0.5rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                mg/dL
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <span>Fasting target: &lt; 126 mg/dL</span>
              <span style={{ textAlign: "right" }}>
                Last: {metrics.bloodSugar.last}
                <br />
                mg/dL
              </span>
            </div>
          </MetricCard>

          {/* Stress Score Card */}
          <MetricCard
            title="Stress Score"
            status={metrics.stressScore.status}
            statusColor={getStatusColor(metrics.stressScore.status)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "2.5rem", fontWeight: "800" }}>
                {metrics.stressScore.value}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <span>0-100 (higher = more stress)</span>
              <span>Trend: {metrics.stressScore.trend}</span>
            </div>
          </MetricCard>

          {/* Movement Card */}
          <MetricCard
            title="Movement"
            status={metrics.movement.status}
            statusColor={getStatusColor(metrics.movement.status)}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                marginBottom: "0.5rem",
              }}
            >
              <span style={{ fontSize: "2.5rem", fontWeight: "800" }}>
                {metrics.movement.value}
              </span>
              <span
                style={{
                  fontSize: "1rem",
                  marginLeft: "0.5rem",
                  color: "var(--color-text-secondary)",
                }}
              >
                steps
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                color: "var(--color-text-secondary)",
              }}
            >
              <span>Goal: {metrics.movement.goal} steps</span>
              <span style={{ textAlign: "right" }}>
                Last hr: {metrics.movement.lastHr}
                <br />
                steps
              </span>
            </div>
          </MetricCard>
        </div>

        {/* Wellness Report */}
        {showReport && (
          <div
            style={{
              marginTop: "3rem",
              padding: "2rem",
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "16px",
              border: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
                textAlign: "center",
              }}
            >
              Wellness Simulation Report
            </h2>
            <p
              style={{
                textAlign: "center",
                color: "var(--color-text-secondary)",
                marginBottom: "2rem",
              }}
            >
              Detailed analysis of your health metrics during the simulation
              period.
            </p>

            {/* Summary Stats */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "1rem",
                marginBottom: "2rem",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "8px",
                }}
              >
                <h4>Average Heart Rate</h4>
                <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {simulationHistory.length > 0
                    ? Math.round(
                        simulationHistory.reduce(
                          (sum, h) => sum + h.heartRate,
                          0
                        ) / simulationHistory.length
                      )
                    : 72}{" "}
                  bpm
                </span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "8px",
                }}
              >
                <h4>Total Steps</h4>
                <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {simulationHistory.length > 0
                    ? simulationHistory[simulationHistory.length - 1].steps -
                      simulationHistory[0].steps
                    : 0}
                </span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "8px",
                }}
              >
                <h4>Simulation Duration</h4>
                <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
                  {simulationHistory.length * 2} seconds
                </span>
              </div>
              <div
                style={{
                  textAlign: "center",
                  padding: "1rem",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: "8px",
                }}
              >
                <h4>Overall Status</h4>
                <span
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#22c55e",
                  }}
                >
                  Good
                </span>
              </div>
            </div>

            {/* Charts */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
                marginBottom: "2rem",
              }}
            >
              {/* Heart Rate Chart */}
              <div>
                <h3 style={{ marginBottom: "1rem" }}>Heart Rate Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={simulationHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="heartRate"
                      stroke="#8884d8"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Blood Pressure Chart */}
              <div>
                <h3 style={{ marginBottom: "1rem" }}>Blood Pressure Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={simulationHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="systolic"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="diastolic"
                      stroke="#ffc658"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Steps and Stress */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "2rem",
              }}
            >
              <div>
                <h3 style={{ marginBottom: "1rem" }}>Steps Over Time</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={simulationHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="steps" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div>
                <h3 style={{ marginBottom: "1rem" }}>Stress Level Trend</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={simulationHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="stress"
                      stroke="#ff7300"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendations */}
            <div
              style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "rgba(34, 197, 94, 0.1)",
                borderRadius: "8px",
                border: "1px solid rgba(34, 197, 94, 0.3)",
              }}
            >
              <h3 style={{ color: "#22c55e", marginBottom: "1rem" }}>
                AI Recommendations
              </h3>
              <ul
                style={{
                  color: "var(--color-text-secondary)",
                  lineHeight: "1.6",
                }}
              >
                <li>
                  Continue maintaining your heart rate within the healthy range
                  (60-100 bpm)
                </li>
                <li>
                  Your blood pressure readings are stable and within normal
                  limits
                </li>
                <li>
                  Increase daily step goal to 12,000 for better cardiovascular
                  health
                </li>
                <li>
                  Practice stress management techniques like deep breathing
                  during high stress periods
                </li>
                <li>
                  Schedule regular health check-ups to monitor long-term trends
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Reusable Card Component
const MetricCard = ({ title, status, statusColor, children }) => (
  <div
    style={{
      background: "rgba(255, 255, 255, 0.03)",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      borderRadius: "16px",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
    }}
  >
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "1.5rem",
      }}
    >
      <h3 style={{ fontSize: "1.1rem", fontWeight: "700", margin: 0 }}>
        {title}
      </h3>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <span
          style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: statusColor,
            boxShadow: `0 0 8px ${statusColor}`,
          }}
        />
        <span
          style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)" }}
        >
          {status}
        </span>
      </div>
    </div>
    {children}
  </div>
);

export default WellnessDashboard;
