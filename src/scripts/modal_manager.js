/**
 * Returns the modal text for a given key and language.
 * @param {string} key - The text key.
 * @returns {string}
 */
const getModalText = (key) => {
    const LANG_MODAL_DICT = {
        pt: {
            settings: "Configurações",
            precisionRate: "Taxa de precisão (%)",
            mutationRate: "Taxa de Mutação (%)",
            populationSize: "Tamanho da População",
            selectionMethod: "Método de Seleção",
            selectionInfoTitle: "O que são os métodos de seleção?",
            selectionInfoRandom: "A <b>Seleção Aleatória</b> escolhe de forma aleatória entre a seleção por torneio ou roleta",
            selectionInfoTournament: "A <b>Seleção por Torneio</b> escolhe um conjunto de indivíduos aleatoriamente e seleciona o melhor deles para reprodução.",
            selectionInfoRoulette: "A <b>Seleção por Roleta</b> atribui uma probabilidade de seleção proporcional à aptidão dos indivíduos, com mais aptos tendo maior chance de serem escolhidos.",
            randomSelection: "Seleção Aleatória",
            tournamentSelection: "Seleção por Torneio",
            rouletteSelection: "Seleção por Roleta",
            stopCriteria: "Critério de Parada",
            criteriaInfoTitle: "O que são os critérios de parada?",
            criteriaInfoRandom: "O <b>Critério Aleatório</b> escolhe uma cor aleatória para finalizar a simulação.",
            criteriaInfoColor: "O <b>Critério por Cor</b> permite que você defina uma cor específica para que a simulação pare assim que a população atingir a cor escolhida.",
            criteriaInfoGeneration: "O <b>Critério por Número de Gerações</b> determina que a simulação será interrompida após um número específico de gerações ser alcançado."
        },
        en: {
            settings: "Settings",
            precisionRate: "Precision Rate (%)",
            mutationRate: "Mutation Rate (%)",
            populationSize: "Population Size",
            selectionMethod: "Selection Method",
            selectionInfoTitle: "What are selection methods?",
            selectionInfoRandom: "<b>Random Selection</b> randomly chooses between tournament or roulette selection.",
            selectionInfoTournament: "<b>Tournament Selection</b> selects a group of individuals randomly and picks the best one for reproduction.",
            selectionInfoRoulette: "<b>Roulette Selection</b> assigns a selection probability proportional to the fitness of individuals, giving fitter ones a higher chance of being chosen.",
            randomSelection: "Random Selection",
            tournamentSelection: "Tournament Selection",
            rouletteSelection: "Roulette Selection",
            stopCriteria: "Stop Criteria",
            criteriaInfoTitle: "What are stop criteria?",
            criteriaInfoRandom: "<b>Random Criterion</b> chooses a random color to end the simulation.",
            criteriaInfoColor: "<b>Color Criterion</b> lets you choose a specific color that, once reached by the population, stops the simulation.",
            criteriaInfoGeneration: "<b>Generation Count Criterion</b> stops the simulation after a defined number of generations is reached."
        }
    };
    const lang = localStorage.getItem('lang') || 'pt';
    return LANG_MODAL_DICT[lang][key] || key;
};

/**
 * Renders the modal HTML content.
 */
const renderModal = () => {
    loadHTML('modais-container', `
    <!-- Modal de Configurações / Settings Modal -->
    <div id="configModalBG" class="modal" onclick="closeAllModals()"></div>
    <div id="configModal" style="display:none">
        <div class="modal-content">
            <span class="close-btn" onclick="closeModal('configModal')"><svg class="w-6 h-6 text-gray-800 dark:text-white"
                    aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                    viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M6 18 17.94 6M18 18 6.06 6" />
                </svg></span>
            <h2>${getModalText('settings')}</h2>
            <div class="config-item">
                <label for="precisionRate">${getModalText('precisionRate')}</label>
                <input type="range" id="precisionRate" name="precisionRate" min="10" max="90" value="80">
                <span id="precisionRateValue">80%</span>
            </div>
            <div class="config-item">
                <label for="mutationRate">${getModalText('mutationRate')}</label>
                <input type="range" id="mutationRate" name="mutationRate" min="10" max="70" value="50">
                <span id="mutationRateValue">50%</span>
            </div>
            <div class="config-item">
                <label for="populationSize">${getModalText('populationSize')}</label>
                <input type="number" id="populationSize" name="populationSize" min="10" max="100" value="10">
            </div>
            <div class="config-item">
                <label style="display: flex;" for="selectionMethod">${getModalText('selectionMethod')}
                    <div class="info" onclick="showInfo('selection-info')" onmouseover="showInfo('selection-info')">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span class="more_info" id="selection-info" onmouseleave="hideInfo('selection-info')">
                            <h4>${getModalText('selectionInfoTitle')}</h4>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">${getModalText('selectionInfoRandom')}</p>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">${getModalText('selectionInfoTournament')}</p>
                            <p>${getModalText('selectionInfoRoulette')}</p>
                        </span>
                    </div>
                </label>
                <div>
                    <input type="radio" id="randomSelection" name="selectionMethod" value="random">
                    <label for="randomSelection">${getModalText('randomSelection')}</label>
                    <input type="radio" id="torneioSelection" name="selectionMethod" value="torneio">
                    <label for="torneioSelection">${getModalText('tournamentSelection')}</label>
                    <input type="radio" id="rouletteSelection" name="selectionMethod" value="roleta" checked>
                    <label for="rouletteSelection">${getModalText('rouletteSelection')}</label>
                </div>
            </div>
            <div class="config-item">
                <label for="stopCriteria" style="display: flex;">
                    ${getModalText('stopCriteria')}
                    <div class="info" onclick="showInfo('criteria-info')" onmouseover="showInfo('criteria-info')">
                        <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        <span class="more_info" id="criteria-info" onmouseleave="hideInfo('criteria-info')">
                            <h4>${getModalText('criteriaInfoTitle')}</h4>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">${getModalText('criteriaInfoRandom')}</p>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">${getModalText('criteriaInfoColor')}</p>
                            <p style="border-bottom: 1px solid rgb(196, 194, 194);">${getModalText('criteriaInfoGeneration')}</p>
                        </span>
                    </div>
                </label>
            </div>
        </div>
    </div>
    `);
};

// Update modal when language changes
window.addEventListener('storage', (e) => {
    if (e.key === 'lang') {
        renderModal();
    }
});

document.addEventListener('DOMContentLoaded', renderModal);
