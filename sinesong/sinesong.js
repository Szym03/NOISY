import { Csound } from 'https://cdn.jsdelivr.net/npm/@csound/browser@6.18.7/dist/csound.min.js';
import { initTimer } from '../timer.js'; 

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton").addEventListener("click", startCsound);
    document.getElementById("stopButton").addEventListener("click", stopCsound);
    initTimer(stopCsound); 
});

let csound = null;

async function startCsound() {
    // If already started, do nothing.
    if (csound) return;

    console.log("Starting Csound...");

    // Initialize the Csound engine.
    csound = await Csound();

    try {
        // Fetch your Csound file 
        const response = await fetch('sinesong.csd');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csdText = await response.text();

        // Compile and start Csound.
        await csound.compileCsdText(csdText);
        await csound.setControlChannel('globalVolume', 0.25);

        document.getElementById("volumeSlider").addEventListener("input", async (evt) => {
            const linearValue = parseFloat(evt.target.value);
            // Apply a logarithmic transformation. You can adjust the exponent to get the desired curve.
            const logValue = Math.pow(linearValue, 2);
            await csound.setControlChannel('globalVolume', logValue);
            console.log("Volume set to:", logValue);
          });
          
        await csound.start();

        // Enable the Stop button and disable the Start button.
        document.getElementById("stopButton").disabled = false;
        document.getElementById("startButton").disabled = true;
    } catch (error) {
        console.error("Error loading Csound file:", error);
    }
}

async function stopCsound() {
    if (csound) {
        console.log("Stopping Csound...");
        await csound.stop(); // Stop the engine.
        csound = null;

        // Re-enable the Start button and disable the Stop button.
        document.getElementById("startButton").disabled = false;
        document.getElementById("stopButton").disabled = true;
    }
}
