export type City = {
    x: number;
    y: number;

    id: number;
}

export type TspSolution = Array<number>;


export type TspUpdateInfo = {
    currentIteration: number;
    temperature: number;
    currentSolution: TspSolution;
    currentCost: number;

    bestSolution: TspSolution;
    bestCost: number;
}

export type StartTspArguments = {
    matrix: Float32Array;
    initialSolution: TspSolution;
    iterationsBeforeUpdate: number;
    randomSeed: number;
}

export type TspUpdateCallback = (info: TspUpdateInfo) => any;