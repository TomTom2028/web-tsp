import {TspSolution} from "../../supporting/types/TspTypes.ts";
import {Move} from "./Move.ts";

export default class InsertMove implements Move{
    private fromIndex: number;
    private toIndex: number;
    private delta: number;
    private path: TspSolution;
    constructor(fromIndex: number, toIndex: number, delta: number, path: TspSolution) {
        this.fromIndex = fromIndex;
        this.toIndex = toIndex;
        this.delta = delta;
        this.path = path;
    }


    public getDelta(): number {
        return this.delta;
    }

    public apply(): void {
        const [from] = this.path.splice(this.fromIndex, 1); // Remove the element at fromIndex
        this.path.splice(this.toIndex, 0, from); // Insert the element at toIndex
    }
}