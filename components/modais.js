loadHTML('modais-container', `
<!-- Modal de Configurações -->
<div id="configModalBG" class="modal" onclick="closeModalAll()"></div>

<div id="configModal" style="display:none">
    <div class="modal-content">
        <span class="close-btn" onclick="closeModal('configModal')"><svg class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18 17.94 6M18 18 6.06 6" />
            </svg></span>
        <h2>Configurações</h2>
        <div class="config-item">
            <label for="precisionRate">Taxa de precisão (%)</label>
            <input type="range" id="precisionRate" name="precisionRate" min="10" max="90" value="80">
            <span id="precisionRateValue">80%</span>
        </div>
        <div class="config-item">
            <label for="mutationRate">Taxa de Mutação (%)</label>
            <input type="range" id="mutationRate" name="mutationRate" min="10" max="70" value="30">
            <span id="mutationRateValue">30%</span>
        </div>
        <div class="config-item">
            <label for="populationSize">Tamanho da População</label>
            <input type="number" id="populationSize" name="populationSize" min="10" max="100" value="50">
        </div>
        <div class="config-item">
            <label style="display: flex;" for="selectionMethod">Método de Seleção
                <div class="info" onclick="showInfo('selection-info')" onmouseover="showInfo('selection-info')">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="more_info" id="selection-info" onmouseleave="hideInfo('selection-info')">
                        <h4>O que são os métodos de seleção?</h4>
                        <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                            A <b>Seleção Aleatória</b> escolhe de forma aleatória entre a seleção por torneio ou roleta
                        </p>
                        <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                            A <b>Seleção por Torneio</b> escolhe um conjunto de indivíduos aleatoriamente e
                            seleciona o melhor deles para reprodução.
                        </p>
                        <p>
                            A <b>Seleção por Roleta</b> atribui uma probabilidade de seleção proporcional à aptidão
                            dos indivíduos, com mais aptos tendo maior chance de serem escolhidos.
                        </p>
                    </span>
                </div>
            </label>
            <div>
                <input type="radio" id="randomSelection" name="selectionMethod" value="random" >
                <label for="randomSelection">Seleção Aleatória</label>
                <input type="radio" id="torneioSelection" name="selectionMethod" value="torneio">
                <label for="torneioSelection">Seleção por Torneio</label>
                <input type="radio" id="rouletteSelection" name="selectionMethod" value="roleta" checked>
                <label for="rouletteSelection">Seleção por Roleta</label>
            </div>
        </div>
        <div class="config-item">
            <label for="stopCriteria" style="display: flex;">
                Critério de Parada
                <div class="info" onclick="showInfo('criteria-info')" onmouseover="showInfo('criteria-info')">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span class="more_info" id="criteria-info" onmouseleave="hideInfo('criteria-info')">
                        <h4>O que são os critérios de parada?</h4>
                        <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                            O <b>Critério Aleatório</b> escolhe uma cor aleatória para finalizar a simulação.
                        </p>
                        <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                            O <b>Critério por Cor</b> permite que você defina uma cor específica para que a simulação
                            pare assim que a população atingir a cor escolhida.
                        </p>
                        <p style="border-bottom: 1px solid rgb(196, 194, 194);">
                                O <b>Critério por Número de Gerações</b> determina que a simulação será interrompida após um número específico de gerações ser alcançado.
                            <span style="display:flex; align-items:center;">A aptidão será avaliada através da cor <span class="cor"></span>.
                            </span>
                        </p>
                        <p>
                            Esses critérios ajudam a controlar a evolução do algoritmo genético e definem quando o
                            processo evolutivo será considerado concluído.
                        </p>
                    </span>
                </div>
            </label>
            <div>
                <input type="radio" id="randomStop" name="stopCriteria" value="random" checked>
                <label for="randomStop">Aleatório</label>
                <input type="radio" id="colorStop" name="stopCriteria" value="color">
                <label for="colorStop">Por Cor</label>
                <input type="radio" id="generationsStop" name="stopCriteria" value="generations">
                <label for="generationsStop">Por Número de Gerações</label>
            </div>
            <div class="criteria" id="colorStopSection" style="display: none;">
                <label for="stopColor">Escolha a Cor de Parada</label>
                <input type="color" id="stopColor" name="stopColor">
            </div>
            <div class="criteria" id="generationsStopSection" style="display: none;">
                <label for="stopGenerations">Número de Gerações</label>
                <input type="number" id="stopGenerations" name="stopGenerations" min="10" max="1000" value="100">
            </div>
        </div>
        <div class="config-item">
            <button id="applyConfigBtn" onclick="applySettings()">Aplicar Configurações</button>
        </div>
    </div>
</div>

<!-- Modal de Ajuda -->
<div id="helpModal" style="display:none">
    <div class="modal-content">
        <span class="close-btn" onclick="closeModal('helpModal')"><svg class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
                viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18 17.94 6M18 18 6.06 6" />
            </svg></span>
        <h2>Ajuda</h2>
        <div class="help" onclick="(allClick('help1'))">
        <p >O que são algoritmos genéticos?</p>
        <div id="help1" class="help_item">Explicação geral</div>
        </div>
        <div class="help" onclick="(allClick('help2'))">
        <p>O que ocorre em cada etapa do algoritmo?</p>
        <div id="help2" class="help_item">Explicação por topico</div>
        </div>
        <div class="help" onclick="(allClick('help3'))">
        <p>O que são as configurações?</p>
        <div id="help3" class="help_item">Explicar cada configurações</div>
        </div>
        <div class="help" onclick="(allClick('help4'))">
        <p>Como usar a plataforma?</p>
        <div id="help4" class="help_item">Explicar como usar</div>
        </div>
        
    </div>
</div>
`);