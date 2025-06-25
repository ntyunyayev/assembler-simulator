export default function Labels() {
    return (
        <div>
            <h4>Labels</h4>
            <table class="labels-table">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Value</th>
                    </tr>
                    <tr ng-repeat="(name, value) in labels" class="codelabel">
                        <td class="codelabel-name">{/*name*/}</td>
                        <td class="codelabel-line">
                            <a ng-click="jumpToLine(value)"  ng-mouseenter="setHighlight(value)"   ng-mouseleave="setHighlight(-1)">
                                {/*{ value| number:displayHex:true }*/}
                            </a>
                        </td>
                        <td class="codelabel-value">
                            {/*{ memory.load16(value) | number:displayHex:true }*/}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}