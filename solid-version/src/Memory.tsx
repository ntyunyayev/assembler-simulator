
import { Index } from "solid-js";
import { getStateContext } from "./stateContext";
import { DEVICES } from "./core/devices";
import type { CPUState, Settings } from "./stores/state";

export default function Memory() {
    let [state, setState] = getStateContext();

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
    
        return match ? match.className : "";
    };
    

    const getBGClass = (index: number) => {
        const rdclass = getRegisterOrFlagClass(index);
        if (rdclass) return rdclass;
        for (const device of DEVICES) {
            if (index >= device.start() && index < device.end()) {
                return device.name + "-bg";
            }
        }
        return "";
    }


    

    return (
        <>
            <h4>Memory (RAM)</h4>

            <div class="ram">
                <Index each={state.cpuState.memory}>
                    {(item, index) =>
                        <div class="memory-block">
                            <div class={`marker ${getBGClass(index)}`}>
                                <small>{item().toString(16).padStart(2, '0')}</small>
                            </div>
                        </div>
                    }
                </Index>



            </div>
        </>
    )
};