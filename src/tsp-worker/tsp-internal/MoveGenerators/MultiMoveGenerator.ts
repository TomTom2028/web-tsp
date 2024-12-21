import {MoveGenerator} from "./MoveGenerator.ts";
import Random from "../../supporting/Random.ts";
import {DistanceMatrix} from "../../supporting/DistanceMatrix.ts";
import {TspSolution} from "../../supporting/types/TspTypes.ts";
import {Move} from "../Moves/Move.ts";
import SwapMoveGenerator from "./SwapMoveGenerator.ts";
import InsertMoveGenerator from "./InsertMoveGenerator.ts";

export default class MultiMoveGenerator implements MoveGenerator {
    private insertMoveGenerator: MoveGenerator;
    private swapMoveGenerator: MoveGenerator;
    private random: Random;

    constructor( random: Random, distanceMatrix: DistanceMatrix) {
        this.random = random;
        this.insertMoveGenerator = new InsertMoveGenerator(random, distanceMatrix);
        this.swapMoveGenerator = new SwapMoveGenerator(random, distanceMatrix);
    }

    generateMove(path: TspSolution): Move {
        const randomValue = this.random.next();
        if (randomValue < 0.75) {
            return this.insertMoveGenerator.generateMove(path);
        } else {
            return this.swapMoveGenerator.generateMove(path);
        }
    }
}