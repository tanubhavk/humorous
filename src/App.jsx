import Home from "./pages/Home.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Heatmap from "./pages/Heatmap.jsx"; // ✅ Keep only one import
import About from "./pages/About.jsx";
import Navbar from "./components/Navbar.jsx";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/heatmap" element={<Heatmap />} /> 
      </Routes>
    </Router>
  );
}

export default App;
