import {Message, StartTspMessage} from "../supporting/types/TspWorkerTypes.ts";
import {TspUpdateInfo} from "../supporting/types/TspTypes.ts";
import Solver from "./Solver.ts";
import Random from "../supporting/Random.ts";
import {DistanceMatrix} from "../supporting/DistanceMatrix.ts";

onmessage = function(e: MessageEvent<Message>) {
    const message = e.data;
    switch (message.kind) {
        case 'START_TSP':
            const startMessage = message as StartTspMessage;
            const startInfo = startMessage.startInfo;
            const random = new Random(startInfo.randomSeed);
            const matrix = DistanceMatrix.DistanceMatrixFromFloat32Array((startInfo.initialSolution.length - 1), startMessage.startInfo.matrix);
            const tsp = new Solver(matrix, startInfo.initialSolution, random, startInfo.iterationsBeforeUpdate);
            tsp.addUpdateCallback((updateInfo: TspUpdateInfo) => {
                postMessage({
                    kind: 'STATUS_UPDATE',
                    updateInfo
                });
            });
            const solution = tsp.solve();
            postMessage({
                kind: 'FINISHED',
                solution,
                matrix: matrix.getArray()
            });
            break;

        default:
            throw new Error('Unknown message kind');
    }
}