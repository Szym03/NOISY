import { useParams, Link } from "react-router-dom";
import { sounds } from "../config/sounds";

function SoundPage() {
  const { id } = useParams();
  const sound = sounds.find((s) => s.id === id);

  if (!sound) {
    return (
      <div>
        <p>Sound not found.</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{sound.title}</h1>
      <p>Category: {sound.category}</p>
      <p>Params: {sound.params.length > 0 ? sound.params.map((p) => p.label).join(", ") : "none"}</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}

export default SoundPage;