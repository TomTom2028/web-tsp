export interface Move {
    getDelta: () => number;
    apply: () => void;
}