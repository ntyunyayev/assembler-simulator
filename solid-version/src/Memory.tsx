
import { Index } from "solid-js";
import { getStateContext } from "./stateContext";

export default function Memory() {
    let [state, setState] = getStateContext();
    return (
        <>
            <h4>Memory (RAM)</h4>

            <div class="ram">
                <Index each={state.cpuState.memory}>
                    {(item, index) =>
                        <div class="memory-block">
                            <div class="marker">
                                <small>{item().toString(16).padStart(2, '0')}</small>
                            </div>
                        </div>
                    }
                </Index>



            </div>
        </>
    )
};