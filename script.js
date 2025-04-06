
const fishContainer = document.getElementById("fish-container");
const generationLabel = document.getElementById("generation_current");
const fitnessChartCanvas = document.getElementById("fitness_current-chart");
const fitnessStatus = document.getElementById("fitness_current");

let fishIdCounter = 0;


function generateRandomColor() {
    return [
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256),
        Math.floor(Math.random() * 256)
    ];
}

function calculateFitness(individual, targetColor) {
    const weightR = 0.3, weightG = 0.59, weightB = 0.11;
    const distance = Math.sqrt(
        weightR * (individual[0] - targetColor[0]) ** 2 +
        weightG * (individual[1] - targetColor[1]) ** 2 +
        weightB * (individual[2] - targetColor[2]) ** 2
    );

    return 1 / (1 + distance / 30);
}

function tournamentSelectionUnique(population, targetColor, numSelected) {
    const selected = [];
    const selectedIds = [];

    while (selected.length < numSelected) {
        const a = population[Math.floor(Math.random() * population.length)];
        const b = population[Math.floor(Math.random() * population.length)];

        const winner = calculateFitness(a.color, targetColor) > calculateFitness(b.color, targetColor) ? a : b;

        if (!selected.includes(winner)) {
            selected.push(winner);
            selectedIds.push(winner.id)
        }
    }

    return [selected, selectedIds];
}

function rouletteSelectionUnique(population, targetColor, numSelected) {
    const selected = [];
    const selectedIds = [];

    while (selected.length < numSelected) {
        const totalFitness = population.reduce(
            (sum, ind) => sum + calculateFitness(ind.color, targetColor), 0
        );

        const threshold = Math.random() * totalFitness;
        let cumulative = 0;

        for (const individual of population) {
            cumulative += calculateFitness(individual.color, targetColor);
            if (cumulative >= threshold) {
                const alreadySelected = selected.some(sel => JSON.stringify(sel) === JSON.stringify(individual));
                if (!alreadySelected) {
                    selected.push(individual);
                    selectedIds.push(individual.id)
                }
                break;
            }
        }
    }

    return [selected, selectedIds];
}

async function rouletteSelectionUniqueAnimate(population, targetColor, numSelected) {
    const canvas = document.getElementById('rouletteCanvas');
    const ctx = canvas.getContext('2d');
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 150;

    const selected = [];
    const selectedIds = [];
    let isSelecting = true;

    const fitnesses = population.map(ind => calculateFitness(ind.color, targetColor));
    const totalFitness = fitnesses.reduce((a, b) => a + b, 0);
    const angles = fitnesses.map(fit => (fit / totalFitness) * 2 * Math.PI);

    let rotation = 0;

    function drawRoulette() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let startAngle = rotation;

        for (let i = 0; i < population.length; i++) {
            const individual = population[i];
            const angle = angles[i];
            const fitness = fitnesses[i];
            const endAngle = startAngle + angle;

            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = `rgb(${individual.color[0]},${individual.color[1]},${individual.color[2]})`;
            ctx.fill();

            
            if (selectedIds.includes(individual.id)) {
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#156b23";
                ctx.stroke();
            }

            
            const middleAngle = startAngle + angle / 2;
            const textX = centerX + (radius * 0.6) * Math.cos(middleAngle);
            const textY = centerY + (radius * 0.6) * Math.sin(middleAngle);

            ctx.fillStyle = "#fff";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.save();
            ctx.translate(textX, textY);
            ctx.rotate(middleAngle);
            ctx.fillText(fitness.toFixed(1), 0, 0);
            ctx.restore();

            startAngle = endAngle;
        }

        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - radius - 10);
        ctx.lineTo(centerX - 10, centerY - radius - 30);
        ctx.lineTo(centerX + 10, centerY - radius - 30);
        ctx.closePath();
        ctx.fillStyle = "#FF0000";
        ctx.fill();
    }

    function spinAndSelect() {
        if (selected.length >= numSelected) return false;

        const pointerAngle = (2 * Math.PI + (-Math.PI / 2 - rotation)) % (2 * Math.PI);

        let startAngle = 0;
        for (let i = 0; i < population.length; i++) {
            const endAngle = startAngle + angles[i];
            if (pointerAngle >= startAngle && pointerAngle < endAngle) {
                const ind = population[i];
                if (!selectedIds.includes(ind.id)) {
                    selected.push(ind);
                    selectedIds.push(ind.id);
                    return true;
                }
                break;
            }
            startAngle = endAngle;
        }

        return false;
    }

    function animate() {
        if (isSelecting) {
            rotation += 0.05; 
            if (rotation >= 2 * Math.PI) rotation = 0;
        }
        drawRoulette();
        requestAnimationFrame(animate);
    }

    function selectAllWithDelay() {
        return new Promise(resolve => {
            function trySelect() {
                if (selected.length >= numSelected) {
                    isSelecting = false;
                    resolve(); 
                    return;
                }

                const gotNew = spinAndSelect();
                setTimeout(trySelect, gotNew ? 600 : 30); 
            }

            trySelect();
        });
    }

    animate();
    await selectAllWithDelay();

    return [selected, selectedIds];
}
async function selectParentAnimate(population, targetColor, selectionMethod) {
    const numSelected = population.length / 2
    if (selectionMethod === "torneio") {
        return tournamentSelectionUnique(population, targetColor, numSelected)
    } else if (selectionMethod === "roleta") {
        return await rouletteSelectionUniqueAnimate(population, targetColor, numSelected)
    }
    return selectParent(population, targetColor, Math.random() < 0.5 ? "torneio" : "roleta");
}


