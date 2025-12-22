import { getStateContext } from "../utils/stateContext";
import '../styles/SelectExample.css';

export default function SelectExample() {
    const [state, setState] = getStateContext();

    return (
        <div class="example-dropdown" ng-init="loadExamples()">
            <label for="exampleSelect">Load Example:</label>
            <select 
                id="exampleSelect" 
                class="example-select"
                disabled={state.isRunning || state.isDebugging}
                value={state.examples?.find(example => example.code === state.code)?.name || ""}
                onchange={(e) => {
                    const selectedExample = state.examples?.find(example => example.name === e.currentTarget.value);
                    if (selectedExample) {
                        setState("code", selectedExample.code);
                    }
                }}>
                {state.examples?.map(example => (
                    <option value={example.name} selected={example.code === state.code}>
                        {example.name}
                    </option>
                ))}
            </select>
        </div>  
    );
}
