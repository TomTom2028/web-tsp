import {Move} from "../Moves/Move.ts";
import {TspSolution} from "../../supporting/types/TspTypes.ts";

export interface MoveGenerator {
    generateMove(path: TspSolution): Move;
}