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
                                <td
                                    onMouseLeave={reset}
                                    onMouseEnter={() => highlight(address)}
                                    class='link'
                                >
                                    {state.settings.displayHex
                                        ? `0x${address.toString(16).toUpperCase().padStart(4, '0')}`
                                        : address}
                                </td>
                                <td>
                                    {state.settings.displayHex
                                        ? `0x${((state.cpuState.memory[address] << 8) | state.cpuState.memory[address + 1])
                                            .toString(16).toUpperCase().padStart(4, '0')}`
                                        : (state.cpuState.memory[address] << 8) | state.cpuState.memory[address + 1]
                                    }
                                </td>
                            </tr>
                        )}
                    </For>
                </tbody>
            </table>
        </div>
    );
}
