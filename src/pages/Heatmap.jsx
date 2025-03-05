import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "heatmap.js";
import "leaflet-heatmap";

const Heatmap = () => {
    const heatmapData = [
        { lat: 18.540194, lng: 73.897395, intensity: 0.8 },
        { lat: 18.544425, lng: 73.921482, intensity: 0.6 },
        { lat: 18.554385, lng: 73.882653, intensity: 0.9 },
        { lat: 18.547861, lng: 73.862354, intensity: 0.7 },
        { lat: 18.536707, lng: 73.918600, intensity: 1.0 },
    ];

    const warehouseLocations = [
        { lat: 18.540194, lng: 73.897395 },
        { lat: 18.544425, lng: 73.921482 },
        { lat: 18.554385, lng: 73.882653 },
        { lat: 18.547861, lng: 73.862354 },
        { lat: 18.536707, lng: 73.918600 },
    ];

    const HeatmapLayer = () => {
        const map = useMap();
        
        useEffect(() => {
            const cfg = {
                radius: 15,
                maxOpacity: 0.8,
                scaleRadius: true,
                useLocalExtrema: true,
                latField: "lat",
                lngField: "lng",
                valueField: "intensity"
            };

            const heatmapLayer = new window.HeatmapOverlay(cfg);
            heatmapLayer.setData({ max: 1.0, data: heatmapData });
            heatmapLayer.addTo(map);
        }, [map]);
        
        return null;
    };

    return (
        <div>
            <h2>Pune Heatmap</h2>
            <MapContainer center={[18.5204, 73.8567]} zoom={12} style={{ height: "500px", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <HeatmapLayer />
                {warehouseLocations.map((location, index) => (
                    <Marker key={index} position={[location.lat, location.lng]}>
                        <Popup>Warehouse Location {index + 1}</Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default Heatmap;
