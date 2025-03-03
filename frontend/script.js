function salvarNoLocalStorage(chave, valor) {
    localStorage.setItem(chave, valor);
}

const fishContainer = document.getElementById("fish-container");

function hexToRgb(hex) {
    let bigint = parseInt(hex.slice(1), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}

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
    } else { 
        let totalFitness = population.reduce((sum, ind) => sum + fitness(ind, target), 0);
        let pick = Math.random() * totalFitness;
        let cumulative = 0;
        for (let ind of population) {
            cumulative += fitness(ind, target);
            if (cumulative >= pick) return ind;
        }
    }
}

function crossover(parent1, parent2) {
    let point = Math.floor(Math.random() * 3);
    return [
        [...parent1.slice(0, point), ...parent2.slice(point)],
        [...parent2.slice(0, point), ...parent1.slice(point)]
    ];
}

function mutate(ind) {
    if (Math.random() < 0.1) { 
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

function geneticAlgorithm({ corDeParada, geracoesMax, populacaoInicial, repetirAte, metodoSelecao }) {
    let target = hexToRgb(corDeParada);
    let population = Array.from({ length: populacaoInicial }, randomColor);
    let generation = 0;

    function step() {
        population = population.sort((a, b) => fitness(b, target) - fitness(a, target));
        if (generation >= geracoesMax && repetirAte == "Geracao") {
            alert(`Finalizado na geração ${generation}`);
            return;
        }

        let newPopulation = [];
        for (let i = 0; i < populacaoInicial / 2; i++) {
            let parent1 = select(population, target, metodoSelecao);
            let parent2 = select(population, target, metodoSelecao);
            let [child1, child2] = crossover(parent1, parent2);
            newPopulation.push(mutate(child1), mutate(child2));
        }

        population = newPopulation;
        console.log(fitness(population[0], target))

        updateUI(population);
        generation++;

        
        if (fitness(population[0], target) >= 0.60) {
            alert(`Finalizado na geração ${generation}`);
            return;
        }

        requestAnimationFrame(step);
    }
    step();
}


document.addEventListener("DOMContentLoaded", function () {
    let runButton = document.getElementById("run");
    if (runButton) {
        runButton.addEventListener("click", function () {
            const ordem = verificarOrdem(workspace);

            if (ordem) {
                
                let corDeParada = localStorage.getItem("Criterio_Parada");
                let geracoesMax = parseInt(localStorage.getItem("Geracao")) ;
                let populacaoInicial = parseInt(localStorage.getItem("Populacao_Inicial")) || 10;
                let repetirAte = localStorage.getItem("Repetir_Ate") || "Criterio_Parada";
                let metodoSelecao = localStorage.getItem("Selecao") || "torneio";
                if (repetirAte == "Geracao"){
                    corDeParada = "#ffffff"
                }
                if (repetirAte == "Criterio_Parada"){
                    geracoesMax = 2000
                }
                geneticAlgorithm({ corDeParada, geracoesMax, populacaoInicial, repetirAte, metodoSelecao })
                localStorage.removeItem("Criterio_Parada")
                localStorage.removeItem("Geracao")
                localStorage.removeItem("Populacao_Inicial")
                localStorage.removeItem("Repetir_Ate")
                localStorage.removeItem("Selecao")
            }
        });
    } else {
        console.error("Elemento com id 'run' não encontrado.");
    }
});