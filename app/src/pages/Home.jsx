import { Link } from "react-router-dom";
import { sounds } from "../config/sounds";

function Home() {
  return (
    <div>
      <h1>Noisy</h1>
      <ul>
        {sounds.map((sound) => (
          <li key={sound.id}>
            <Link to={`/sound/${sound.id}`}>{sound.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;