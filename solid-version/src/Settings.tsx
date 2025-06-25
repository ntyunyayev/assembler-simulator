import { FaSolidGear } from 'solid-icons/fa'

export default function Settings() {
    return (
        <div>
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
                }}>
                <FaSolidGear/>
            </div>
            <div class="settings-container">
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

                <h4>Clock Speed</h4>
                <div class="selectable">
                    <button
                        ng-repeat="item in speeds"
                        ng-click="setSpeed(item.speed)"
                        ng-class="{'active': speed === item.speed}"> /* TODO correct this */
                    </button>
            </div>
        </div>
    </div>
    )
};