import { getStateContext } from './stateContext';

export default function Navbar() {
    const [state, setState] = getStateContext();

    return (
    <nav class="navbar">
        <div class="navbar-header">
            <a class="navbar-title">
                Simple 16-bit Assembler Simulator
            </a>
            <a type="instruction-set-button" href="instruction-set.html">
                Instruction set
            </a>
        </div>

        <form method="post" enctype="multipart/form-data">
            <label for="file">Choose file to load</label>
            <input type="file" id="file" name="file" />
            <button type="button" ng-click="loadFile()">
                Load file
            </button>
        </form>

        <button type="button" ng-click="downloadCode()">
            Download Code
        </button>

        <div class="example-dropdown" ng-init="loadExamples()">
            <label for="exampleSelect">Load Example:</label>
            <select 
                id="exampleSelect" 
                class="example-select"
                value={state.examples?.find(example => example.code === state.code)?.name || "Draw in screen"}
                onchange={(e) => {
                    const selectedExample = state.examples?.find(example => example.name === e.currentTarget.value);
                    if (selectedExample) {
                        setState("code", selectedExample.code);
                    }
                }}>
                {state.examples?.map(example => (
                    <option value={example.name} selected={example.name === "Draw in screen" ? state.code === example.code : example.code === state.code}>
                        {example.name}
                    </option>
                ))}
            </select>
    </div>

    </nav>
)};
