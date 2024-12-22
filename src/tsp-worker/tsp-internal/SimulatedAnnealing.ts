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
        const accept = this.random.next() < chance;
        if (accept) {
            this.temperature *= this.coolingRate;
        } else if (this.random.next() < 0.2) {
            this.temperature *= this.coolingRate;
        }
        return accept;
    }

    public getTemperature(): number {
        return this.temperature;
    }
}