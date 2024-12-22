import './style.css'
import TspWorker from "./tsp-worker/TspWorker.ts";
import GenerateRandomCities from "./tsp-worker/supporting/CityGenerator.ts";
import {DistanceMatrix} from "./tsp-worker/supporting/DistanceMatrix.ts";
import {drawSolution, generateInitialSolution, throttle} from "./tsp-worker/supporting/Helpers.ts";
import Random from "./tsp-worker/supporting/Random.ts";
import {City, TspUpdateInfo} from "./tsp-worker/supporting/types/TspTypes.ts";
import Solver from "./tsp-worker/tsp-internal/Solver.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="card">
      Amount of threads: <input id="amountOfThreads" value="1">
      <button id="counter" type="button">Load</button>
      Amount of cities: <input id="amountOfCities" value="75">
    </div>
    <div class="main-body">
    <div class="side">
    <h1>Cities textbox</h1>
    <textarea id="cities"></textarea>
    <button id="clear">clear</button>
   </div>
    <canvas width="1000" height="600"></canvas>
    <div class="info">
    <h4 id="currentTemp">Current temp: </h4>
    <h4 id="currentCost">Current cost: </h4>
    <h4 id="iterations">Iterations: </h4>
</div>
    </div>
</div>
  </div>
`
const clearBtn = document.querySelector<HTMLButtonElement>('#clear')!;
const button = document.querySelector<HTMLButtonElement>('#counter')!;
const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const citiesText = document.querySelector<HTMLTextAreaElement>('#cities')!;

const currentTempText = document.querySelector<HTMLHeadingElement>('#currentTemp')!;
const currentCostText = document.querySelector<HTMLHeadingElement>('#currentCost')!;
const iterationsText = document.querySelector<HTMLHeadingElement>('#iterations')!;
const amountOfCitiesInput = document.querySelector<HTMLInputElement>('#amountOfCities')!;
const amountOfThreadsInput = document.querySelector<HTMLInputElement>('#amountOfThreads')!;



clearBtn.addEventListener('click', () => {
    citiesText.value = '';
})


button.addEventListener('click', async () => {
    let amountOfCities = parseInt(amountOfCitiesInput.value);
    if (isNaN(amountOfCities)) {
        amountOfCities = 75;
    }

    let amountOfThreads = parseInt(amountOfThreadsInput.value);
    if (isNaN(amountOfThreads)) {
        amountOfThreads = 1;
    }

    const random = new Random();
    let cities: City[]
    if (citiesText.value) {
        cities = JSON.parse(citiesText.value);
    } else {
        cities = GenerateRandomCities(amountOfCities, random);
        citiesText.value = JSON.stringify(cities);
    }


    const distanceMatrix = DistanceMatrix.fromCities(cities);
    console.log(distanceMatrix);

    const initialSolution = generateInitialSolution(cities.length);
    const initialCost = Solver.calculateCost(initialSolution, distanceMatrix);
    console.log(initialSolution);


    let bestUpdate: TspUpdateInfo = {
        bestCost: initialCost,
        bestSolution: initialSolution,
        currentIteration: -1,
        temperature: -1,
        currentCost: initialCost,
        currentSolution: initialSolution
    };

    const throttledUpdate = throttle(() => {
        drawSolution(canvas, cities, bestUpdate.bestSolution);
        currentTempText.innerText = `Current temp: ${bestUpdate.temperature}`;
        currentCostText.innerText = `Current cost: ${bestUpdate.bestCost}`;
        iterationsText.innerText = `Iterations: ${bestUpdate.currentIteration}`;
    }, 500)



    button.disabled = true;

    let workerPromises = [];
    for (let i = 0; i < amountOfThreads; i++) {
        const tspWorker = new TspWorker(500000);
        tspWorker.addTspUpdateCallback((updateInfo) => {
            if (updateInfo.bestCost <= bestUpdate.bestCost) {
                bestUpdate = updateInfo;
                throttledUpdate();
            }
        })
        workerPromises.push(tspWorker.doTsp(distanceMatrix, initialSolution));
    }

    const solution = await Promise.all(workerPromises).then((solutions) => {
        return solutions.reduce((bestSolution, currentSolution) => {
            const originalCost = Solver.calculateCost(bestSolution, distanceMatrix);
            const currentCost = Solver.calculateCost(currentSolution, distanceMatrix);
            return currentCost < originalCost ? currentSolution : bestSolution;
        }, initialSolution);
    })


    console.log(distanceMatrix)
    currentCostText.innerText = `Current cost: ${Solver.calculateCost(solution, distanceMatrix)}`;

    drawSolution(canvas, cities, solution);
    button.disabled = false;

})
