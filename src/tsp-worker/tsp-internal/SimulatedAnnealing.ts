import Random from "../supporting/Random.ts";

export default class SimulatedAnnealing {
    private temperature: number;
    private coolingRate: number;

    private readonly random: Random;

    constructor(temperature: number, coolingRate: number, random: Random) {
        this.temperature = temperature;
        this.coolingRate = coolingRate;
        this.random = random;
    }

    public acceptDelta(delta: number): boolean {
        const chance = Math.exp(-delta / this.temperature);
        this.temperature *= this.coolingRate;
        return this.random.next() < chance;
    }

    public getTemperature(): number {
        return this.temperature;
    }
}