import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "../api";
import Loader from "../components/Loader";

const Dashboard = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/heatmap-data")
      .then(response => {
        setHeatmapData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard">
      {loading ? (
        <Loader />
      ) : (
        <MapContainer center={[18.610, 73.814]} zoom={12} style={{ height: "100vh", width: "100vw" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {heatmapData.map((point, index) => (
            <CircleMarker 
              key={index} 
              center={[point.lat, point.lon]} 
              radius={point.intensity * 10}
              color="red"
            />
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Dashboard;

