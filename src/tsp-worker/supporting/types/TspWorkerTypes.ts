import {City, StartTspArguments, TspSolution, TspUpdateInfo} from "./TspTypes.ts";


export interface Message {
    kind: string;
}

export interface StartTspMessage extends Message {
    kind: 'START_TSP';
    startInfo: StartTspArguments;
}

export interface StatusUpdateMessage extends Message {
    kind: 'STATUS_UPDATE';
    updateInfo: TspUpdateInfo;
}

export interface FinishedTspMessage extends Message {
    kind: 'FINISHED';
    solution: TspSolution;
}


export interface GenerateRandomCitiesMessage extends Message {
    kind: 'GENERATE_RANDOM_CITIES';
    n: number;
}

export interface CityResponseMessage extends Message {
    kind: 'CITY_RESPONSE';
    cities: City[];
}