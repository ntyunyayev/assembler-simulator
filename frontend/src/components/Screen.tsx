
import { createEffect, createSignal, Index, onCleanup, Show } from "solid-js";
import { getStateContext } from "../utils/stateContext";
import "../styles/Screen.css";
import { DEVICES } from "cpu-core/src/devices";
import { CPU } from "../utils/ReactiveCPU";

export default function Screen() {
    let [recording, setRecording] = createSignal(false);
    let [state, _] = getStateContext();
    let isTextMode = () => {return state.cpuState.memory[DEVICES["screen-mode"].start()+1] > 0}
    const getBright = (index: number) => {
        const high = state.cpuState.memory[index];
        const low = state.cpuState.memory[index + 1];
        const value = (high << 8) | low;  // 16-bit value
    
        // Extract 6 bits red (bits 15-10), 6 bits green (bits 9-4), 4 bits blue (bits 3-0)
        const r6 = (value >> 10) & 0x3F;  // 6 bits
        const g6 = (value >> 4) & 0x3F;   // 6 bits
        const b4 = value & 0xF;           // 4 bits
    
        // Convert 6-bit and 4-bit values to 8-bit scale (0-255)
        const r = Math.round((r6 / 63) * 255);
        const g = Math.round((g6 / 63) * 255);
        const b = Math.round((b4 / 15) * 255);
    
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
                    {(item, index) => (
                        
                        <Show when={index >= DEVICES.screen.start() && index < DEVICES.screen.end() && (index - DEVICES.screen.start()) % 2 === 0}>
                            <div class="screen-pixel" style={{"background-color": !isTextMode() ? getBright(index): "black"}}>
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