function selectParent(population, targetColor, selectionMethod) {
    const numSelected = population.length / 2
    if (selectionMethod === "torneio") {
        return tournamentSelectionUnique(population, targetColor, numSelected)
    } else if (selectionMethod === "roleta") {
        return rouletteSelectionUnique(population, targetColor, numSelected)
    }
    return selectParent(population, targetColor, Math.random() < 0.5 ? "torneio" : "roleta");
}

function crossoverColors(parent1, parent2) {
    const crossoverPoint = Math.floor(Math.random() * 3);
    return [
        { id: fishIdCounter++, color: [...parent1.color.slice(0, crossoverPoint), ...parent2.color.slice(crossoverPoint)] },
        { id: fishIdCounter++, color: [...parent2.color.slice(0, crossoverPoint), ...parent1.color.slice(crossoverPoint)] }
    ];
}

function mutateColor(individual, mutationRate) {
    if (Math.random() < mutationRate / 100) {
        const channelIndex = Math.floor(Math.random() * 3);
        individual.color[channelIndex] = Math.min(255, Math.max(0, individual.color[channelIndex] + (Math.random() * 50 - 25)));
    }
    return individual;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


const ctx = fitnessChartCanvas.getContext("2d");
const fitnessChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Melhor Aptidão",
            data: [],
            borderColor: "#025310",
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { title: { display: true, text: "Geração" } },
            y: { title: { display: true, text: "Aptidão (%)" }, min: 0, max: 100 }
        }
    }
});


function atualizarEstatisticasGeracao(generation, melhorFitnessPercentual) {
    fitnessChart.data.labels.push(generation);
    fitnessChart.data.datasets[0].data.push(melhorFitnessPercentual);
    fitnessChart.update();
}

const birdFlightDelay = 500;
const fishRemovalDelay = 1000;

async function atualizarInterface(population, selectedIds, generation) {
    fishContainer.innerHTML = '<img id="bird" src="bird.gif"/>';

    population.forEach(individual => {
        const fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundColor = `rgb(${individual.color[0]},${individual.color[1]},${individual.color[2]})`;
        fish.style.left = Math.random() * 100 + "%";
        fish.style.top = `calc(${10 + Math.random() * 70}% + 20px)`;
        fish.dataset.id = individual.id;
        fish.id = individual.id;

        const tail = document.createElement("span");
        tail.className = "tail";
        fish.appendChild(tail);
        fishContainer.appendChild(fish);
    });

    async function birdHuntsFish(index = 0) {
        if (index >= population.length || population.length === 0) return;
        const id = population[index].id
        const fish = document.getElementById(id);

        if (fish && !selectedIds.includes(id)) {
            const bird = document.getElementById("bird");
            bird.style.opacity = "1";
            bird.style.transition = "left 0.5s ease-in-out, top 0.5s ease-in-out";
            bird.style.left = `calc(${fish.style.left} - 30px)`;
            bird.style.top = `calc(${fish.style.top} - 50px)`;

            await delay(birdFlightDelay);

            fish.style.transition = "transform 0.1s ease-out, opacity 0.1s ease-out";
            fish.style.opacity = "0";

            await delay(fishRemovalDelay);
            fish.remove();
        }

        await birdHuntsFish(index + 1);
    }

    if (generation <= 5) {
        await birdHuntsFish();
    }
}

