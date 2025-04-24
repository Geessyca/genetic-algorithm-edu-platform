const stepContainer = document.getElementById("steps-container");
const individual = document.getElementById("individual");
const rouletteCanvas = document.getElementById("rouletteCanvas");
const selection = document.getElementById("selection");
const itens = document.getElementById("itens");
const restartButton = document.getElementById("restart");
const step1Button = document.getElementById("step1");
const step2Button = document.getElementById("step2");
const step3Button = document.getElementById("step3");
const step4Button = document.getElementById("step4");
const step5Button = document.getElementById("step5");
const selection1Button = document.getElementById("selection1");
const selection2Button = document.getElementById("selection2");
const targetColor = [107, 145, 190];
var fishIdCounterByStep = 0;
var population = []
var selectionMethod = ""
var childs = []
var mutations = []
var inRun = false
document.addEventListener("DOMContentLoaded", function () {
    restartButton.classList.add("disabled")
    step2Button.classList.add("disabled")
    step3Button.classList.add("disabled")
    step4Button.classList.add("disabled")
    step5Button.classList.add("disabled")
    restartButton.addEventListener("click", function () {
        fishIdCounterByStep = 0;
        population = []
        selectionMethod = ""
        childs = []
        mutations = []
        inRun = false
        individual.innerHTML = ""
        itens.innerHTML = "";
        step1Button.classList.remove("disabled")
        step2Button.classList.add("disabled")
        step3Button.classList.add("disabled")
        step4Button.classList.add("disabled")
        step5Button.classList.add("disabled")
        selection.style.display = "none"
        selection1Button.classList.remove("disabled")
        selection2Button.classList.remove("disabled")
    });
    step1Button.addEventListener("click", function () {
        if (!step1Button.classList.contains("disabled")) {
            step1();
            step1Button.classList.add("disabled")
            step2Button.classList.remove("disabled")
            restartButton.classList.remove("disabled")
        }
    });
    step2Button.addEventListener("click", function () {
        if (!step2Button.classList.contains("disabled")) {
            if (inRun) {
                step1WithPopulation();
            }
            selection.style.display = ""
            selectionMethod = ""
            step2Button.classList.add("disabled")
            selection1Button.classList.remove("disabled")
            selection2Button.classList.remove("disabled")
            selection1Button.style.backgroundColor = "#19882c"
            selection2Button.style.backgroundColor = "#19882c"
        }
    });
    selection1Button.addEventListener("click", function () {
        if (!selection1Button.classList.contains("disabled")) {
            selectionMethod = "torneio"
            step2();
            selection1Button.style.backgroundColor = "#156b23"
            selection2Button.style.backgroundColor = "#19882c"
            selection1Button.classList.add("disabled")
            selection2Button.classList.add("disabled")
            step3Button.classList.remove("disabled")
        }
    });
    selection2Button.addEventListener("click", function () {
        if (!selection2Button.classList.contains("disabled")) {
            rouletteCanvas.style.display = ""
            selectionMethod = "roleta"
            step2();
            selection1Button.style.backgroundColor = "#19882c"
            selection2Button.style.backgroundColor = "#156b23"
            selection1Button.classList.add("disabled")
            selection2Button.classList.add("disabled")
            step3Button.classList.remove("disabled")
        }
    });
    step3Button.addEventListener("click", function () {
        if (!step3Button.classList.contains("disabled")) {
            step3();
            rouletteCanvas.style.display = "none"
            selection.style.display = "none"
            step3Button.classList.add("disabled")
            step4Button.classList.remove("disabled")
        }
    });
    step4Button.addEventListener("click", function () {
        if (!step4Button.classList.contains("disabled")) {
            step4();
            step4Button.classList.add("disabled")
            step5Button.classList.remove("disabled")
        }
    });
    step5Button.addEventListener("click", function () {
        if (!step5Button.classList.contains("disabled")) {
            step5();
            step5Button.classList.add("disabled")
            step2Button.classList.remove("disabled")
            inRun = true
        }
    });
});

