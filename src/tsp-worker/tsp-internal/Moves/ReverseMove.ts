import {Move} from "./Move.ts";
import {TspSolution} from "../../supporting/types/TspTypes.ts";

export default class ReverseMove implements Move {
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
        const length = this.toIndex - this.fromIndex + 1;
        for (let i = 0; i < length / 2; i++) {
            const temp = this.path[this.fromIndex + i];
            this.path[this.fromIndex + i] = this.path[this.toIndex - i];
            this.path[this.toIndex - i] = temp;
        }
    }
}