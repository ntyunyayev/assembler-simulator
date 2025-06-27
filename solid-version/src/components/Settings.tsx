import { FaSolidGear } from 'solid-icons/fa'
import { getStateContext } from '../utils/stateContext';
import '../styles/Settings.css';

export default function Settings() {
    const [state, setState] = getStateContext();
    
    function enableSettingsVue() {
        document.querySelectorAll('.settings-container').forEach(
            (el) => {
                if ((el as HTMLElement).style.display === 'block') {
                    (el as HTMLElement).style.display = 'none';
                } else {
                    (el as HTMLElement).style.display = 'block';
                }
            }
        );
    }

    return (
        <div>
            <div
                class="settings-icon-container"
                onClick={() => enableSettingsVue()}>
                <FaSolidGear color="#444" size={40}/>
            </div>
            <div class="settings-container">
                <h4 class="settings">Numbers Representation</h4>
                <div class="selectable">
                    <button
                        onclick={() => setState("settings", "displayHex", false)}
                        classList={{ 'active': !state.settings.displayHex }}> Decimal
                    </button>
                    <button
                        onclick={() => setState("settings", "displayHex", true)}
                        classList={{ 'active': state.settings.displayHex }}> Hex
                    </button>
                </div>

                <h4>Instructions in RAM</h4>
                <div class="selectable">
                    <button
                        onclick={() => setState("settings", "displayInstr", false)}
                        classList={{ 'active': !state.settings.displayInstr }}> Hide
                    </button>
                    <button
                        onclick={() => setState("settings", "displayInstr", true)}
                        classList={{ 'active': state.settings.displayInstr }}> Show
                    </button>
                </div>

                <h4>RAM display mode</h4>
                <div class="selectable">
                    <button
                        onclick={() => setState("settings", "ramDisplayMode", 'Number')}
                        classList={{ 'active': state.settings.ramDisplayMode === 'Number' }}> Number
                    </button>
                    <button
                        onclick={() => setState("settings", "ramDisplayMode", 'ASCII')}
                        classList={{ 'active': state.settings.ramDisplayMode === 'ASCII' }}> ASCII
                    </button>
                </div>

                <h4>Clock Speed</h4>
                <div class="selectable">
                    <button
                        onclick={() => setState("speed", 1)}
                        classList={{ 'active': state.speed === 1 }}> 1 Hz
                    </button>
                    <button
                        onclick={() => setState("speed", 4)}
                        classList={{ 'active': state.speed === 4 }}> 4 Hz
                    </button>
                    <button
                        onclick={() => setState("speed", 8)}
                        classList={{ 'active': state.speed === 8 }}> 8 Hz
                    </button>
                    <button
                        onclick={() => setState("speed", 16)}
                        classList={{ 'active': state.speed === 16 }}> 16 Hz
                    </button>
                    <button
                        onclick={() => setState("speed", 1024)}
                        classList={{ 'active': state.speed === 1024 }}> 1024 Hz
                    </button>
            </div>
        </div>
    </div>
    )
};