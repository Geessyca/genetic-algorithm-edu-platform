const fishContainer = document.getElementById("fish-container");
const colorList = document.getElementById("color-list"); 
const finish = document.getElementById("finish");
const color = document.getElementById("color");
const fitness_chart = document.getElementById("fitness-chart")
const fitness_text = document.getElementById("fitness")

function randomColor() {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256)];
}

function fitness(ind, target) {
    return 1 / (1 + Math.sqrt(
        (ind[0] - target[0]) ** 2 +
        (ind[1] - target[1]) ** 2 +
        (ind[2] - target[2]) ** 2
    ));
}

function select(population, target, method) {
    if (method === "torneio") {
        let ind1 = population[Math.floor(Math.random() * population.length)];
        let ind2 = population[Math.floor(Math.random() * population.length)];
        return fitness(ind1, target) > fitness(ind2, target) ? ind1 : ind2;
    } else if (method === "roleta") {
        let totalFitness = population.reduce((sum, ind) => sum + fitness(ind, target), 0);
        let pick = Math.random() * totalFitness;
        let cumulative = 0;
        for (let ind of population) {
            cumulative += fitness(ind, target);
            if (cumulative >= pick) return ind;
        }
    }
    return select(population, target, Math.random() < 0.5 ? "torneio" : "roleta");
}

function crossover(parent1, parent2) {
    let point = Math.floor(Math.random() * 3);
    return [
        [...parent1.slice(0, point), ...parent2.slice(point)],
        [...parent2.slice(0, point), ...parent1.slice(point)]
    ];
}

function mutate(ind, mutationRate) {
    if (Math.random() < mutationRate / 100) {
        let index = Math.floor(Math.random() * 3);
        ind[index] = Math.min(255, Math.max(0, ind[index] + (Math.random() * 50 - 25)));
    }
    return ind;
}

function updateUI(population) {
    fishContainer.innerHTML = "";
    population.forEach(ind => {
        let fish = document.createElement("div");
        fish.className = "fish";
        fish.style.backgroundColor = `rgb(${ind[0]},${ind[1]},${ind[2]})`;
        fish.style.left = Math.random() * 100 + "%";
        fish.style.top = Math.random() * 100 + "%";
        let tail = document.createElement("span");
        tail.className = "tail";
        fish.appendChild(tail);
        fishContainer.appendChild(fish);
    });
}

function calcularMedia(population) {
    let soma = [0, 0, 0];
    population.forEach(ind => {
        soma[0] += ind[0];
        soma[1] += ind[1];
        soma[2] += ind[2];
    });
    return soma.map(val => Math.round(val / population.length));
}

// Criar gráfico de fitness
let ctxFitness = fitness_chart.getContext("2d");
let fitnessChart = new Chart(ctxFitness, {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "Melhor Aptidão",
            data: [],
            borderColor: "#025310 ",
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

function adicionarCirculoDeCor(generation, media) {
    let circle = document.createElement("div");
    circle.className = "color-circle";
    circle.style.backgroundColor = `rgb(${media[0]},${media[1]},${media[2]})`;
    circle.title = `Geração ${generation}: rgb(${media[0]}, ${media[1]}, ${media[2]})`;
    colorList.appendChild(circle);
}

function atualizarEstatisticas(population, generation, melhorFitness) {
    let media = calcularMedia(population);

    // Atualizar gráfico de fitness
    fitnessChart.data.labels.push(generation);
    fitnessChart.data.datasets[0].data.push(melhorFitness);
    fitnessChart.update();

    // Adicionar círculo de cor a cada 5 gerações
    if (generation % 5 === 0) {
        adicionarCirculoDeCor(generation, media);
    }
}

function geneticAlgorithm({ precisionRateValue,mutationRate, corDeParada, geracoesMax, populacaoInicial, repetirAte, metodoSelecao }) {
    let circle = document.createElement("div");
    circle.className = "color-circle";
    circle.style.backgroundColor = `rgb(${corDeParada[0]},${corDeParada[1]},${corDeParada[2]})`;
    circle.title = `Coloração a ser alcançada: rgb(${corDeParada[0]}, ${corDeParada[1]}, ${corDeParada[2]})`;
    color.innerText="Coloração a ser alcançada:"
    color.appendChild(circle);

    fitness_text.innerText=`Taxa de aptidão alcançada: <b>${0}%</b>/${precisionRateValue}%`

    let population = Array.from({ length: populacaoInicial }, randomColor);
    let generation = 1;

    function step() {
        population = population.sort((a, b) => fitness(b, corDeParada) - fitness(a, corDeParada));
        
        finish.innerHTML = `Geração atual: <b>${generation}</b>`
       
        let newPopulation = [];
        
        for (let i = 0; i < populacaoInicial / 2; i++) {
            let runButton = document.getElementById("run");
            let simuButton = document.getElementById("simu");
        
            runButton.style.display = "none"
            simuButton.style.display = "flex"
            let parent1 = select(population, corDeParada, metodoSelecao);
            let parent2 = select(population, corDeParada, metodoSelecao);
            let [child1, child2] = crossover(parent1, parent2);

            newPopulation.push(mutate(child1, mutationRate), mutate(child2, mutationRate));
        }

        population = newPopulation;
        fitness_pop = fitness(population[0], corDeParada);
        let fitnessPercentual = parseFloat((fitness_pop * 100).toFixed(1));

        fitness_text.innerHTML=`Taxa de aptidão alcançada: <b>${fitnessPercentual}%</b>/${precisionRateValue}%`


        updateUI(population);
        atualizarEstatisticas(population,  generation, fitnessPercentual);
         
        if (generation >= geracoesMax+1 && repetirAte == "generations") {
            finish.innerHTML = `Finalizado na geração: <b>${generation}</b>`;
            return;
        }

        if (fitness_pop >= precisionRateValue/100) {
            finish.innerHTML = `Finalizado na geração: <b>${generation}</b>`;
            
            return;
        }

        generation++;

        requestAnimationFrame(step);
    }
    step();


}

function clickExecution() {
    let precisionRateValue = localStorage.getItem("Taxa_Precisao") || 50;
    let mutationRate = localStorage.getItem("Taxa_Mutacao") || 50;
    let corDeParada =  localStorage.getItem("Cor_Parada");
    let geracoesMax = parseInt(localStorage.getItem("Geracao"));
    let populacaoInicial = parseInt(localStorage.getItem("Populacao_Inicial")) || 10;
    let repetirAte = localStorage.getItem("Criterio_Parada") || "random";
    let metodoSelecao = localStorage.getItem("Selecao") || "torneio";
    if (repetirAte == "generations") {
        corDeParada = [212, 146, 221]
    }
    else if (repetirAte == "color") {
        corDeParada = corDeParada.split(",").map(Number);
    }
    else {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        corDeParada = [r, g, b]
    }
    fishContainer.innerHTML = "";
    colorList.innerHTML = "";
    finish.innerHTML = "";
    color.innerHTML = "";    
    fitnessChart.data.labels = []; // Limpa os rótulos
        fitnessChart.data.datasets.forEach((dataset) => {
            dataset.data = []; // Limpa os dados
        });
        fitnessChart.update(); // Atualiza o gráfico
    geneticAlgorithm({ precisionRateValue,mutationRate, corDeParada, geracoesMax, populacaoInicial, repetirAte, metodoSelecao });
}

