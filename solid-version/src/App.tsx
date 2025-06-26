import { createStateStore } from "./stores/state.ts"
import './App.css'
import "./stores/state.ts"
import { StateContext } from './stateContext.ts';
import Navbar from './Navbar.tsx';
import CodeActions from './CodeActions.tsx';
import Editor from './Editor.tsx';
import Memory from './Memory.tsx';
import Settings from './Settings.tsx';
import Flags from './Flags.tsx';
import Labels from './Labels.tsx';
import Screen from './Screen.tsx';
import { CPU } from "./ReactiveCPU.ts";

function App() {
    const [state, setState] = createStateStore();
    CPU.setup(state, setState);
    //@ts-ignore
    window.CPU = CPU; // Debug purposes
    return (
        <StateContext.Provider value={[state, setState]}>
            <Navbar/>
            <CodeActions/>
            <div class="columns">
                <div class="col0">
                    <Editor/>
                </div>
                <div class="col1">
                    <Labels/>  
                    <Memory/>
                </div>
                <div class="col2">
                    <Settings/>
                    <Screen/>
                    <Flags></Flags>
                </div>
            </div>
        </StateContext.Provider>
    )
}

export default App
