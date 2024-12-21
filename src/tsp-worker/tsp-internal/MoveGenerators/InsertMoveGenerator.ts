import {MoveGenerator} from "./MoveGenerator.ts";
import Random from "../../supporting/Random.ts";
import {DistanceMatrix} from "../../supporting/DistanceMatrix.ts";
import {TspSolution} from "../../supporting/types/TspTypes.ts";
import SwapMoveGenerator from "./SwapMoveGenerator.ts";
import {Move} from "../Moves/Move.ts";
import InsertMove from "../Moves/InsertMove.ts";

export default class InsertMoveGenerator implements MoveGenerator {

    private random: Random;
    private distanceMatrix: DistanceMatrix
    private internalSwapper: SwapMoveGenerator;
    constructor(random: Random, distanceMatrix: DistanceMatrix) {
        this.random = random;
        this.distanceMatrix = distanceMatrix;
        this.internalSwapper = new SwapMoveGenerator(random, distanceMatrix);
    }

    public generateMove(path: TspSolution): Move {
        const fromIndex = this.getRandomIndexFromPath(path);
        const toIndex = this.getRandomIndexFromPathExcluding(path, fromIndex);
        const delta = this.getDelta(fromIndex, toIndex, path);
        return new InsertMove(fromIndex, toIndex, delta, path);
    }


    private getDelta(fromIndex: number, toIndex: number, path: TspSolution) {
        const indexDelta = Math.abs(fromIndex - toIndex);
        if (indexDelta === 1) {
            // Handle as a swap using TwoOptMoveGenerator
            return this.internalSwapper.calculate2SwapDelta(fromIndex, toIndex, path);
        }

        if (fromIndex < toIndex) {
            if (indexDelta > 1) {
                const beforeFrom = path[fromIndex - 1];
                const from = path[fromIndex];
                const afterFrom = path[fromIndex + 1];
                const to = path[toIndex];
                const afterTo = path[toIndex + 1];

                let delta = 0;
                delta -= this.distanceMatrix.getDistance(beforeFrom, from);
                delta -= this.distanceMatrix.getDistance(from, afterFrom);
                delta -= this.distanceMatrix.getDistance(to, afterTo);

                delta += this.distanceMatrix.getDistance(beforeFrom, afterFrom);
                delta += this.distanceMatrix.getDistance(to, from);
                delta += this.distanceMatrix.getDistance(from, afterTo);

                return delta;
            }
        } else if (fromIndex > toIndex) {
            if (indexDelta > 1) {
                const beforeFrom = path[fromIndex - 1];
                const from = path[fromIndex];
                const afterFrom = path[fromIndex + 1];
                const beforeTo = path[toIndex - 1];
                const to = path[toIndex];

                let delta = 0;
                delta -= this.distanceMatrix.getDistance(beforeFrom, from);
                delta -= this.distanceMatrix.getDistance(from, afterFrom);
                delta -= this.distanceMatrix.getDistance(beforeTo, to);

                delta += this.distanceMatrix.getDistance(beforeFrom, afterFrom);
                delta += this.distanceMatrix.getDistance(beforeTo, from);
                delta += this.distanceMatrix.getDistance(from, to);

                return delta;
            }
        }

        throw new Error("Invalid index delta");
    }

    private getRandomIndexFromPath(path: TspSolution): number {
        return this.random.nextInt(0, path.length - 1);
    }

    private getRandomIndexFromPathExcluding(path: TspSolution, excluding: number): number {
        let index = this.getRandomIndexFromPath(path);
        while (index === excluding) {
            index = this.getRandomIndexFromPath(path);
        }
        return index;
    }
}