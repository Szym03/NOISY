import { Csound } from 'https://cdn.jsdelivr.net/npm/@csound/browser@6.18.7/dist/csound.min.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton").disabled = true;
    document.getElementById("startSpinner").classList.remove("hidden");
    document.getElementById("startButton").addEventListener("click", startCsound);
    document.getElementById("stopButton").addEventListener("click", stopCsound);
    // Get slider elements
    const fanSlider = document.getElementById('fanSlider');
    const planeSlider = document.getElementById('planeSlider');
    const streamSlider = document.getElementById('streamSlider');
    const rustleSlider = document.getElementById('rustleSlider');

    // Get value display elements
    const fanValue = document.getElementById('fanValue');
    const planeValue = document.getElementById('planeValue');
    const acunitValue = document.getElementById('acunitValue');
    const trainValue = document.getElementById('trainValue');

    // Function to update slider value displays
    function updateSliderDisplay(slider, display) {
        const percent = Math.round(slider.value * 100);
        display.textContent = `${percent}%`;
    }

    // Initial value display
    updateSliderDisplay(fanSlider, fanValue);
    updateSliderDisplay(planeSlider, planeValue);
    updateSliderDisplay(acunitSlider, acunitValue);
    updateSliderDisplay(trainSlider, trainValue);

    // Simple display updates (without Csound interaction yet)
    // These will run before Csound is initialized
    fanSlider.addEventListener('input', () => {
        updateSliderDisplay(fanSlider, fanValue);
    });

    planeSlider.addEventListener('input', () => {
        updateSliderDisplay(planeSlider, planeValue);
    });

    acunitSlider.addEventListener('input', () => {
        updateSliderDisplay(acunitSlider, acunitValue);
    });

    trainSlider.addEventListener('input', () => {
        updateSliderDisplay(trainSlider, trainValue);
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
        const response = await fetch('mechanical.csd');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        csdText = await response.text();

        // Preload audio files into Csound FS
        const files = ['fan.wav', 'plane.wav','train.wav','acunit.wav'];
        for (const file of files) {
            const wavResp = await fetch(`audio/${file}`);
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
    const machanicalControls = [
        {
            slider: document.getElementById('fanSlider'),
            channel: 'fanLevel',
            display: document.getElementById('fanValue')
        },
        {
            slider: document.getElementById('planeSlider'),
            channel: 'planeLevel',
            display: document.getElementById('planeValue')
        },
        {
            slider: document.getElementById('acunitSlider'),
            channel: 'acunitLevel',
            display: document.getElementById('acunitValue')
        },
        {
            slider: document.getElementById('trainSlider'),
            channel: 'trainLevel',
            display: document.getElementById('trainValue')
        }
    ];

    // Set initial values in Csound
    machanicalControls.forEach(async control => {
        const value = parseFloat(control.slider.value);
        await csound.setControlChannel(control.channel, value);
        console.log(`Initial ${control.channel} set to:`, value);
    });

    // Set up event listeners to update Csound parameters when sliders change
    machanicalControls.forEach(control => {
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