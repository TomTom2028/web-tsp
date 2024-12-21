import seedrandom from "seedrandom";

export default class Random {
    private readonly rng: () => number;
    constructor(seed?: number) {
        if (seed === undefined) {
            seed = Math.random();
        }
        this.rng = seedrandom(seed.toString());
    }

    public next(): number {
        return this.rng();
    }

    public nextInt(min: number, max: number): number {
        return Math.floor(this.rng() * (max - min + 1)) + min;
    }
}