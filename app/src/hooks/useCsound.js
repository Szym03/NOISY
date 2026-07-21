import { useRef, useState, useCallback, useEffect } from "react";
import { Csound } from "@csound/browser";

export function useCsound(csdFile, audioFiles = []) {
  const csoundRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const start = useCallback(async () => {
    // Already initialized once (just paused), resume instead of rebuilding
    if (csoundRef.current) {
      await csoundRef.current.resume();
      setIsRunning(true);
      return;
    }

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

      if (!csdText.includes("<CsoundSynthesizer>")) {
        throw new Error(
          `${csdFile} did not return valid CSD content. Got: ${csdText.slice(0, 100)}`,
        );
      }

      await csound.compileCSD(csdText, 1);
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
    await csoundRef.current.pause();
    setIsRunning(false);
  }, []);

  const setChannel = useCallback((channel, value) => {
    csoundRef.current?.setControlChannel(channel, value);
  }, []);

  // Fully tear down the engine when leaving the page or switching sounds
  useEffect(() => {
    return () => {
      if (csoundRef.current) {
        csoundRef.current.stop();
        csoundRef.current = null;
        setIsRunning(false);
      }
    };
  }, [csdFile]);

  return { isRunning, isLoading, error, start, stop, setChannel };
}