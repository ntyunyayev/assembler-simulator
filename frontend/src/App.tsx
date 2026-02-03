import { createStateStore, loadExamples } from "./stores/state.ts"
import './App.css'
import "./stores/state.ts"
import { StateContext } from './utils/stateContext.ts';
import Navbar from './components/Navbar.tsx';
import Editor from './components/Editor.tsx';
import Memory from './components/Memory.tsx';
import Settings from './components/Settings.tsx';
import Flags from './components/Flags.tsx';
import Labels from './components/Labels.tsx';
import Screen from './components/Screen.tsx';
import Credits from './components/Credits.tsx'
import { CPU } from "./utils/ReactiveCPU.ts";
import { onMount } from "solid-js";
import { Show } from "solid-js";
import SelectExample from "./components/SelectExample.tsx";
import { DEVICES } from "cpu-core/src/devices";

function App() {
    const [state, setState] = createStateStore();
    CPU.setup(state, setState);

    //@ts-ignore
    window.CPU = CPU; // Debug purposes
    //@ts-ignore
    window.DEVICES = DEVICES; // Debug purposes

    onMount(async () => {
        await loadExamples(setState);
        setState("code", state.examples?.find(example => example.name === "Draw on screen")?.code || "");
    });

    return (
        <StateContext.Provider value={[state, setState]}>
            <Navbar />
            <div class="columns">
                <div class="col0">
                    <SelectExample />

                    <Editor />
                </div>
                <div class="col1">
                    <Labels />
                    <Show when={!state.quick}>
                        <Memory />
                    </Show>
                </div>
                <div class="col2">
                    <Settings />
                    <Show when={!state.quick}>
                        <Flags />
                    </Show>
                    <Screen />
                    <Credits />
                </div>
            </div>
        </StateContext.Provider>
    )
}

export default App
