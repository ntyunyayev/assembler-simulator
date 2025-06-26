import { getStateContext } from "./stateContext";

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
                            <small>{state.settings.displayA ? state.cpuState.a : state.cpuState.a}</small>
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
                            <small>{state.settings.displayHex ? state.cpuState.b : state.cpuState.b}</small>
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
                            <small>{state.settings.displayHex ? state.cpuState.c : state.cpuState.c}</small>
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
                            <small>{state.settings.displayHex ? state.cpuState.d : state.cpuState.d}</small>
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
                            <small>{state.settings.displayHex ? state.cpuState.pc : state.cpuState.pc}</small>
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
                            <small>{state.settings.displayHex ? state.cpuState.sp : state.cpuState.sp}</small>
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
                            <small>{state.settings.displayHex ? state.cpuState.dp : state.cpuState.dp}</small>
                        </div>
                    </td>
<<<<<<< solid
                    <td><small>{/*{ cpu.zero | flag }*/}</small></td>
                    <td><small>{/*{ cpu.carry | flag }*/}</small></td>
                    <td><small>{/*{ cpu.fault | flag }*/}</small></td>
                    <td><small>{/*{ cpu.screenMode | flag }*/}</small></td>
                    
=======
                    <td><small>{state.cpuState.flags.sm.valueOf() ? '1' : '0'}</small></td>
                    <td><small>{state.cpuState.flags.sm.valueOf() ? '1' : '0'}</small></td>
                    <td><small>{state.cpuState.flags.sm.valueOf() ? '1' : '0'}</small></td>
                    <td><small>{state.cpuState.flags.sm.valueOf() ? '1' : '0'}</small></td>
>>>>>>> piwy
                </tr>
                </tbody>
            </table>
        </div>
    )   
}