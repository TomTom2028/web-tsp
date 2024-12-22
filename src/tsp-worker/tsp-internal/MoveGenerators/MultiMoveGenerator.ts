import {MoveGenerator} from "./MoveGenerator.ts";
import Random from "../../supporting/Random.ts";
import {DistanceMatrix} from "../../supporting/DistanceMatrix.ts";
import {TspSolution} from "../../supporting/types/TspTypes.ts";
import {Move} from "../Moves/Move.ts";
import SwapMoveGenerator from "./SwapMoveGenerator.ts";
import InsertMoveGenerator from "./InsertMoveGenerator.ts";
import ReverseMoveGenerator from "./ReverseMoveGenerator.ts";

export default class MultiMoveGenerator implements MoveGenerator {
    private insertMoveGenerator: MoveGenerator;
    private swapMoveGenerator: MoveGenerator;
    private reverseMoveGenerator: MoveGenerator;
    private random: Random;

    constructor( random: Random, distanceMatrix: DistanceMatrix) {
        this.random = random;
        this.insertMoveGenerator = new InsertMoveGenerator(random, distanceMatrix);
        this.swapMoveGenerator = new SwapMoveGenerator(random, distanceMatrix);
        this.reverseMoveGenerator = new ReverseMoveGenerator(random, distanceMatrix);
    }

    generateMove(path: TspSolution): Move {
        const randomValue = this.random.next();
        if (randomValue < 0.9) {
            return this.reverseMoveGenerator.generateMove(path);
        } else if (randomValue < 0.98) {
            return this.insertMoveGenerator.generateMove(path);
        } else {
            return this.swapMoveGenerator.generateMove(path);
        }
    }
}