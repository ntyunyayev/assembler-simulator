import { createContext } from 'solid-js';
import { createStateStore } from "./stores/state.ts"
import './App.css'
import "./stores/state.ts"
import type { SetStoreFunction } from 'solid-js/store';
import type { CpuState } from './stores/state.ts';

import Navbar from './navbar.tsx';
import CodeActions from './code-actions.tsx';
import Editor from './editor.tsx';
import Memory from './memory.tsx';
import Settings from './settings.tsx';

function App() {
    const [state, setState] = createStateStore();
    const StateContext = createContext<[CpuState, SetStoreFunction<CpuState>]>();
    return (
        <StateContext.Provider value={[state, setState]}>
            <Navbar></Navbar>
            <CodeActions></CodeActions>
            <div class="row main">
                <Editor></Editor>
                <div class="col1">
                    <div>
                        <div>
                            <h4>Labels</h4>
                        </div>
                        <div class=" source-code">
                            <table class="labels-table">
                                <tbody>
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Value</th>
                                    </tr>
                                    <tr ng-repeat="(name, value) in labels" class="codelabel">
                                        <td class="codelabel-name">{name}</td>
                                        {/*
                                <td class="codelabel-line">
                                    <a ng-click="jumpToLine(value)"  ng-mouseenter="setHighlight(value)"   ng-mouseleave="setHighlight(-1)">
                                        {{ value| number:displayHex:true }}
                                    </a>
                                </td>
                                <td class="codelabel-value">
                                    {{ memory.load16(value) | number:displayHex:true }}
                                </td>
                                */}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Memory></Memory>
                </div>
                <div class="col2">
                    <Settings></Settings>

                    <h4>Screen Display</h4>
                    <div class="screen-container">
                        <div tabindex="0"
                            record-keys
                            ng-class="{'screen': true, 'screen-recording': recordingKeys}"
                            ng-mouseenter="recordingKeys = true; focusScreen()"
                            ng-mouseleave="recordingKeys = false; focusScreen()"
                        >
                            <table class="screen-table">
                                <tbody>
                                    <tr ng-repeat="row in screenPixels track by $index">
                                        <td ng-repeat="pixel in row track by $index">
                                            <div
                                                class="screen-pixel"
                                                ng-class="{
                'screen-pixel-on': pixel === 1,
                'screen-pixel-off': pixel === 0,
                'screen-pixel-ascii': pixel !== 1 && pixel !== 0
                }"
                                            ></div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                            {/*
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
                <tr style="text-align: center" class="source-code">
                    <td>
                        <div
                            style="margin: auto"
                            ng-class="{'marker': true, 'marker-a': displayA}"
                            ng-click="displayA = !displayA"
                        >
                            <small>{{ cpu.gpr[0] | number:displayHex }}</small>
                        </div>
                    </td>
                    <td>
                        <div
                            style="margin: auto"
                            ng-class="{'marker': true, 'marker-b': displayB}"
                            ng-click="displayB = !displayB"
                        >
                            <small>{{ cpu.gpr[1] | number:displayHex }}</small>
                        </div>
                    </td>
                    <td>
                        <div
                            style="margin: auto"
                            ng-class="{'marker': true, 'marker-c': displayC}"
                            ng-click="displayC = !displayC"
                        >
                            <small>{{ cpu.gpr[2] | number:displayHex }}</small>
                        </div>
                    </td>
                    <td>
                        <div
                            style="margin: auto"
                            ng-class="{'marker': true, 'marker-d': displayD}"
                            ng-click="displayD = !displayD"
                        >
                            <small>{{ cpu.gpr[3] | number:displayHex }}</small>
                        </div>
                    </td>
                    <td>
                        <div style="margin: auto" class="marker marker-ip">
                            <small>{{ cpu.ip | number:displayHex }}</small>
                        </div>
                    </td>
                    <td>
                        <div style="margin: auto" class="marker marker-sp">
                            <small>{{ cpu.sp | number:displayHex }}</small>
                        </div>
                    </td>
                    <td>
                        <div style="margin: auto" class="marker marker-dp">
                            <small>{{ cpu.dp | number:displayHex }}</small>
                        </div>
                    </td>
                    <td><small>{{ cpu.zero | flag }}</small></td>
                    <td><small>{{ cpu.carry | flag }}</small></td>
                    <td><small>{{ cpu.fault | flag }}</small></td>
                    <td><small>{{ cpu.screenMode | flag }}</small></td>
                </tr>
                </tbody>
            </table>
            */}


                        </div>
                    </div>
        </StateContext.Provider>
    )
}

export default App
