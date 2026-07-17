// DOM Elements
const container = document.querySelector("#grid-container");
const colorPicker = document.querySelector("#color-picker");
const colorValLabel = document.querySelector("#color-val-label");
const sizeSlider = document.querySelector("#size-slider");
const sizeDisplay = document.querySelector("#size-display");
const toolBtns = document.querySelectorAll(".tool-btn");
const interactionBtns = document.querySelectorAll(".interaction-toggle .toggle-btn");
const toggleGridBtn = document.querySelector("#btn-toggle-grid");
const clearBtn = document.querySelector("#btn-clear");
const swatches = document.querySelectorAll(".swatch");

// Application State
let currentMode = "pen"; // pen, rainbow, shading, eraser
let currentInteraction = "click"; // hover, click
let currentColor = "#9b5de5";
let currentSize = 16;
let isDrawing = false;

// Initialize
function init() {
    setupEventListeners();
    createGrid(currentSize);
    updateColor(currentColor);
}

// Convert Hex color to RGB
function hexToRgb(hex) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
}

// Update color value across UI elements
function updateColor(newColor) {
    currentColor = newColor;
    colorPicker.value = newColor;
    colorValLabel.textContent = newColor.toUpperCase();
    
    // Manage active state of swatches
    swatches.forEach(swatch => {
        if (swatch.dataset.color.toLowerCase() === newColor.toLowerCase()) {
            swatch.classList.add("active");
        } else {
            swatch.classList.remove("active");
        }
    });
}

// Main cell drawing/painting logic
function paintCell(cell) {
    if (currentMode === "pen") {
        cell.style.backgroundColor = currentColor;
        cell.removeAttribute("data-opacity");
    } else if (currentMode === "rainbow") {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        cell.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
        cell.removeAttribute("data-opacity");
    } else if (currentMode === "shading") {
        const rgb = hexToRgb(currentColor);
        let currentOpacity = parseFloat(cell.dataset.opacity || 0);
        
        // Increment opacity by 10% on each pass, up to 100%
        currentOpacity = Math.min(1.0, currentOpacity + 0.1);
        cell.dataset.opacity = currentOpacity;
        cell.style.backgroundColor = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${currentOpacity})`;
    } else if (currentMode === "eraser") {
        cell.style.backgroundColor = "";
        cell.removeAttribute("data-opacity");
    }
}

// Dynamically generate the grid canvas
function createGrid(size) {
    container.innerHTML = "";
    container.style.setProperty("--grid-size", size);

    const totalCells = size * size;
    for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        // Prevent default browser dragging behavior on cells
        cell.addEventListener("dragstart", (e) => e.preventDefault());

        // Mouse Down interaction (starts drawing in click mode)
        cell.addEventListener("mousedown", (e) => {
            e.preventDefault();
            if (currentInteraction === "click") {
                isDrawing = true;
                paintCell(cell);
            }
        });

        // Mouse Enter interaction (continues drawing if active)
        cell.addEventListener("mouseenter", () => {
            if (currentInteraction === "hover") {
                paintCell(cell);
            } else if (currentInteraction === "click" && isDrawing) {
                paintCell(cell);
            }
        });

        container.appendChild(cell);
    }
}

// Setup all control panel event listeners
function setupEventListeners() {
    // Global mouseup to stop drawing when releasing click outside the canvas
    window.addEventListener("mouseup", () => {
        isDrawing = false;
    });

    // Color Picker change listener
    colorPicker.addEventListener("input", (e) => {
        updateColor(e.target.value);
    });

    // Swatches click handler
    swatches.forEach(swatch => {
        swatch.addEventListener("click", () => {
            updateColor(swatch.dataset.color);
        });
    });

    // Grid size slider changes
    sizeSlider.addEventListener("input", (e) => {
        const size = e.target.value;
        sizeDisplay.textContent = `${size} x ${size}`;
    });

    sizeSlider.addEventListener("change", (e) => {
        currentSize = parseInt(e.target.value);
        createGrid(currentSize);
    });

    // Tool selector logic (Pen, Rainbow, Shading, Eraser)
    toolBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            toolBtns.forEach(b => b.classList.remove("active"));
            const targetBtn = e.target.closest(".tool-btn");
            targetBtn.classList.add("active");
            currentMode = targetBtn.dataset.mode;
        });
    });

    // Interaction style selector logic (Hover vs Click & Drag)
    interactionBtns.forEach(btn => {
        btn.addEventListener("click", (e) => {
            interactionBtns.forEach(b => b.classList.remove("active"));
            const targetBtn = e.target.closest(".toggle-btn");
            targetBtn.classList.add("active");
            currentInteraction = targetBtn.dataset.interaction;
        });
    });

    // Toggle Grid Lines action
    toggleGridBtn.addEventListener("click", () => {
        const isVisible = container.classList.toggle("grid-lines-visible");
        if (isVisible) {
            toggleGridBtn.innerHTML = '<i class="fa-solid fa-border-all"></i> Hide Grid Lines';
            toggleGridBtn.classList.remove("secondary-active");
        } else {
            toggleGridBtn.innerHTML = '<i class="fa-solid fa-border-none"></i> Show Grid Lines';
            toggleGridBtn.classList.add("secondary-active");
        }
    });

    // Clear Canvas action
    clearBtn.addEventListener("click", () => {
        // Simple visual feedback: flash clean effect or just clear
        const cells = container.querySelectorAll(".cell");
        cells.forEach(cell => {
            cell.style.backgroundColor = "";
            cell.removeAttribute("data-opacity");
        });
    });
}

// Start the application
init();