import {MoveGenerator} from "./MoveGenerator.ts";
import {DistanceMatrix} from "../../supporting/DistanceMatrix.ts";
import {TspSolution} from "../../supporting/types/TspTypes.ts";
import Random from "../../supporting/Random.ts";
import {Move} from "../Moves/Move.ts";
import SwapMove from "../Moves/SwapMove.ts";

export default class SwapMoveGenerator implements MoveGenerator {
    private random: Random;
    private distanceMatrix: DistanceMatrix;

    constructor(random: Random, distanceMatrix: DistanceMatrix) {
        this.random = random;
        this.distanceMatrix = distanceMatrix;
    }

    public generateMove(path: TspSolution): Move {
        const firstIndex = this.getRandomIndexFromPath(path);
        const secondIndex = this.getRandomIndexFromPathExcluding(path, firstIndex);
        const delta = this.calculate2SwapDelta(firstIndex, secondIndex, path);
        return new SwapMove(firstIndex, secondIndex, delta, path);
    }


    calculate2SwapDelta(firstIndex: number, secondIndex: number, path: TspSolution) {
        const indexDelta = Math.abs(firstIndex - secondIndex);
        if (indexDelta > 1) {
            const firstBefore = path[firstIndex - 1];
            const first = path[firstIndex];
            const firstAfter = path[firstIndex + 1];

            const secondBefore = path[secondIndex - 1];
            const second = path[secondIndex];
            const secondAfter = path[secondIndex + 1];

            let delta = 0;
            delta -= this.distanceMatrix.getDistance(firstBefore, first);
            delta -= this.distanceMatrix.getDistance(first, firstAfter);
            delta -= this.distanceMatrix.getDistance(secondBefore, second);
            delta -= this.distanceMatrix.getDistance(second, secondAfter);

            delta += this.distanceMatrix.getDistance(firstBefore, second);
            delta += this.distanceMatrix.getDistance(second, firstAfter);
            delta += this.distanceMatrix.getDistance(secondBefore, first);
            delta += this.distanceMatrix.getDistance(first, secondAfter);

            return delta;
        } else if (indexDelta === 1) {
            const smallestIndex = Math.min(firstIndex, secondIndex);
            const largestIndex = Math.max(firstIndex, secondIndex);

            const beforeSmallest = path[smallestIndex - 1];
            const smallest = path[smallestIndex];
            const largest = path[largestIndex];
            const afterLargest = path[largestIndex + 1];

            let delta = 0;
            delta -= this.distanceMatrix.getDistance(beforeSmallest, smallest);
            delta -= this.distanceMatrix.getDistance(largest, afterLargest);

            delta += this.distanceMatrix.getDistance(beforeSmallest, largest);
            delta += this.distanceMatrix.getDistance(smallest, afterLargest);
            return delta;
        }

        throw new Error("Invalid index delta");
    }

    private getRandomIndexFromPath(path: TspSolution): number {
        return this.random.nextInt(0, path.length - 2) + 1;
    }

    private getRandomIndexFromPathExcluding(path: TspSolution, excluding: number): number {
        let index = this.getRandomIndexFromPath(path);
        while (index === excluding) {
            index = this.getRandomIndexFromPath(path);
        }
        return index;
    }



}