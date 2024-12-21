import './style.css'
import TspWorker from "./tsp-worker/TspWorker.ts";
import GenerateRandomCities from "./tsp-worker/supporting/CityGenerator.ts";
import {DistanceMatrix} from "./tsp-worker/supporting/DistanceMatrix.ts";
import {drawSolution, generateInitialSolution} from "./tsp-worker/supporting/Helpers.ts";
import Random from "./tsp-worker/supporting/Random.ts";
import {City} from "./tsp-worker/supporting/types/TspTypes.ts";
import Solver from "./tsp-worker/tsp-internal/Solver.ts";

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <div class="card">
      <button id="counter" type="button">Load</button>
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

clearBtn.addEventListener('click', () => {
    citiesText.value = '';
})


button.addEventListener('click', async () => {
    const random = new Random();
    let cities: City[]
    if (citiesText.value) {
        cities = JSON.parse(citiesText.value);
    } else {
        cities = GenerateRandomCities(75, random);
        citiesText.value = JSON.stringify(cities);
    }



    const distanceMatrix = DistanceMatrix.fromCities(cities);
    console.log(distanceMatrix);

    const initialSolution = generateInitialSolution(cities.length);
    console.log(initialSolution);

    const tspWorker = new TspWorker(500000);

    button.disabled = true;

    tspWorker.addTspUpdateCallback((updateInfo) => {
        console.log("updateInfo: ", updateInfo);
        const currentBest = updateInfo.bestSolution;
        drawSolution(canvas, cities, currentBest);
        currentTempText.innerText = `Current temp: ${updateInfo.temperature}`;
        currentCostText.innerText = `Current cost: ${updateInfo.bestCost}`;
        iterationsText.innerText = `Iterations: ${updateInfo.currentIteration}`;
    })


    const solution = await tspWorker.doTsp(distanceMatrix, initialSolution);
    console.log(distanceMatrix)
    currentCostText.innerText = `Current cost: ${Solver.calculateCost(solution, distanceMatrix)}`;

    drawSolution(canvas, cities, solution);
    button.disabled = false;

})