function step1WithPopulation() {
    itens.innerHTML = "";
    childs = []
    mutations = []
    function addIndividual(id, color) {
        let circle = document.createElement("div");
        circle.className = "color-circle";
        circle.id = id
        circle.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        individual.appendChild(circle);
    }
    population.forEach(ind => {
        addIndividual(ind.id, ind.color);
    });
}
function step1() {
    fishIdCounterByStep = 0;
    population = []
    childs = []
    mutations = []
    selectionMethod = ""
    individual.innerHTML = ""
    itens.innerHTML = "";
    function addIndividual(id, color) {
        let circle = document.createElement("div");
        circle.className = "color-circle";
        circle.id = id
        circle.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        individual.appendChild(circle);
    }

    population = Array.from({ length: 10 }, () => {
        let id = fishIdCounterByStep++;
        let color = generateRandomColor();
        addIndividual(id, color);
        return {
            id: id,
            color: color
        };
    });
}

async function step2() {
    itens.innerHTML = "";

    const [selectedParents, selectedIds] = await selectParentAnimate(population, targetColor, selectionMethod);
    population.forEach(ind => {
        if (!selectedIds.includes(ind.id)) {
            const el = document.getElementById(ind.id);
            if (el) {
                el.style.transition = 'opacity 1s ease-in-out';
                el.style.opacity = '0';
            }
        }
    });
    population = selectedParents
}

function step3() {
    individual.innerHTML = ""
    itens.innerHTML = ""
    function addIndividual(individual) {
        let groupDiv = document.createElement("div");
        groupDiv.className = "groupDiv";
        individual.forEach((ind, index) => {

            if (index == 2) {
                let line = document.createElement("div");
                line.className = "line";
                groupDiv.appendChild(line);

            }
            else {
                let circle = document.createElement("div");
                circle.className = "color-circle";
                if (index < 2) {
                    circle.classList.add("patern");
                    if (index == 1) {
                        circle.classList.add("invert");
                    }
                } else {
                    circle.classList.add("child");
                    if (index == 4) {
                        circle.classList.add("invert");
                    }
                }

                circle.id = ind.id;
                circle.style.backgroundColor = `rgb(${ind.color[0]}, ${ind.color[1]}, ${ind.color[2]})`;
                groupDiv.appendChild(circle);
            }

        });

        itens.appendChild(groupDiv);
    }

    const newPopulation = []
    for (let i = 0; i < population.length; i++) {
        const parent1 = population[getRandomIndex(population.length)];
        const parent2 = population[getRandomIndex(population.length)];
        const [childColor1, childColor2] = crossoverColors(parent1, parent2);
        const newChildColor1 = mutateColor(childColor1, mutationRate);
        const newChildColor2 = mutateColor(childColor2, mutationRate);
        addIndividual([parent1, parent2, {}, childColor1, childColor2]);
        childs.push(childColor1, childColor2)
        mutations.push(newChildColor1, newChildColor2)
        newPopulation.push(
            mutateColor(childColor1, mutationRate),
            mutateColor(childColor2, mutationRate)
        );
    }
    population = newPopulation;

}


function step4() {
    individual.innerHTML = ""
    itens.innerHTML = "";
    function addIndividual(id, color) {
        let containerId = `container-${id}`;
        let container = document.getElementById(containerId);


        if (!container) {
            container = document.createElement("div");
            container.id = containerId;
            container.className = "color-group";
            itens.appendChild(container);
        }


        let circle = document.createElement("div");
        circle.className = "color-circle";
        circle.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;


        container.appendChild(circle);
    }
    childs.forEach(item => addIndividual(item.id, item.color));
    mutations.forEach(item => addIndividual(item.id, item.color));

}

function step5() {
    itens.innerHTML = "";
    let averageFitness = 0;
    function addIndividual(color) {
        let individual = document.createElement("div");
        individual.className = 'fitness_box'
        individual.style.backgroundColor = `rgb(${color[0]},${color[1]},${color[2]})`;
        const fitness = calculateFitness(color, targetColor)
        const fitnessPercent = parseFloat((fitness * 100).toFixed(1));
        averageFitness = averageFitness + fitness
        individual.innerText = `${fitnessPercent} %`;
        itens.appendChild(individual);
    }

    population.forEach(item => addIndividual(item.color));
}
function step6(averageFitness) {
    if (averageFitness >= 0.8) {
        step1Button.classList.remove("disabled")
        step2Button.classList.add("disabled")
        step3Button.classList.add("disabled")
        step4Button.classList.add("disabled")
        step5Button.classList.add("disabled")
        itens.innerHTML = itens.innerHTML + "<div class='step_end'> Stopping criterion reached! </div>"
        inRun = false
    }
}