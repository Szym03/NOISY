import { Csound } from 'https://cdn.jsdelivr.net/npm/@csound/browser@6.18.7/dist/csound.min.js';
import { initTimer } from '../timer.js'; 

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton").disabled = true;
    document.getElementById("startSpinner").classList.remove("hidden");
    document.getElementById("startButton").addEventListener("click", startCsound);
    document.getElementById("stopButton").addEventListener("click", stopCsound);
    initTimer(stopCsound); 
    // Get slider elements
    const birdSlider = document.getElementById('birdSlider');
    const windSlider = document.getElementById('windSlider');
    const streamSlider = document.getElementById('streamSlider');
    const rustleSlider = document.getElementById('rustleSlider');

    // Get value display elements
    const birdValue = document.getElementById('birdValue');
    const windValue = document.getElementById('windValue');
    const streamValue = document.getElementById('streamValue');
    const rustleValue = document.getElementById('rustleValue');

    // Function to update slider value displays
    function updateSliderDisplay(slider, display) {
        const percent = Math.round(slider.value * 100);
        display.textContent = `${percent}%`;
    }

    // Initial value display
    updateSliderDisplay(birdSlider, birdValue);
    updateSliderDisplay(windSlider, windValue);
    updateSliderDisplay(streamSlider, streamValue);
    updateSliderDisplay(rustleSlider, rustleValue);

    // Simple display updates (without Csound interaction yet)
    // These will run before Csound is initialized
    birdSlider.addEventListener('input', () => {
        updateSliderDisplay(birdSlider, birdValue);
    });

    windSlider.addEventListener('input', () => {
        updateSliderDisplay(windSlider, windValue);
    });

    streamSlider.addEventListener('input', () => {
        updateSliderDisplay(streamSlider, streamValue);
    });

    rustleSlider.addEventListener('input', () => {
        updateSliderDisplay(rustleSlider, rustleValue);
    });
});

let csound = null;
let csdText = null;
let csoundReady = false;

window.addEventListener("load", () => {
    initCsound();
});

async function startCsound() {
    if (!csoundReady || !csound) {
        console.warn("Csound is not ready yet.");
        return;
    }

    await csound.start();

    document.getElementById("volumeSlider").addEventListener("input", async (evt) => {
        const linearValue = parseFloat(evt.target.value);
        const logValue = Math.pow(linearValue, 2);
        await csound.setControlChannel('globalVolume', logValue);
        console.log("Volume set to:", logValue);
    });

    document.getElementById("stopButton").disabled = false;
    document.getElementById("startButton").disabled = true;
}

async function initCsound() {
    if (csoundReady) return;

    console.log("Preloading Csound...");

    csound = await Csound();

    try {
        // Load and store CSD
        const response = await fetch('forest.csd');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        csdText = await response.text();

        // Preload audio files into Csound FS
        const files = ['ambience.wav', 'stream.wav', 'wind.wav', 'leaves.wav'];
        for (const file of files) {
            const wavResp = await fetch(`./forest/audio/${file}`);
            if (!wavResp.ok) throw new Error(`Audio load failed: ${wavResp.status}`);
            const wavArray = new Uint8Array(await wavResp.arrayBuffer());
            await csound.fs.writeFile(`/${file}`, wavArray);
        }

        await csound.compileCsdText(csdText);
        await csound.setControlChannel('globalVolume', 0.25);

        setupForestSoundControls();

        csoundReady = true;
        console.log("Csound preloaded and ready.");
        
        document.getElementById("startButton").disabled = false;
        document.getElementById("startSpinner").classList.add("hidden");
    } catch (err) {
        console.error("Error during Csound initialization:", err);
    }
}


//Function to set up the forest sound controls integration with Csound
function setupForestSoundControls() {
    // Only proceed if Csound is initialized
    if (!csound) return;

    // Get all forest sound sliders
    const forestControls = [
        {
            slider: document.getElementById('birdSlider'),
            channel: 'birdLevel',
            display: document.getElementById('birdValue')
        },
        {
            slider: document.getElementById('windSlider'),
            channel: 'windLevel',
            display: document.getElementById('windValue')
        },
        {
            slider: document.getElementById('streamSlider'),
            channel: 'streamLevel',
            display: document.getElementById('streamValue')
        },
        {
            slider: document.getElementById('rustleSlider'),
            channel: 'rustleLevel',
            display: document.getElementById('rustleValue')
        }
    ];

    // Set initial values in Csound
    forestControls.forEach(async control => {
        const value = parseFloat(control.slider.value);
        await csound.setControlChannel(control.channel, value);
        console.log(`Initial ${control.channel} set to:`, value);
    });

    // Set up event listeners to update Csound parameters when sliders change
    forestControls.forEach(control => {
        control.slider.addEventListener('input', async (evt) => {
            const value = parseFloat(evt.target.value);

            // Update Csound channel
            await csound.setControlChannel(control.channel, value);

            // Update display
            const percent = Math.round(value * 100);
            control.display.textContent = `${percent}%`;

            console.log(`${control.channel} set to:`, value);
        });
    });
}

async function stopCsound() {
    if (csound) {
        console.log("Stopping Csound...");
        await csound.stop(); // Stop the engine.
        csound = null;
        csoundReady = false;

        
        initCsound();
        // Re-enable the Start button and disable the Stop button.
        
        document.getElementById("stopButton").disabled = true;
        document.getElementById("startSpinner").classList.remove("hidden");
    }
}