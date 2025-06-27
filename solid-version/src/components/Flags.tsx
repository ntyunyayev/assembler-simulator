import { getStateContext } from "../utils/stateContext";
import { DEVICES } from "../core/devices";
import "../styles/Flags.css";

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
                </tr>
                </thead>
                <tbody>
                <tr style="text-align: center">
                    <td>
                        <div
                            class={
                                state.settings.displayA
                                    ? "marker marker-a"
                                    : "marker"
                            }
                            onClick={() => changeColorDisplay("displayA")}
                        >
                            <small>{state.settings.displayA ? state.cpuState.a.toString(16) : state.cpuState.a}</small>
                        </div>
                    </td>
                    <td>
                        <div 
                            class={
                                state.settings.displayB
                                    ? "marker marker-b"
                                    : "marker"
                            }
                            onclick={() => changeColorDisplay("displayB")}
                        >
                            <small>{state.settings.displayHex ? state.cpuState.b.toString(16) : state.cpuState.b}</small>
                        </div>
                    </td>
                    <td>
                        <div 
                            class={
                                state.settings.displayC
                                    ? "marker marker-c"
                                    : "marker"
                            }
                            onclick={() => changeColorDisplay("displayC")}
                        >
                            <small>{state.settings.displayHex ? state.cpuState.c.toString(16) : state.cpuState.c}</small>
                        </div>
                    </td>
                    <td>
                        <div 
                            class={
                                state.settings.displayD
                                    ? "marker marker-d"
                                    : "marker"
                            }
                            onclick={() => changeColorDisplay("displayD")}
                        >
                            <small>{state.settings.displayHex ? state.cpuState.d.toString(16) : state.cpuState.d}</small>
                        </div>
                    </td>
                    <td>
                        <div 
                            class={
                                state.settings.displayPC
                                    ? "marker marker-pc"
                                    : "marker"
                                }
                            onclick={() => changeColorDisplay("displayPC")}
                        >
                            <small>{state.settings.displayHex ? state.cpuState.pc.toString(16) : state.cpuState.pc}</small>
                        </div>
                    </td>
                    <td>
                        <div 
                            class={
                                state.settings.displaySP
                                ? "marker marker-sp"
                                : "marker"
                            }
                            onclick={() => changeColorDisplay("displaySP")}
                        >
                            <small>{state.settings.displayHex ? state.cpuState.sp.toString(16) : state.cpuState.sp}</small>
                        </div>
                    </td>
                    <td>
                        <div 
                            class={
                                state.settings.displayDP
                                    ? "marker marker-dp"
                                    : "marker"
                            }
                            onclick={() => changeColorDisplay("displayDP")}
                        >
                            <small>{state.settings.displayHex ? state.cpuState.dp.toString(16) : state.cpuState.dp}</small>
                        </div>
                    </td>
                     <td><small>{state.cpuState.flags.z.valueOf() ? '1' : '0'}</small></td>
                     <td><small>{state.cpuState.flags.c.valueOf() ? '1' : '0'}</small></td>
                     <td><small>{state.cpuState.flags.f.valueOf() ? '1' : '0'}</small></td>
                     {/* TODO: Change this */}
                     <td><small>{state.cpuState.memory[DEVICES["screen-mode"].start()+1]}</small></td>
                </tr>
                </tbody>
            </table>
        </div>
    )   
}