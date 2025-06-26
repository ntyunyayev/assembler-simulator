
import { Index } from "solid-js";
import { getStateContext } from "./stateContext";
import { DEVICES } from "./core/devices";

export default function Memory() {
    let [state, setState] = getStateContext();

    const getClass = (index: number) => {
        for (const device of DEVICES) {
            if (index >= device.start() && index < device.end()) {
                return device.name;
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
                            <div class={`marker ${getClass(index)}-bg`}>
                                <small>{item().toString(16).padStart(2, '0')}</small>
                            </div>
                        </div>
                    }
                </Index>



            </div>
        </>
    )
};