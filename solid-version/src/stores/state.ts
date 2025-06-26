import { createStore, type SetStoreFunction } from "solid-js/store";
import { CPU } from "../core/cpu";

type SPEED = 1 | 4 | 8 | 16 | 1024


export interface Settings {
    displayHex: boolean;
    displayInstr: boolean;
    ramDisplayMode: "Number" | "ASCII";
    displayA: boolean;
    displayB: boolean;
    displayC: boolean;
    displayD: boolean;
    displayPC: boolean;
    displaySP: boolean;
    displayDP: boolean;
}

export interface CPUState {
    pc: number;
    sp: number;
    dp: number;
    a: number;
    b: number;
    c: number;
    d: number;
    flags: {
        z: boolean; 
        c: boolean; 
        f: boolean; 
        sm: boolean; 
    };
    memory: number[];

}

export interface State {
    isRunning: boolean;
    error: string;
    speed: SPEED;
    settings: Settings;
    memoryHighlight: number;
    code: string;
    recordingKeys: boolean;
    cpuState: CPUState; // Optional, will be set when CPU is initialized
    labels?: Record<string, number>; 
}

// --- Store Creation ---
export function createStateStore() {
    return createStore<State>({
        isRunning: false,
        error: '',
        speed: 4,
        settings: {
            displayHex: true,
            displayInstr: true,
            ramDisplayMode: "Number",
            displayA: true,
            displayB: true,
            displayC: true,
            displayD: true,
            displayPC: true,
            displaySP: true,
            displayDP: true,
        },
        memoryHighlight: -1,
        code: "",
        recordingKeys: false,
        cpuState: {
            memory: CPU.memory.data,
            pc: 0,
            sp: 924,
            dp: 926,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            flags: {
                z: false,
                c: false,
                f: false,
                sm: false
            }
        },
    });
}
