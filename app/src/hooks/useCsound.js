import { useRef, useState, useCallback } from "react";
import { Csound } from "@csound/browser";

export function useCsound(csdFile, audioFiles = []) {
  const csoundRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(async () => {
    if (csoundRef.current) return;

    setIsLoading(true);
    setError(null);

    try {
      const csound = await Csound();

      const csdDir = csdFile.substring(0, csdFile.lastIndexOf("/"));
      for (const filename of audioFiles) {
        const response = await fetch(`${csdDir}/audio/${filename}`);
        if (!response.ok) {
          throw new Error(`Could not load ${filename}: ${response.status}`);
        }
        const bytes = new Uint8Array(await response.arrayBuffer());
        await csound.fs.writeFile(`/${filename}`, bytes);
      }

      const csdResponse = await fetch(csdFile);
      if (!csdResponse.ok) {
        throw new Error(`Could not load ${csdFile}: ${csdResponse.status}`);
      }
      const csdText = await csdResponse.text();

      await csound.compileCSD(csdText, 1); // mode 1 = compiling text, not a file path
      await csound.start();

      csoundRef.current = csound;
      setIsRunning(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [csdFile, audioFiles]);

  const stop = useCallback(async () => {
    if (!csoundRef.current) return;
    await csoundRef.current.stop();
    csoundRef.current = null;
    setIsRunning(false);
  }, []);

  const setChannel = useCallback((channel, value) => {
    csoundRef.current?.setControlChannel(channel, value);
  }, []);

  return { isRunning, isLoading, error, start, stop, setChannel };
}