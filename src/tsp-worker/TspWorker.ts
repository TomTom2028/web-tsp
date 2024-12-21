import {
    FinishedTspMessage,
    Message,
    StatusUpdateMessage
} from "./supporting/types/TspWorkerTypes.ts";

import workerUrl from "./tsp-internal/TspInternalWorker.ts?worker&url";
import {StartTspArguments, TspSolution, TspUpdateCallback} from "./supporting/types/TspTypes.ts";
import {DistanceMatrix} from "./supporting/DistanceMatrix.ts";

export default class TspWorker {
    private iterationsBeforeUpdate;

    private worker: Worker;

    private tspUpdateCallbacks: Array<TspUpdateCallback>;

    private busy: boolean;
    constructor(iteratonsBeforeUpdate: number) {
        this.worker = new Worker(workerUrl, {type: 'module'});
        this.worker.addEventListener('message', this.handleMessages.bind(this));
        this.tspUpdateCallbacks = [];
        this.busy = false;
        this.iterationsBeforeUpdate = iteratonsBeforeUpdate;
    }

    public doTsp(distanceMatrix: DistanceMatrix, initialSolution: TspSolution): Promise<TspSolution> {
        if (this.busy) {
            throw new Error('Worker is busy');
        }
        this.busy = true;
        const thisthis = this;
        return new Promise<TspSolution>((resolve, _) => {
            const handler = (e: MessageEvent<Message>) => {
                const message = e.data;
                switch (message.kind) {
                    case 'FINISHED':
                        this.worker.removeEventListener('message', handler);
                        const finishedMessage = message as FinishedTspMessage;
                        this.busy = false;
                        resolve(finishedMessage.solution);
                        break;
                }
            }
            this.worker.addEventListener('message', handler);
            const distanceMatrixBuffer = distanceMatrix.getArray();
            const postMessageData: StartTspArguments = {
                matrix: distanceMatrixBuffer,
                initialSolution: initialSolution,
                iterationsBeforeUpdate: thisthis.iterationsBeforeUpdate,
                randomSeed: Math.random()
            }
            this.worker.postMessage({
                kind: 'START_TSP',
                startInfo: postMessageData
            });
        });
    }


    public addTspUpdateCallback(callback: TspUpdateCallback) {
        this.tspUpdateCallbacks.push(callback);
    }

    public removeTspUpdateCallback(callback: TspUpdateCallback) {
        const index = this.tspUpdateCallbacks.indexOf(callback);
        if (index !== -1) {
            this.tspUpdateCallbacks.splice(index, 1);
        }
    }



    private handleMessages(e: MessageEvent<Message>) {
        const message = e.data;
        switch (message.kind) {
            case 'STATUS_UPDATE':
                const statusUpdateMessage = message as StatusUpdateMessage;
                this.tspUpdateCallbacks.forEach(callback => callback(statusUpdateMessage.updateInfo));
                break;
            default:
        }
    }
}