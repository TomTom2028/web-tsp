import {MoveGenerator} from "./MoveGenerator.ts";
import {TspSolution} from "../../supporting/types/TspTypes.ts";
import Random from "../../supporting/Random.ts";
import {DistanceMatrix} from "../../supporting/DistanceMatrix.ts";
import {Move} from "../Moves/Move.ts";
import ReverseMove from "../Moves/ReverseMove.ts";

export default class ReverseMoveGenerator implements MoveGenerator {
    private distanceMatrix: DistanceMatrix;
    private random: Random;

    constructor( random: Random, distanceMatrix: DistanceMatrix) {
        this.random = random;
        this.distanceMatrix = distanceMatrix;
    }

    public generateMove(path: TspSolution): Move {
        const fromIndex = this.getRandomIndexFromPath(path);
        const toIndex = this.getRandomIndexFromPathExcluding(path, fromIndex);

        const smallestIndex = Math.min(fromIndex, toIndex);
        const largestIndex = Math.max(fromIndex, toIndex);


        const delta = this.getDelta(smallestIndex, largestIndex, path);
        return new ReverseMove(smallestIndex, largestIndex, delta, path);
    }

    private getDelta(fromIndex: number, toIndex: number, path: TspSolution) {
        const beforeFrom = path[fromIndex - 1];
        const from = path[fromIndex];
        const afterTo = path[toIndex + 1];
        const to = path[toIndex];

        let delta = 0;


        delta -= this.distanceMatrix.getDistance(beforeFrom, from);
        delta -= this.distanceMatrix.getDistance(to, afterTo);

        delta += this.distanceMatrix.getDistance(beforeFrom, to);
        delta += this.distanceMatrix.getDistance(from, afterTo);
        return delta;
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