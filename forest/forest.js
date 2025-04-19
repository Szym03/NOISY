import { Csound } from 'https://cdn.jsdelivr.net/npm/@csound/browser@6.18.7/dist/csound.min.js';

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton").addEventListener("click", startCsound);
    document.getElementById("stopButton").addEventListener("click", stopCsound);
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

async function startCsound() {
    // If already started, do nothing.
    if (csound) return;

    console.log("Starting Csound...");

    // Initialize the Csound engine.
    csound = await Csound();

    try {
        // Fetch your Csound file 
        const response = await fetch('forest.csd');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const csdText = await response.text();

        //Using FS to create an array from the .wav and place it in virtual file system
        let wavResp = await fetch('audio/ambience.wav');
        if (!wavResp.ok) throw new Error(`Audio load failed: ${wavResp.status}`);
        let wavArray = new Uint8Array(await wavResp.arrayBuffer());
        await csound.fs.writeFile('/ambience.wav', wavArray);
        
        wavResp = await fetch('audio/stream.wav');
        if (!wavResp.ok) throw new Error(`Audio load failed: ${wavResp.status}`);
        wavArray = new Uint8Array(await wavResp.arrayBuffer());
        await csound.fs.writeFile('/stream.wav', wavArray);

        wavResp = await fetch('audio/wind.wav');
        if (!wavResp.ok) throw new Error(`Audio load failed: ${wavResp.status}`);
        wavArray = new Uint8Array(await wavResp.arrayBuffer());
        await csound.fs.writeFile('/wind.wav', wavArray);

        wavResp = await fetch('audio/leaves.wav');
        if (!wavResp.ok) throw new Error(`Audio load failed: ${wavResp.status}`);
        wavArray = new Uint8Array(await wavResp.arrayBuffer());
        await csound.fs.writeFile('/leaves.wav', wavArray);


        await csound.compileCsdText(csdText);

        await csound.setControlChannel('globalVolume', 0.25);

        //globalVolume
        document.getElementById("volumeSlider").addEventListener("input", async (evt) => {
            const linearValue = parseFloat(evt.target.value);
            const logValue = Math.pow(linearValue, 2);
            await csound.setControlChannel('globalVolume', logValue);
            console.log("Volume set to:", logValue);
        });

        // ADDED: Forest sound slider Csound control setup
        // Now that Csound is initialized, set up the forest sound parameter control
        setupForestSoundControls();

        await csound.start();

        // Enable the Stop button and disable the Start button.
        document.getElementById("stopButton").disabled = false;
        document.getElementById("startButton").disabled = true;
    } catch (error) {
        console.error("Error loading Csound file:", error);
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

        // Re-enable the Start button and disable the Stop button.
        document.getElementById("startButton").disabled = false;
        document.getElementById("stopButton").disabled = true;
    }
}