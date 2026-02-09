
import { createEffect, createSignal, Index, onCleanup, Show } from "solid-js";
import { getStateContext } from "../utils/stateContext";
import "../styles/Screen.css";
import { DEVICES } from "cpu-core/src/devices";
import { CPU } from "../utils/ReactiveCPU";

export default function Screen() {
    let [recording, setRecording] = createSignal(false);
    let [state, _] = getStateContext();
    let isTextMode = () => { return state.cpuState.memory[DEVICES["screen-mode"].start() + 1] > 0 }
    const getStandard565 = (index: number) => {
        const high = state.cpuState.memory[index];
        const low = state.cpuState.memory[index + 1];
        const value = (high << 8) | low;

        // 1. Extract raw bits using masks
        const r5 = (value >> 11) & 0x1F; // Top 5 bits
        const g6 = (value >> 5) & 0x3F;  // Middle 6 bits
        const b5 = value & 0x1F;         // Bottom 5 bits

        // 2. Scale to 8-bit (0-255) using bitwise replication
        // This is faster than multiplication and ensures 0x1F maps to 255
        const r = (r5 << 3) | (r5 >> 2);
        const g = (g6 << 2) | (g6 >> 4);
        const b = (b5 << 3) | (b5 >> 2);

        return `rgb(${r},${g},${b})`;
    }
    const getLetter = (index: number) => {
        const high = state.cpuState.memory[index];
        const low = state.cpuState.memory[index + 1];
        const value = (high << 8) | low;  // 16-bit value
        return String.fromCharCode(value)
    }

    createEffect(() => {
        if (recording()) {
            const handler = (e: KeyboardEvent) => {
                CPU.memory.store16(DEVICES.input.start(), e.keyCode)
            };
            window.addEventListener("keydown", handler);

            onCleanup(() => window.removeEventListener("keydown", handler));
        }
    });


    return (
        <>
            <h4>Screen Output (Mode: {isTextMode() ? "Texte" : "Graphique"})</h4>
            <div class="screen" onMouseEnter={() => setRecording(true)} onMouseLeave={() => setRecording(false)}>
                <Index each={state.cpuState.memory}>
                    {(_, index) => (

                        <Show when={index >= DEVICES.screen.start() && index < DEVICES.screen.end() && (index - DEVICES.screen.start()) % 2 === 0}>
                            <div class="screen-pixel" style={{ "background-color": !isTextMode() ? getStandard565(index) : "black" }}>
                                <Show when={isTextMode()}>
                                    {getLetter(index)}
                                </Show>
                            </div>
                            <Show when={(index / 2) % 32 == 0}>
                                <br />
                            </Show>

                        </Show>
                    )}
                </Index>
            </div>

        </>
    )
};
