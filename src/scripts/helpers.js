/**
 * Save a value to localStorage under a given key.
 * @param {string} key - The key to store the value under.
 * @param {any} value - The value to store.
 */
const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, value);
};
/**
 * Loads HTML content into an element by ID.
 * @param {string} id - The element ID.
 * @param {string} html - The HTML content.
 */
const loadHTML = (id, html) => {
    document.getElementById(id).innerHTML = html;
};

/**
 * Toggles modal visibility by ID.
 * @param {string} id - The modal element ID.
 */
const toggleModal = (id) => {
    const modal = document.getElementById(id);
    modal.classList.toggle("modal_show");
};

/**
 * Shows modal info by ID.
 * @param {string} id - The modal element ID.
 */
const showInfo = (id) => {
    document.getElementById(id).classList.add("modal_show");
};

/**
 * Hides modal info by ID.
 * @param {string} id - The modal element ID.
 */
const hideInfo = (id) => {
    document.getElementById(id).classList.remove("modal_show");
};

/**
 * Opens a modal and sets up event listeners for settings.
 * @param {string} id - The modal element ID.
 */
const openModal = (id) => {
    document.getElementById(id).style.display = "flex";
    document.getElementById("configModalBG").style.display = "block";
    document.getElementById("mutationRate").addEventListener("input", function () {
        document.getElementById("mutationRateValue").textContent = this.value + "%";
    });
    document.getElementById("precisionRate").addEventListener("input", function () {
        document.getElementById("precisionRateValue").textContent = this.value + "%";
    });
    document.querySelectorAll('input[name="stopCriteria"]').forEach((input) => {
        input.addEventListener('change', function () {
            if (this.value === 'color') {
                document.getElementById('colorStopSection').style.display = 'flex';
                document.getElementById('generationsStopSection').style.display = 'none';
            } else if (this.value === 'generations') {
                document.getElementById('colorStopSection').style.display = 'none';
                document.getElementById('generationsStopSection').style.display = 'flex';
            } else {
                document.getElementById('colorStopSection').style.display = 'none';
                document.getElementById('generationsStopSection').style.display = 'none';
            }
        });
    });
};
/**
 * Closes a modal by ID.
 * @param {string} id - The modal element ID.
 */
const closeModal = (id) => {
    document.getElementById(id).style.display = "none";
    document.getElementById("configModalBG").style.display = "none";
};

/**
 * Closes all modals.
 */
const closeAllModals = () => {
    document.getElementById("configModal").style.display = "none";
    document.getElementById("helpModal").style.display = "none";
    document.getElementById("configModalBG").style.display = "none";
};
/**
 * Applies settings from modal and saves them to localStorage.
 */
const applySettings = () => {
    const mutationRate = document.getElementById("mutationRate").value;
    const precisionRate = document.getElementById("precisionRate").value;
    const populationSize = document.getElementById("populationSize").value;
    const selectionMethod = document.querySelector('input[name="selectionMethod"]:checked').value;
    const stopCriteria = document.querySelector('input[name="stopCriteria"]:checked').value;
    let stopColor = null;
    let stopGenerations = null;
    if (stopCriteria === "color") {
        let hex = document.getElementById("stopColor").value.substring(1);
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        stopColor = `${[r, g, b]}`;
    }
    if (stopCriteria === "generations") {
        stopGenerations = document.getElementById("stopGenerations").value;
    }
    console.log("Settings Applied:");
    console.log("Mutation Rate: " + mutationRate + "%");
    console.log("Precision Rate: " + precisionRate + "%");
    console.log("Population Size: " + populationSize);
    console.log("Selection Method: " + selectionMethod);
    console.log("Stop Criteria: " + stopCriteria);
    console.log("Stop Color: " + stopColor);
    console.log("Stop Generations: " + stopGenerations);

    saveToLocalStorage("Mutation_Rate", mutationRate);
    saveToLocalStorage("Precision_Rate", precisionRate);
    saveToLocalStorage("Initial_Population", populationSize);
    saveToLocalStorage("Selection_Method", selectionMethod);
    saveToLocalStorage("Stop_Criteria", stopCriteria);

    if (stopCriteria === "color") {
        saveToLocalStorage("Stop_Color", stopColor);
    }
    if (stopCriteria === "generations") {
        saveToLocalStorage("Stop_Generations", stopGenerations);
    }
    closeModal("configModal");
};


document.addEventListener("DOMContentLoaded", () => {
    saveToLocalStorage("Mutation_Rate", 50);
    saveToLocalStorage("Precision_Rate", 80);
    saveToLocalStorage("Initial_Population", 10);
    saveToLocalStorage("Selection_Method", "roulette");
    saveToLocalStorage("Stop_Criteria", "random");
    const generationLabel = document.getElementById("generation_current");
    const runButton = document.getElementById("run");
    const simulationButton = document.getElementById("simulation");
    const statisticButton = document.getElementById("statistic");
    const stepButton = document.getElementById("step");
    const lakeContainer = document.getElementById("lake-container");
    const statisticContainer = document.getElementById("statistic-container");
    const stepContainer = document.getElementById("step-container");

    if (runButton) {
        runButton.addEventListener("click", () => {
            generationLabel.style.display = "flex";
            lakeContainer.style.display = "flex";
            statisticContainer.style.display = "none";
            stepContainer.style.display = "none";
            clickExecution();
        });
    }
    if (simulationButton) {
        simulationButton.addEventListener("click", () => {
            generationLabel.style.display = "flex";
            lakeContainer.style.display = "flex";
            statisticContainer.style.display = "none";
            stepContainer.style.display = "none";
        });
    }
    if (statisticButton) {
        statisticButton.addEventListener("click", () => {
            generationLabel.style.display = "flex";
            lakeContainer.style.display = "none";
            statisticContainer.style.display = "flex";
            stepContainer.style.display = "none";
        });
    }
    if (stepButton) {
        stepButton.addEventListener("click", () => {
            generationLabel.style.display = "none";
            simulationButton.style.display = "flex";
            lakeContainer.style.display = "none";
            statisticContainer.style.display = "none";
            stepContainer.style.display = "flex";
        });
    }
});
