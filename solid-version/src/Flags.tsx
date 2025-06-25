export default function Flags() {
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
                <tr style="text-align: center" class="source-code">
                    <td>
                        <div
                            style="margin: auto"
                            ng-class="{'marker': true, 'marker-a': displayA}"
                            ng-click="displayA = !displayA"
                        >
                            <small>{/*{ cpu.gpr[0] | number:displayHex }*/}</small>
                        </div>
                    </td>
                    <td>
                        <div
                            style="margin: auto"
                            ng-class="{'marker': true, 'marker-b': displayB}"
                            ng-click="displayB = !displayB"
                        >
                            <small>{/*{ cpu.gpr[1] | number:displayHex }*/}</small>
                        </div>
                    </td>
                    <td>
                        <div
                            style="margin: auto"
                            ng-class="{'marker': true, 'marker-c': displayC}"
                            ng-click="displayC = !displayC"
                        >
                            <small>{/*{ cpu.gpr[2] | number:displayHex }*/}</small>
                        </div>
                    </td>
                    <td>
                        <div
                            style="margin: auto"
                            ng-class="{'marker': true, 'marker-d': displayD}"
                            ng-click="displayD = !displayD"
                        >
                            <small>{/*{ cpu.gpr[3] | number:displayHex }*/}</small>
                        </div>
                    </td>
                    <td>
                        <div style="margin: auto" class="marker marker-ip">
                            <small>{/*{ cpu.ip | number:displayHex }*/}</small>
                        </div>
                    </td>
                    <td>
                        <div style="margin: auto" class="marker marker-sp">
                            <small>{/*{ cpu.sp | number:displayHex }*/}</small>
                        </div>
                    </td>
                    <td>
                        <div style="margin: auto" class="marker marker-dp">
                            <small>{/*{ cpu.dp | number:displayHex }*/}</small>
                        </div>
                    </td>
                    <td><small>{/*{ cpu.zero | flag }*/}</small></td>
                    <td><small>{/*{ cpu.carry | flag }*/}</small></td>
                    <td><small>{/*{ cpu.fault | flag }*/}</small></td>
                    <td><small>{/*{ cpu.screenMode | flag }*/}</small></td>
                </tr>
                </tbody>
            </table>
        </div>
    )   
}