import { Index, Show } from "solid-js";
import { getStateContext } from "../utils/stateContext";
import { DEVICES } from "cpu-core/src/devices";
import type { CPUState, Settings } from "../stores/state";
import { CPU } from "../utils/ReactiveCPU";
import "../styles/Memory.css";

export default function Memory() {
    let [state, _] = getStateContext();

    const getRegisterOrFlagClass = (index: number): string => {
        const { settings, cpuState } = state;

        const registerMap: { settingKey: keyof Settings; stateKey: keyof CPUState; className: string }[] = [
            { settingKey: "displayA", stateKey: "a", className: "marker-a" },
            { settingKey: "displayB", stateKey: "b", className: "marker-b" },
            { settingKey: "displayC", stateKey: "c", className: "marker-c" },
            { settingKey: "displayD", stateKey: "d", className: "marker-d" },
            { settingKey: "displayPC", stateKey: "pc", className: "marker-pc" },
            { settingKey: "displaySP", stateKey: "sp", className: "marker-sp" },
            { settingKey: "displayDP", stateKey: "dp", className: "marker-dp" },
        ];

        const match = registerMap.find(
            ({ settingKey, stateKey }) => settings[settingKey] && cpuState[stateKey] === index
        );

        if (index > state.cpuState.sp && index <= CPU.maxSP) { return "stack-bg" }

        return match ? match.className : "";
    };
    const getBGClass = (index: number) => {
        if (state.memoryHighlight == index) {
            return "highlighted"
        }
        const rdclass = getRegisterOrFlagClass(index);
        if (rdclass) return rdclass;
        for (const device of DEVICES) {
            if (index >= device.start() && index < device.end()) {
                return device.name + "-bg";
            }
        }
        return "";
    }

    const getInstructionClass = (index: number) => {
        if (state.mapping[index]) return "instruction";
        return "";
    }

    const getLetter = (index: number) => {
        const val = state.cpuState.memory[index];
        if (val <= 32 || val >= 126) return " ";
        return String.fromCharCode(val)
    }


    return (
        <>
            <div class="memory-container">
                <h4>Memory (RAM)</h4>
                <div class="ram">
                    <div class="corner-label"></div>
                    <Index each={Array.from({ length: 16 })}>
                        {(_, i) => (
                            <div class="column-label">
                                {state.settings.displayHex
                                    ? `0x${i.toString(16).toUpperCase()}`
                                    : i.toString().padStart(2, '0')}
                            </div>
                        )}
                    </Index>
                    <Index each={state.cpuState.memory}>
                        {(item, index) => (
                            <>
                                <Show when={index % 16 === 0}>
                                    <div class="row-label">
                                        {state.settings.displayHex
                                            ? `0x${index.toString(16).toUpperCase().padStart(2, '0')}`
                                            : index.toString().padStart(3, '0')}
                                    </div>
                                </Show>
                                <div class="memory-block" id={"" + index}>
                                    <div class={`marker ${getBGClass(index)}`}>
                                        <small class={`${getInstructionClass(index)}`}>
                                            {state.settings.ramDisplayMode == "Number" ?
                                                (state.settings.displayHex
                                                    ? item().toString(16).padStart(2, '0').toUpperCase()
                                                    : item())
                                                : getLetter(index)
                                            }
                                        </small>
                                    </div>
                                </div>
                            </>
                        )}
                    </Index>
                </div>
            </div>
        </>
    );
}
