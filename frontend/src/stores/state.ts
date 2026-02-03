import { createStore, type SetStoreFunction } from "solid-js/store";
import { CPU } from "../utils/ReactiveCPU";

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
    };
    memory: number[];

}

export interface State {
    isRunning: boolean;
    isDebugging: boolean;
    error: string;
    speed: SPEED;
    settings: Settings;
    quick: boolean;
    memoryHighlight: number;
    breakpoints: number[];
    lineHighlight: number;
    code: string;
    recordingKeys: boolean;
    cpuState: CPUState;
    labels: [string, number][];
    mapping: {[key: number]: number};
    examples: { name: string; code: string }[];
}

// --- Store Creation ---
export function createStateStore() {
    return createStore<State>({
        isRunning: false,
        isDebugging: false,
        error: '',
        speed: 4,
        quick: false,
        breakpoints: [],
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
        lineHighlight: -1,
        code: "",
        recordingKeys: false,
        cpuState: {
            memory: CPU.memory.data,
            pc: 0,
            sp: CPU.sp,
            dp: CPU.dp,
            a: 0,
            b: 0,
            c: 0,
            d: 0,
            flags: {
                z: false,
                c: false,
                f: false,
            }
        },
        labels: [],
        mapping: {},
        examples: []
    });
}

export async function loadExamples(set: SetStoreFunction<State>) {
    const exampleList = [
        { name: 'Hello World', file: 'hello-world.asm' },
        { name: 'Draw on screen', file: 'draw-in-screen.asm' },
        { name: 'Snake', file: 'snake.asm' }
    ];

    const loadedExamples = await Promise.all(
        exampleList.map(async (example) => {
            try {
                const response = await fetch('/examples/' + example.file);
                const code = await response.text();
                return { ...example, code };
            } catch (error) {
                console.error('Error loading example:', error);
                return { ...example, code: '' };
            }
        })
    );

    set("examples", loadedExamples);
}

export function loadExampleByName(name: string, set: SetStoreFunction<State>, state: State) {
    const example = state.examples?.find(e => e.name === name);
    if (!example) {
        console.error('Example not found:', name);
        return;
    }
    set("code", example.code || "");
}
