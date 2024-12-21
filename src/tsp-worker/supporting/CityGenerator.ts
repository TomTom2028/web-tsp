import {City} from "./types/TspTypes.ts";
import Random from "./Random.ts";

export default function GenerateRandomCities(n: number,random: Random): City[] {
    const cities: City[] = [];
    for (let i = 0; i < n; i++) {
        cities.push({
            x: random.nextInt(0, 1000),
            y: random.nextInt(0, 600),
            id: i,
        });
    }
    return cities;
}


