function salvarNoLocalStorage(chave, valor) {
    localStorage.setItem(chave, valor);
}
function loadHTML(id, file) {
    document.getElementById(id).innerHTML = file;
}

function allClick(id) {
    var modal = document.getElementById(id);
    if (modal.classList.contains("modal_show")){
        modal.classList.remove("modal_show");
    }
    else{
        modal.classList.add("modal_show");

    }
}

function showInfo(id) {
    var modal = document.getElementById(id);
    modal.classList.add("modal_show");
}
function hideInfo(id) {
    var modal = document.getElementById(id);
    modal.classList.remove("modal_show");
}

function openModal(id) {
    document.getElementById(id).style.display = "flex";
    document.getElementById("configModalBG").style.display = "block";
    document.getElementById("mutationRate").addEventListener("input", function () {
        document.getElementById("mutationRateValue").textContent = this.value + "%";
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
}
function closeModal(id) {
    document.getElementById(id).style.display = "none";    
    document.getElementById("configModalBG").style.display = "none";
}
function closeModalAll() {
    document.getElementById("configModal").style.display = "none";    
    document.getElementById("helpModal").style.display = "none";    
    document.getElementById("configModalBG").style.display = "none";
}
function applySettings() {
    const mutationRate = document.getElementById("mutationRate").value;
    const precisionRate = document.getElementById("precisionRate").value;
    const populationSize = document.getElementById("populationSize").value;
    const selectionMethod = document.querySelector('input[name="selectionMethod"]:checked').value;
    const stopCriteria = document.querySelector('input[name="stopCriteria"]:checked').value;
    let stopColor = null;
    let stopGenerations = null;
    if (stopCriteria === "color") {
        hex = document.getElementById("stopColor").value;
        hex = hex.substring(1);

        let r = parseInt(hex.substring(0, 2), 16);
        let g = parseInt(hex.substring(2, 4), 16);
        let b = parseInt(hex.substring(4, 6), 16);
        stopColor=`${[r,g,b]}`
    }
    if (stopCriteria === "generations") {
        stopGenerations = document.getElementById("stopGenerations").value;
    }
    console.log("Configurações Aplicadas:");
    console.log("Taxa de Mutação: " + mutationRate + "%");
    console.log("Taxa de Presição: " + precisionRate + "%");
    console.log("Tamanho da População: " + populationSize);
    console.log("Método de Seleção: " + selectionMethod);
    console.log("Critério de Parada: " + stopCriteria);
    console.log("Cor de Parada: " + stopColor);
    console.log("Número de Gerações de Parada: " + stopGenerations);

    salvarNoLocalStorage("Taxa_Mutacao", mutationRate);
    salvarNoLocalStorage("Taxa_Precisao", precisionRate);
    salvarNoLocalStorage("Populacao_Inicial", populationSize);
    salvarNoLocalStorage("Selecao", selectionMethod);
    salvarNoLocalStorage("Criterio_Parada", stopCriteria);
    
    if (stopCriteria === "color") {
        salvarNoLocalStorage("Cor_Parada", stopColor);
    }
    
    if (stopCriteria === "generations") {
        salvarNoLocalStorage("Geracao", stopGenerations);
    }

    closeModal("configModal");
}


