import { createStore, type SetStoreFunction } from "solid-js/store";

interface SpeedOption {
    speed: number;
    desc: string;
}

export interface CpuState {
    memory: any;
    cpu: any;
    inputbuffer: any;
    screen: any;
    isRunning: boolean;
    error: string;
    speed: number;
    displayHex: boolean;
    displayInstr: boolean;
    ramDisplayMode: "HEX" | "DEC" | "ASCII";
    displayA: boolean;
    displayB: boolean;
    displayC: boolean;
    displayD: boolean;
    outputStartIndex: number;
    outputEndIndex: number;
    displayStartIndex: number;
    readonly outputLimit: number;
    screenPixels: any[];
    memoryHighlight: number;
    code: string;
    recordingKeys: boolean;
    readonly inputBufferStartIndex: number;
    readonly inputBufferEndIndex: number;
}

export const SPEEDS: SpeedOption[] = [
    { speed: 1, desc: "1 HZ" },
    { speed: 4, desc: "4 HZ" },
    { speed: 8, desc: "8 HZ" },
    { speed: 16, desc: "16 HZ" },
    { speed: 1024, desc: "1024 HZ" },
    { speed: 2048, desc: "2048 HZ" }
];

// --- Store Creation ---
export function createStateStore() {
    return createStore<CpuState>({
        memory: null,
        cpu: null,
        inputbuffer: null,
        screen: null,
        isRunning: false,
        error: '',
        speed: 4,
        displayHex: true,
        displayInstr: true,
        ramDisplayMode: "HEX",
        displayA: true,
        displayB: true,
        displayC: true,
        displayD: true,
        outputStartIndex: 100,
        outputEndIndex: 150,
        displayStartIndex: 927,
        get outputLimit() {
            return this.outputEndIndex - this.outputStartIndex + 1;
        },
        screenPixels: [],
        memoryHighlight: -1,
        code: "",
        recordingKeys: false,
        get inputBufferStartIndex() {
            return this.displayStartIndex + (this.screen?.size || 0);
        },
        get inputBufferEndIndex() {
            return this.inputBufferStartIndex + (this.inputbuffer?.size || 0);
        }
    });
}
