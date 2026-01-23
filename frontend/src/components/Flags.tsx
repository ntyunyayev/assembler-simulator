import { getStateContext } from "../utils/stateContext";
import "../styles/Flags.css";
import { DEVICES } from "cpu-core/src/devices";

export default function Flags() {
    let [state, setState] = getStateContext();

    type DisplayKey = keyof typeof state.settings;

    function changeColorDisplay(displayName: DisplayKey) {
        setState("settings", (prevSettings) => {
            return {
                ...prevSettings,
                [displayName]: !prevSettings[displayName]
            };
        });
    }

    // Helper to format the value based on settings
    const formatValue = (val: number) => {
        return state.settings.displayHex
            ? `0x${val.toString(16).toUpperCase()}`
            : val;
    };

    return (
        <div>
            <h4>Registers / Flags</h4>
            <table>
                <thead>
                    <tr class="registers-header">
                        <th style="text-align: center">A</th>
                        <th style="text-align: center">B</th>
                        <th style="text-align: center">C</th>
                        <th style="text-align: center">D</th>
                        <th style="text-align: center">PC</th>
                        <th style="text-align: center">SP</th>
                        <th style="text-align: center">DP</th>
                        <th style="text-align: center">Z</th>
                        <th style="text-align: center">C</th>
                        <th style="text-align: center">F</th>
                        <th style="text-align: center">SM</th>
                        <th style="text-align: center">IB</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="text-align: center">
                        <td>
                            <div class={state.settings.displayA ? "marker marker-a" : "marker"}
                                onClick={() => changeColorDisplay("displayA")}>
                                <small>{formatValue(state.cpuState.a)}</small>
                            </div>
                        </td>
                        <td>
                            <div class={state.settings.displayB ? "marker marker-b" : "marker"}
                                onclick={() => changeColorDisplay("displayB")}>
                                <small>{formatValue(state.cpuState.b)}</small>
                            </div>
                        </td>
                        <td>
                            <div class={state.settings.displayC ? "marker marker-c" : "marker"}
                                onclick={() => changeColorDisplay("displayC")}>
                                <small>{formatValue(state.cpuState.c)}</small>
                            </div>
                        </td>
                        <td>
                            <div class={state.settings.displayD ? "marker marker-d" : "marker"}
                                onclick={() => changeColorDisplay("displayD")}>
                                <small>{formatValue(state.cpuState.d)}</small>
                            </div>
                        </td>
                        <td>
                            <div class={state.settings.displayPC ? "marker marker-pc" : "marker"}
                                onclick={() => changeColorDisplay("displayPC")}>
                                <small>{formatValue(state.cpuState.pc)}</small>
                            </div>
                        </td>
                        <td>
                            <div class={state.settings.displaySP ? "marker marker-sp" : "marker"}
                                onclick={() => changeColorDisplay("displaySP")}>
                                <small>{formatValue(state.cpuState.sp)}</small>
                            </div>
                        </td>
                        <td>
                            <div class={state.settings.displayDP ? "marker marker-dp" : "marker"}
                                onclick={() => changeColorDisplay("displayDP")}>
                                <small>{formatValue(state.cpuState.dp)}</small>
                            </div>
                        </td>
                        <td><small>{state.cpuState.flags.z.valueOf() ? '1' : '0'}</small></td>
                        <td><small>{state.cpuState.flags.c.valueOf() ? '1' : '0'}</small></td>
                        <td><small>{state.cpuState.flags.f.valueOf() ? '1' : '0'}</small></td>
                        <td><small>{formatValue(state.cpuState.memory[DEVICES["screen-mode"].start() + 1])}</small></td>
                        <td><small>{formatValue(state.cpuState.memory[DEVICES["input"].start() + 1])}</small></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