function getRandomIndex(max) {
    return Math.floor(Math.random() * max);
}

function animationReset() {
    const sun = document.querySelector('.sun');
    const sunReflection = document.querySelector('.sun-container-reflection .sun');
    const light = document.querySelector('.light');

    [sun, sunReflection, light].forEach(el => {
        el.style.animation = 'none';
        void el.offsetWidth;
    });

    sun.style.animation = 'rise 20s linear';
    sunReflection.style.animation = 'rise-reflection 20s linear';
    light.style.animation = 'light 20s linear';
}

function geneticAlgorithm({ precisionRateValue, mutationRate, corDeParada, geracoesMax, populacaoInicial, repetirAte, metodoSelecao }) {
    let runButton = document.getElementById("run");
    let simulationButton = document.getElementById("simulation");
    let statisticButton = document.getElementById("statistic");
    runButton.style.display = "none";
    simulationButton.style.display = "flex";
    statisticButton.style.display = "flex";

    let population = Array.from({ length: populacaoInicial }, () => ({
        id: fishIdCounter++,
        color: generateRandomColor()
    }));

    let generation = 1;
    fitnessStatus.innerHTML = `Taxa de aptidão alcançada: <b>0%</b>/${precisionRateValue}%`;

    async function step() {
        population = population.sort((a, b) => calculateFitness(b.color, corDeParada) - calculateFitness(a.color, corDeParada));

        generationLabel.innerHTML = `<p>${generation}</p><span>Geração atual</span>`;

        if (generation < 6) {
            animationReset();
        }

        const [selectedParents, selectedIds] = selectParent(population, corDeParada, metodoSelecao);

        await atualizarInterface(population, selectedIds, generation);

        const newPopulation = [];

        for (let i = 0; i < selectedParents.length; i++) {
            const parent1 = selectedParents[getRandomIndex(selectedParents.length)];
            const parent2 = selectedParents[getRandomIndex(selectedParents.length)];

            const [childColor1, childColor2] = crossoverColors(parent1, parent2);

            newPopulation.push(
                mutateColor(childColor1, mutationRate),
                mutateColor(childColor2, mutationRate)
            );
        }

        population = newPopulation;

        const bird = document.getElementById("bird");
        bird.style.opacity = "0";

        const averageFitness = population.reduce((acc, ind) => acc + calculateFitness(ind.color, corDeParada), 0) / population.length;
        const fitnessPercent = parseFloat((averageFitness * 100).toFixed(1));

        fitnessStatus.innerHTML = `Taxa de aptidão alcançada: <b>${fitnessPercent}%</b>/${precisionRateValue}%`;
        atualizarEstatisticasGeracao(generation, fitnessPercent);

        if (generation>=1500 || (generation >= geracoesMax + 1 && repetirAte === "generations") || averageFitness >= precisionRateValue / 100) {
            runButton.style.display = "flex";
            return;
        }

        generation++;
        requestAnimationFrame(step);
    }

    step();


}


function clickExecution() {
    const precisionRateValue = localStorage.getItem("Taxa_Precisao") || 50;
    const mutationRate = localStorage.getItem("Taxa_Mutacao") || 50;
    const corDeParada = [107, 145, 190];
    const geracoesMax = parseInt(localStorage.getItem("Geracao"));
    const populacaoInicial = parseInt(localStorage.getItem("Populacao_Inicial")) || 10;
    const repetirAte = localStorage.getItem("Criterio_Parada") || "random";
    const metodoSelecao = localStorage.getItem("Selecao") || "torneio";

    fishContainer.innerHTML = "";
    fitnessChart.data.labels = [];
    fitnessChart.data.datasets.forEach(dataset => dataset.data = []);
    fitnessChart.update();

    geneticAlgorithm({
        precisionRateValue,
        mutationRate,
        corDeParada,
        geracoesMax,
        populacaoInicial,
        repetirAte,
        metodoSelecao
    });
}
