import React, { useState, useEffect } from 'react';

const WellnessDashboard = () => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Disconnected');

    // Initial health metrics
    const [metrics, setMetrics] = useState({
        heartRate: { value: 72, unit: 'bpm', status: 'Good', avg: 72, min: 50, max: 100 },
        bloodPressure: { systolic: 120, diastolic: 78, map: 92, status: 'Good' },
        bloodSugar: { value: 110, unit: 'mg/dL', status: 'Good', last: 110 },
        stressScore: { value: 32, status: 'Good', trend: 'stable' },
        movement: { value: 180, unit: 'steps', status: 'Good', lastHr: 180, goal: 10000 }
    });

    // Toggle Simulation
    const toggleSimulation = () => {
        setIsSimulating(!isSimulating);
    };

    // Connect Smartwatch Mock
    const handleConnect = () => {
        if (isConnected) {
            setIsConnected(false);
            setConnectionStatus('Disconnected');
            setIsSimulating(false);
            return;
        }

        setConnectionStatus('Searching...');
        setTimeout(() => {
            setConnectionStatus('Connecting...');
            setTimeout(() => {
                setIsConnected(true);
                setConnectionStatus('Connected to Galaxy Watch 6');
                setIsSimulating(true); // Auto start simulation on connect
            }, 1500);
        }, 1000);
    };

    // SOS Trigger
    const handleSOS = () => {
        const confirmSOS = window.confirm("INITIATE EMERGENCY SOS?\n\nThis will alert your emergency contacts and share your current location and health vitals.");
        if (confirmSOS) {
            alert("SOS ALERT SENT! Emergency services have been notified.");
        }
    };

    // Simulation Effect
    useEffect(() => {
        let interval;
        if (isSimulating) {
            interval = setInterval(() => {
                setMetrics(prev => {
                    // Fluctuate Heart Rate
                    const newHr = textClamp(prev.heartRate.value + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3), 60, 95);

                    // Fluctuate BP
                    const newSys = textClamp(prev.bloodPressure.systolic + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2), 110, 130);
                    const newDia = textClamp(prev.bloodPressure.diastolic + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 2), 70, 85);

                    // Steps increase
                    const newSteps = prev.movement.value + Math.floor(Math.random() * 5);

                    return {
                        ...prev,
                        heartRate: {
                            ...prev.heartRate,
                            value: newHr,
                            status: newHr > 100 ? 'Warning' : 'Good'
                        },
                        bloodPressure: {
                            ...prev.bloodPressure,
                            systolic: newSys,
                            diastolic: newDia,
                            map: Math.floor((newSys + (2 * newDia)) / 3)
                        },
                        movement: {
                            ...prev.movement,
                            value: newSteps
                        }
                    };
                });
            }, 2000);
        }
        return () => clearInterval(interval);
    }, [isSimulating]);

    const textClamp = (val, min, max) => Math.min(Math.max(val, min), max);

    // Helper for status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Good': return '#22c55e'; // Green
            case 'Warning': return '#f59e0b'; // Amber
            case 'Danger': return '#ef4444'; // Red
            default: return '#9ca3af';
        }
    };

    return (
        <div className="page">
            <div className="container" style={{ maxWidth: '1200px' }}>
                {/* Header */}
                <header style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                            AI Wellness Dashboard
                        </h1>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>
                            Live health overview — works with smartwatches and mobile sensors.
                        </p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button
                            onClick={handleConnect}
                            className={`btn ${isConnected ? 'btn-outline' : 'btn-secondary'}`}
                            style={{ minWidth: '180px' }}
                        >
                            {isConnected ? '✓ Connected' : 'Connect Smartwatch'}
                        </button>

                        <button
                            onClick={toggleSimulation}
                            className="btn btn-primary"
                            disabled={!isConnected}
                            style={{ opacity: isConnected ? 1 : 0.5 }}
                        >
                            {isSimulating ? 'Pause Simulation' : 'Start Simulation'}
                        </button>

                        <button
                            onClick={handleSOS}
                            className="btn"
                            style={{
                                background: '#ef4444',
                                color: 'white',
                                fontWeight: 'bold',
                                padding: '0.75rem 1.5rem',
                                boxShadow: '0 0 15px rgba(239, 68, 68, 0.5)'
                            }}
                        >
                            SOS
                        </button>
                    </div>
                </header>

                {/* Connection Status Bar if connecting */}
                {connectionStatus !== 'Disconnected' && connectionStatus !== 'Connected to Galaxy Watch 6' && (
                    <div style={{
                        background: 'rgba(37, 99, 235, 0.1)',
                        color: 'var(--color-primary-light)',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        marginBottom: '2rem',
                        textAlign: 'center',
                        fontWeight: '600'
                    }}>
                        ⌚ {connectionStatus}
                    </div>
                )}

                {/* Metrics Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.5rem'
                }}>

                    {/* Heart Rate Card */}
                    <MetricCard
                        title="Heart Rate"
                        status={metrics.heartRate.status}
                        statusColor={getStatusColor(metrics.heartRate.status)}
                    >
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{metrics.heartRate.value}</span>
                            <span style={{ fontSize: '1rem', marginLeft: '0.5rem', color: 'var(--color-text-secondary)' }}>bpm</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                            <span>Normal range: {metrics.heartRate.min}-{metrics.heartRate.max} bpm</span>
                            <span>Avg: {metrics.heartRate.avg} bpm</span>
                        </div>
                    </MetricCard>

                    {/* Blood Pressure Card */}
                    <MetricCard
                        title="Blood Pressure"
                        status={metrics.bloodPressure.status}
                        statusColor={getStatusColor(metrics.bloodPressure.status)}
                    >
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>
                                {metrics.bloodPressure.systolic} / {metrics.bloodPressure.diastolic}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
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
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{metrics.bloodSugar.value}</span>
                            <span style={{ fontSize: '1rem', marginLeft: '0.5rem', color: 'var(--color-text-secondary)' }}>mg/dL</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                            <span>Fasting target: &lt; 126 mg/dL</span>
                            <span style={{ textAlign: 'right' }}>Last: {metrics.bloodSugar.last}<br />mg/dL</span>
                        </div>
                    </MetricCard>

                    {/* Stress Score Card */}
                    <MetricCard
                        title="Stress Score"
                        status={metrics.stressScore.status}
                        statusColor={getStatusColor(metrics.stressScore.status)}
                    >
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{metrics.stressScore.value}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
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
                        <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '2.5rem', fontWeight: '800' }}>{metrics.movement.value}</span>
                            <span style={{ fontSize: '1rem', marginLeft: '0.5rem', color: 'var(--color-text-secondary)' }}>steps</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                            <span>Goal: {metrics.movement.goal} steps</span>
                            <span style={{ textAlign: 'right' }}>Last hr: {metrics.movement.lastHr}<br />steps</span>
                        </div>
                    </MetricCard>

                </div>
            </div>
        </div>
    );
};

// Reusable Card Component
const MetricCard = ({ title, status, statusColor, children }) => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', margin: 0 }}>{title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: statusColor,
                    boxShadow: `0 0 8px ${statusColor}`
                }} />
                <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{status}</span>
            </div>
        </div>
        {children}
    </div>
);

export default WellnessDashboard;
