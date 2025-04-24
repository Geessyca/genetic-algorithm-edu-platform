loadHTML('modais-container', `
    <!-- Settings Modal -->
    <div id="configModalBG" class="modal" onclick="closeModalAll()"></div>
    
    <div id="configModal" style="display:none">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('configModal')"><svg class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18 17.94 6M18 18 6.06 6" />
                </svg></span>
            <h2>Settings</h2>
            <div class="config-item">
                <label for="precisionRate">Precision Rate (%)</label>
                <input type="range" id="precisionRate" name="precisionRate" min="10" max="90" value="80">
                <span id="precisionRateValue">80%</span>
            </div>
            <div class="config-item">
                <label for="mutationRate">Mutation Rate (%)</label>
                <input type="range" id="mutationRate" name="mutationRate" min="10" max="70" value="50">
                <span id="mutationRateValue">50%</span>
            </div>
            <div class="config-item">
                <label for="populationSize">Population Size</label>
                <input type="number" id="populationSize" name="populationSize" min="10" max="100" value="10">
            </div>
            <div class="config-item">
                <label style="display: flex;" for="selectionMethod">Selection Method
                    <div class="info" onclick="showInfo('selection-info')" onmouseover="showInfo('selection-info')">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span class="more_info" id="selection-info" onmouseleave="hideInfo('selection-info')">
                            <h4>What are selection methods?</h4>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                                <b>Random Selection</b> randomly chooses between tournament or roulette selection.
                            </p>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                                <b>Tournament Selection</b> selects a group of individuals randomly and picks the best one for reproduction.
                            </p>
                            <p>
                                <b>Roulette Selection</b> assigns a selection probability proportional to the fitness of individuals, giving fitter ones a higher chance of being chosen.
                            </p>
                        </span>
                    </div>
                </label>
                <div>
                    <input type="radio" id="randomSelection" name="selectionMethod" value="random">
                    <label for="randomSelection">Random Selection</label>
                    <input type="radio" id="torneioSelection" name="selectionMethod" value="torneio">
                    <label for="torneioSelection">Tournament Selection</label>
                    <input type="radio" id="rouletteSelection" name="selectionMethod" value="roleta" checked>
                    <label for="rouletteSelection">Roulette Selection</label>
                </div>
            </div>
            <div class="config-item">
                <label for="stopCriteria" style="display: flex;">
                    Stop Criteria
                    <div class="info" onclick="showInfo('criteria-info')" onmouseover="showInfo('criteria-info')">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span class="more_info" id="criteria-info" onmouseleave="hideInfo('criteria-info')">
                            <h4>What are stop criteria?</h4>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                                <b>Random Criterion</b> chooses a random color to end the simulation.
                            </p>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                                <b>Color Criterion</b> lets you choose a specific color that, once reached by the population, stops the simulation.
                            </p>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                                <b>Generation Count Criterion</b> stops the simulation after a defined number of generations is reached.
                                <span style="display:flex; align-items:center;">Fitness will be evaluated through the color <span class="cor"></span>.
                                </span>
                            </p>
                            <p>
                                These criteria help control the evolution of the genetic algorithm and define when the evolutionary process is considered complete.
                            </p>
                        </span>
                    </div>
                </label>
                <div>
                    <input type="radio" id="randomStop" name="stopCriteria" value="random" checked>
                    <label for="randomStop">Random</label>
                    <input type="radio" id="colorStop" name="stopCriteria" value="color">
                    <label for="colorStop">By Color</label>
                    <input type="radio" id="generationsStop" name="stopCriteria" value="generations">
                    <label for="generationsStop">By Number of Generations</label>
                </div>
                <div class="criteria" id="colorStopSection" style="display: none;">
                    <label for="stopColor">Choose Stop Color</label>
                    <input type="color" id="stopColor" name="stopColor">
                </div>
                <div class="criteria" id="generationsStopSection" style="display: none;">
                    <label for="stopGenerations">Number of Generations</label>
                    <input type="number" id="stopGenerations" name="stopGenerations" min="10" max="1000" value="100">
                </div>
            </div>
            <div class="config-item">
                <button id="applyConfigBtn" onclick="applySettings()">Apply Settings</button>
            </div>
        </div>
    </div>
    
    <!-- Help Modal -->
    <div id="helpModal" style="display:none">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('helpModal')"><svg class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18 17.94 6M18 18 6.06 6" />
                </svg></span>
            <h2>Help</h2>
            <div class="help" onclick="(allClick('help1'))">
            <p>What are genetic algorithms?</p>
            <div id="help1" class="help_item">General explanation</div>
            </div>
            <div class="help" onclick="(allClick('help2'))">
            <p>What happens at each step of the algorithm?</p>
            <div id="help2" class="help_item">Step-by-step explanation</div>
            </div>
            <div class="help" onclick="(allClick('help3'))">
            <p>What are the settings?</p>
            <div id="help3" class="help_item">Explain each setting</div>
            </div>
            <div class="help" onclick="(allClick('help4'))">
            <p>How to use the platform?</p>
            <div id="help4" class="help_item">Explain how to use it</div>
            </div>
            
        </div>
    </div>
    `);
    