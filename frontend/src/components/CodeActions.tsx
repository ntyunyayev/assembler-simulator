import { createEffect, createSignal, Show } from "solid-js";
import { CPU } from "../utils/ReactiveCPU";
import { getStateContext } from "../utils/stateContext";
import { VsDebugPause } from "solid-icons/vs";
import { IoPlay, IoPlayForward } from "solid-icons/io";
import { AiFillBug, AiOutlineClose, AiOutlineStepForward } from "solid-icons/ai";
import "../styles/CodeActions.css"; 

export default function CodeActions() {
    let [state, setState] = getStateContext();
    let [interval, _SetInterval] = createSignal(0);
    let [currentSpeed, setCurrentSpeed] = createSignal(0);

    const run = () => {
        //CPU.reset()
        CPU.assemble()
        _SetInterval(setInterval(() => {
            CPU.step()
        }, 1000 / state.speed))
        setCurrentSpeed(state.speed)
        setState("isRunning", true)
    }
    const runQuickly = () => {
        CPU.reset()
        CPU.assemble()
        setState("quick", true)
        _SetInterval(setInterval(() => {
            CPU.step()
        }, 1000 / 4096))
        setCurrentSpeed(0)
        setState("isRunning", true)
    }
    const stop = () => {
        setState("quick", false)
        clearInterval(interval())
        _SetInterval(0);
        setState("isRunning", false);
    }

    createEffect(() => {
        if (state.speed != currentSpeed() && currentSpeed() != 0) {
            clearInterval(interval())
            run()
        }
    })

    const launchDebug = () => {
        CPU.reset()
        CPU.assemble()
        setState("isDebugging", true)
    }

    return (
       <div class="code_buttons">
            <Show when={state.isRunning}>
                <VsDebugPause color="red" size={35} onClick={stop}/>    
            </Show>
            <Show when={state.isDebugging === false && !state.isRunning}>
                <AiFillBug title="Debug" color="#2ecc71" size={35} onClick={launchDebug} />
                <IoPlayForward class="bite" title="Run fast" color="#2ecc71" size={35} onClick={runQuickly}/>
            </Show>
            <Show when={state.isDebugging === true}>
                <Show when={!state.isRunning}>
                    <AiOutlineClose color="red" size={35} onClick={() => setState("isDebugging", false)}/>    
                    <IoPlay color="#2ecc71" size={35} onClick={run} />
                    <AiOutlineStepForward title="Step" color="#2ecc71" size={35} onClick={() => CPU.step()} />                
                </Show>
            </Show>
           
        </div>
)};