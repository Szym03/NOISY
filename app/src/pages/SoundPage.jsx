import { useParams, Link } from "react-router-dom";
import { sounds } from "../config/sounds";
import { useCsound } from "../hooks/useCsound";
import ParamSlider from "../components/ParamSlider";

function SoundPage() {
  const { id } = useParams();
  const sound = sounds.find((s) => s.id === id);
  const { isRunning, isLoading, error, start, stop, setChannel } = useCsound(
    sound?.csdFile,
    sound?.audioFiles,
  );

  if (!sound) {
    return (
      <div>
        <p>Sound not found.</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  async function handleStart() {
    await start();
    setChannel("globalVolume", 0.25);
    sound.params.forEach((p) => setChannel(p.id, p.default));
  }

  return (
    <div>
      <h1 class="sound-title">{sound.title}</h1>

      <div className="controls">
        <button className="play-pause" style={{ borderColor: "green" }} onClick={handleStart} disabled={isRunning || isLoading}>
          {isLoading ? "Loading..." : "Play"}
        </button>
        <button className="play-pause" style={{ borderColor: "red" }} onClick={stop} disabled={!isRunning}>
          Stop
        </button>
      </div>

      {error && <p className="error">{error}</p>}
      <div className="sliders">
        <ParamSlider
          label="Volume"
          defaultValue={0.5}
          onChange={(v) => setChannel("globalVolume", Math.pow(v, 2))}
        />

        {sound.params.map((p) => (
          <ParamSlider
            key={p.id}
            label={p.label}
            defaultValue={p.default}
            onChange={(v) => setChannel(p.id, v)}
          />
        ))}
      </div>

      <Link to="/">Back to home</Link>

    </div>
  );
}

export default SoundPage;