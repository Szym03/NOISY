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

    return () => instance.remove();
  }, [sketch]);

  return <div className="sketch-window" ref={containerRef} />;
}

export default P5Canvas;
