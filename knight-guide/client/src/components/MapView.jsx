import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map center updates
const ChangeView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center, zoom);
    }, [center, zoom, map]);
    return null;
};

const MapView = ({
    locations = [],
    center = [40.7128, -74.006],
    zoom = 13,
    onLocationSelect = () => { },
    filters = []
}) => {
    // Filter locations
    const filteredLocations = locations.filter(loc => {
        if (filters.length === 0) return true;
        return filters.some(filter => loc.accessibilityFeatures?.includes(filter));
    });

    const getScoreColor = (score) => {
        if (score >= 80) return '#166534';
        if (score >= 50) return '#92400e';
        return '#991b1b';
    };

    return (
        <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden', zIndex: 0 }}>
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <ChangeView center={center} zoom={zoom} />

                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {filteredLocations.map((loc, idx) => (
                    <Marker
                        key={loc.id || idx}
                        position={[loc.latitude, loc.longitude]}
                    >
                        <Popup>
                            <div style={{ minWidth: '200px' }}>
                                <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{loc.name}</h3>
                                <div style={{
                                    display: 'inline-block',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    color: 'white',
                                    backgroundColor: getScoreColor(loc.accessibilityScore),
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    marginBottom: '5px'
                                }}>
                                    Score: {loc.accessibilityScore}
                                </div>
                                <p style={{ margin: '0', fontSize: '13px', color: '#666' }}>{loc.category}</p>
                                {loc.accessibilityFeatures && (
                                    <div style={{ marginTop: '5px', fontSize: '11px', color: '#444' }}>
                                        {loc.accessibilityFeatures.join(', ')}
                                    </div>
                                )}
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default MapView;
