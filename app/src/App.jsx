import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SoundPage from "./pages/SoundPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sound/:id" element={<SoundPage />} />
    </Routes>
  );
}

export default App;