import { createContext } from 'solid-js';
import {createStateStore} from "./stores/state.ts"
import './App.css'
import "./stores/state.ts"
import type { SetStoreFunction } from 'solid-js/store';
import type { CpuState } from './stores/state.ts';

import Navbar from './navbar.tsx';
import CodeActions from './code-actions.tsx';

function App() {
    const [state, setState] = createStateStore();
    const StateContext = createContext<[CpuState, SetStoreFunction<CpuState>]>();
    return (
        <StateContext.Provider value={[state, setState]}>
            <Navbar></Navbar>
            <CodeActions></CodeActions>
            <div>
                <div class="alert alert-danger" ng-hide="error === ''">ERROR</div> {/* TODO: Fix this */}
                <div class="row main">
                    <div class="editor-container">
                        <div>
                            <div>
                                <h4>
                                    Code
                                    <small>(
                                        <a class="instruction-set-button" href="./instruction-set.html" target="_blank">Instruction Set</a>
                                    )</small>
                                </h4>
                            </div>
                            <div>
                                <div class="editor" id="editor"
                                    select-line
                                    ng-blur="updateCode($event)"
                                    ng-keyup="updateCode($event)">

                                </div>
                                <button
                                    type="button"
                                    class="btn btn-default"
                                    ng-click="assemble()"
                                >
                                    Assemble
                                </button>

                            </div>
                        </div>
                    </div>
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
                        <div>
                            <h4>Memory (RAM)</h4>

                            <div class="source-code">
                                <div
                                    class="memory-block"
                                    ng-repeat="m in memory.data track by $index"
                                    ng-class="getMemoryCellCss($index)"
                                >
                                    <div
                                        ng-class="getMemoryInnerCellCss($index)"
                                        ng-switch="isInstruction($index)"
                                    >

                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div class="col2">
            <div
                class="settings-icon-container"
                onClick={() => {
                  document.querySelectorAll('.settings-container').forEach(
                    (el) => {
                      if ((el as HTMLElement).style.display === 'block') {
                        (el as HTMLElement).style.display = 'none';
                      } else {
                        (el as HTMLElement).style.display = 'block';
                      }
                    }
                  );
                }}
                style="cursor:pointer;">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-icon lucide-settings"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
                        </div>

                        <div class="settings-container">
                            <h4>Clock Speed</h4>
                            <div class="selectable">
                                {/*
                    <button
                        ng-repeat="item in speeds"
                        ng-click="setSpeed(item.speed)"
                        ng-class="{'active': speed === item.speed}"> {{ item.desc }}
                    </button>
                    */}
                            </div>

                            <h4 class="settings">Numbers Representation</h4>
                            <div class="selectable">
                                <button
                                    ng-click="displayHex = false"
                                    ng-class="{'active': !displayHex}"> Decimal
                                </button>
                                <button
                                    ng-click="displayHex = true"
                                    ng-class="{'active': displayHex}"> Hexadecimal
                                </button>
                            </div>

                            <h4>Instructions in RAM</h4>
                            <div class="selectable">
                                <button
                                    ng-click="displayInstr = false"
                                    ng-class="{'active': !displayInstr}"> Hide
                                </button>
                                <button
                                    ng-click="displayInstr = true"
                                    ng-class="{'active': displayInstr}"> Show
                                </button>
                            </div>

                            <h4>RAM display mode</h4>
                            <div class="selectable">
                                <button
                                    ng-click="ramDisplayMode = 'HEX'"
                                    ng-class="{'active': ramDisplayMode === 'HEX'}"> HEX
                                </button>
                                <button
                                    ng-click="ramDisplayMode = 'ASCII'"
                                    ng-class="{'active': ramDisplayMode === 'ASCII'}"> ASCII
                                </button>
                            </div>
                        </div>

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
            </div>

        </StateContext.Provider>
    )
}

export default App
