import { createStore, type SetStoreFunction } from "solid-js/store";
import { CPU } from "../core/cpu";

type SPEED = 1 | 4 | 8 | 16 | 1024


export interface Settings {
    displayHex: boolean;
    displayInstr: boolean;
    ramDisplayMode: "HEX" | "DEC" | "ASCII";
    displayA: boolean;
    displayB: boolean;
    displayC: boolean;
    displayD: boolean;
}

export interface State {
    cpu: CPU;
    isRunning: boolean;
    error: string;
    speed: SPEED;
    settings: Settings;
    memoryHighlight: number;
    code: string;
    recordingKeys: boolean;
}



// --- Store Creation ---
export function createStateStore() {
    return createStore<State>({
        cpu: new CPU(),
        isRunning: false,
        error: '',
        speed: 4,
        settings: {
            displayHex: true,
            displayInstr: true,
            ramDisplayMode: "HEX",
            displayA: true,
            displayB: true,
            displayC: true,
            displayD: true,
        },
        memoryHighlight: -1,
        code: "",
        recordingKeys: false,
    });
}
