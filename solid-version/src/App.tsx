import { createContext } from 'solid-js';
import { createStateStore } from "./stores/state.ts"
import './App.css'
import "./stores/state.ts"
import type { SetStoreFunction } from 'solid-js/store';
import type { CpuState } from './stores/state.ts';

import Navbar from './navbar.tsx';
import CodeActions from './code-actions.tsx';
import Editor from './editor.tsx';
import Memory from './memory.tsx';
import Settings from './settings.tsx';
import Flags from './Flags.tsx';
import Labels from './Labels.tsx';
import Screen from './Screen.tsx';

function App() {
    const [state, setState] = createStateStore();
    const StateContext = createContext<[CpuState, SetStoreFunction<CpuState>]>();
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
