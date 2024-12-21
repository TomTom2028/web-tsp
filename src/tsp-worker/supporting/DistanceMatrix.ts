import {City} from "./types/TspTypes.ts";

export class DistanceMatrix {
    private readonly n: number;

    private readonly matrix: Float32Array;

    constructor(n: number, matrix?: Float32Array) {
        this.n = n;
        if (matrix) {
            this.matrix = matrix;
        } else {
            const sharedBuffer = new SharedArrayBuffer(n * n * Float32Array.BYTES_PER_ELEMENT);
            this.matrix = new Float32Array(sharedBuffer);
        }
    }

    public setDistance(i: number, j: number, distance: number) {
        this.matrix[i * this.n + j] = distance;
    }

    public getDistance(i: number, j: number): number {
        return this.matrix[i * this.n + j];
    }

    public static fromCities(cities: City[]): DistanceMatrix {
        const n = cities.length;
        const matrix = new DistanceMatrix(n);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const city1 = cities[i];
                const city2 = cities[j];
                const dx = city1.x - city2.x;
                const dy = city1.y - city2.y;
                const distance = Math.sqrt(dx * dx + dy * dy); // Euclidean distance
                matrix.setDistance(i, j, distance);
            }
        }
        return matrix;
    }
    public getArray(): Float32Array {
        return this.matrix;
    }

    public static DistanceMatrixFromFloat32Array(n: number, array: Float32Array): DistanceMatrix {
        return new DistanceMatrix(n, array);
    }

    public setBuffer(buffer: Float32Array) {
        this.matrix.set(buffer);
    }


}
