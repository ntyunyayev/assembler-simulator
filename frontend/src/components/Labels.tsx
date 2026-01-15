import { For } from 'solid-js';
import { getStateContext } from '../utils/stateContext';
import '../styles/Labels.css'; 

export default function Labels() {
    const [state, setState] = getStateContext();

    const highlight = (address: number) => setState("memoryHighlight", address);
    const reset = () => setState("memoryHighlight", -1);
    return (
        <div class="labels">
            <h4>Labels</h4>
            <table class="labels-table">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Value</th>
                    </tr>
                    <For each={state.labels}>
                        {([name, address]) => (
                            <tr>
                                <td>{name}</td>
                                <td onMouseLeave={reset} onMouseEnter={() => highlight(address)} class='link'>{state.settings.displayHex ? address.toString(16).padStart(4, '0') : address}</td>
                                <td>{state.cpuState.memory[address]}</td>
                            </tr>
                        )}
                    </For>
                </tbody>
            </table>
        </div>
    );
}