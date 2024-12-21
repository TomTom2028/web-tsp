import {Move} from "./Move.ts";

export default class SwapMove implements Move{
    private firstIndex: number;
    private secondIndex: number;
    private delta: number;
    private path: number[];
    constructor(firstIndex: number, secondIndex: number, delta: number, path: number[]) {
        this.firstIndex = firstIndex;
        this.secondIndex = secondIndex;
        this.delta = delta;
        this.path = path;
    }

    public getDelta(): number {
        return this.delta;
    }

    public apply(): void {
        const temp = this.path[this.firstIndex];
        this.path[this.firstIndex] = this.path[this.secondIndex];
        this.path[this.secondIndex] = temp;
    }
}