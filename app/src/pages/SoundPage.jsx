import { useRef, useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { sounds } from "../config/sounds";
import { useCsound } from "../hooks/useCsound";
import ParamSlider from "../components/ParamSlider";
import P5Canvas from "../components/P5Canvas";
import { sketches } from "../sketches";

function SoundPage() {
  const { id } = useParams();
  const sound = sounds.find((s) => s.id === id);
  const { isRunning, isLoading, error, start, stop, setChannel } = useCsound(
    sound?.csdFile,
    sound?.audioFiles,
  );

  // Sleep timer 
  const [secondsLeft, setSecondsLeft] = useState(null);

  useEffect(() => {
    if (secondsLeft === null) {
      return;
    }
    if (secondsLeft === 0) {
      stop();
      setSecondsLeft(null);
      return;
    }
    let timeoutId;
    if (isRunning) {
      timeoutId = setTimeout(() => {
        addTime(-1);
      }, 1000);
    }
    return () => clearTimeout(timeoutId);
  }, [secondsLeft, isRunning]);


  function addTime(time) {
    setSecondsLeft(prev => (prev ?? 0) + time);
  }


  // Live param values, readable by the p5 sketch every frame.
  // Reset when navigating to a different sound.
  const paramValues = useRef(null);
  const paramsFor = useRef(null);
  if (sound && paramsFor.current !== sound.id) {
    paramsFor.current = sound.id;
    paramValues.current = Object.fromEntries(
      sound.params.map((p) => [p.id, p.default]),
    );
  }

  if (!sound) {
    return (
      <div>
        <p>Sound not found.</p>
        <Link to="/">Back to home</Link>
      </div>
    );
  }

  function setParam(paramId, value) {
    paramValues.current[paramId] = value;
    setChannel(paramId, value);
  }

  async function handleStart() {
    await start();
    setChannel("globalVolume", 0.25);
    sound.params.forEach((p) => setChannel(p.id, paramValues.current[p.id]));
  }

  function formatTime(totalSeconds) {
    if (totalSeconds == null) {
      return "--:--:--"
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
    const seconds = totalSeconds % 60;

    return String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  }

  return (
    <div key={sound.id}>
      <h1 className="sound-title">{sound.title}</h1>

      <P5Canvas
        sketch={sketches[sound.id]}
        getParam={(paramId) => paramValues.current[paramId] ?? 0}
      />

      <div className="panels">
        <div className="panel">
          <h2 className="panel-title">Sound</h2>
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
                onChange={(v) => setParam(p.id, v)}
              />
            ))}
          </div>
        </div>

        <div className="panel timer">
          <h2 className="panel-title">Sleep Timer</h2>
          <div className="timer-display">{formatTime(secondsLeft)}</div>
          <div className="timer-buttons">
            <button className="timer-button" onClick={() => addTime(60)}>+1 min</button>
            <button className="timer-button" onClick={() => addTime(600)}>+10 min</button>
            <button className="timer-button" onClick={() => addTime(3600)}>+1 hr</button>
          </div>
        </div>
      </div>

      <Link to="/">Back to home</Link>

    </div>
  );
}

export default SoundPage;
