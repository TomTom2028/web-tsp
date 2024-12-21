import {City, TspSolution} from "./types/TspTypes.ts";

export function generateInitialSolution(n: number): TspSolution {
    const solution: TspSolution = [];
    const unvisited = new Set<number>();
    for (let i = 0; i < n; i++) {
        unvisited.add(i);
    }

    while (unvisited.size > 0) {
        const randomIndex = Math.floor(Math.random() * unvisited.size);
        const city = Array.from(unvisited)[randomIndex]; // Convert the set to an array to access elements by index
        solution.push(city);
        unvisited.delete(city);
    }

    // Add the first city to the end to make it a cycle
    solution.push(solution[0]);
    return solution;
}

export function drawSolution(canvas: HTMLCanvasElement, cities: City[], solution: TspSolution) {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    for(const city of cities) {
        ctx.beginPath();
        ctx.arc(city.x, city.y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for(let i = 0; i < solution.length - 1; i++) {
        const city = cities[solution[i]];
        ctx.lineTo(city.x, city.y);
    }
    ctx.closePath();
    ctx.stroke();
}