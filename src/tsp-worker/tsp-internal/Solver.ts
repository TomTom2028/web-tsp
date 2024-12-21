import {DistanceMatrix} from "../supporting/DistanceMatrix.ts";
import {TspSolution, TspUpdateCallback, TspUpdateInfo} from "../supporting/types/TspTypes.ts";
import Random from "../supporting/Random.ts";
import SimulatedAnnealing from "./SimulatedAnnealing.ts";
import {MoveGenerator} from "./MoveGenerators/MoveGenerator.ts";
import MultiMoveGenerator from "./MoveGenerators/MultiMoveGenerator.ts";
export default class Solver {
    private distanceMatrix: DistanceMatrix;

    private currentSolution: TspSolution;
    private currentCost: number;

    private bestSolution: TspSolution;
    private bestCost: number;

    private annealing: SimulatedAnnealing;
    private moveGenerator: MoveGenerator;

    private iterationsBeforeLog: number;

    private solverCallbacks: Array<TspUpdateCallback>;


    constructor(distanceMatrix: DistanceMatrix, initialSolution: TspSolution, random: Random, iterationsBeforeLog: number) {
        this.distanceMatrix = distanceMatrix;
        this.currentSolution = initialSolution;
        this.currentCost = Solver.calculateCost(initialSolution, this.distanceMatrix);
        this.bestSolution = [...initialSolution];
        this.bestCost = this.currentCost;


        const delta = (1 - 0.00002 / (initialSolution.length - 1));
        const temp = 12 * (initialSolution.length - 1);
        console.log("initital temp: ", temp);
        this.annealing = new SimulatedAnnealing(temp, delta, random);
        this.moveGenerator = new MultiMoveGenerator(random, distanceMatrix);
        this.iterationsBeforeLog = iterationsBeforeLog;

        this.solverCallbacks = [];
    }


    public addUpdateCallback(callback: TspUpdateCallback) {
        this.solverCallbacks.push(callback);
    }

    public removeUpdateCallback(callback: TspUpdateCallback) {
        const index = this.solverCallbacks.indexOf(callback);
        if (index !== -1) {
            this.solverCallbacks.splice(index, 1);
        }
    }


    public solve() {
        let timesRefused = 0;
        let index = 0;
        while (timesRefused < 100000 || this.annealing.getTemperature() > 0.5) {
            const move = this.moveGenerator.generateMove(this.currentSolution);
            index++;

            if (index % this.iterationsBeforeLog === 0) {
                const toReturnObj: TspUpdateInfo = {
                    currentIteration: index,
                    temperature: this.annealing.getTemperature(),
                    currentSolution: this.currentSolution,
                    currentCost: this.currentCost,

                    bestSolution: this.bestSolution,
                    bestCost: this.bestCost
                }

                this.solverCallbacks.forEach(callback => callback(toReturnObj));
            }

            if(!this.annealing.acceptDelta(move.getDelta())) {
                timesRefused++;
                continue;
            }

            move.apply();
            this.currentCost += move.getDelta();

            timesRefused /= 1.005;

            if (this.currentCost < this.bestCost) {
                this.bestCost = this.currentCost;
                this.bestSolution = [...this.currentSolution];
                timesRefused = 0;
            }
        }

        return this.bestSolution;
    }


    public static calculateCost(path: TspSolution, matrix: DistanceMatrix): number {
        let cost = 0;
        for (let i = 0; i < path.length - 1; i++) {
            cost += matrix.getDistance(path[i], path[i + 1]);
        }
        return cost;
    }
}