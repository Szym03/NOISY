import { useRef, useEffect } from "react";
import p5 from "p5";

// Mounts a p5 instance-mode sketch inside a fixed-size window.
// `sketch` is a factory: (p, env) => void, where env provides
// the container element (for sizing) and a live param getter.
function P5Canvas({ sketch, getParam }) {
  const containerRef = useRef(null);
  const getParamRef = useRef(getParam);
  getParamRef.current = getParam;

  useEffect(() => {
    if (!sketch) return;

    const container = containerRef.current;
    const env = {
      container,
      getParam: (id) => getParamRef.current?.(id) ?? 0,
    };
    const instance = new p5((p) => sketch(p, env), container);

    return () => {
      // p5 v2 initializes asynchronously and remove() is a silent no-op
      // until setup has finished, which would leak a forever-running
      // instance (React StrictMode unmounts immediately after mount).
      // Wait for setup to complete before tearing down.
      let attempts = 100;
      const tryRemove = () => {
        if (instance._setupDone || instance.hitCriticalError || attempts-- <= 0) {
          instance.remove();
        } else {
          setTimeout(tryRemove, 50);
        }
      };
      tryRemove();
    };
  }, [sketch]);

  return <div className="sketch-window" ref={containerRef} />;
}

export default P5Canvas;
