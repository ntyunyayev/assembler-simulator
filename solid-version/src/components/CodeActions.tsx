import { createEffect, createSignal, Show } from "solid-js";
import { CPU } from "../utils/ReactiveCPU";
import { getStateContext } from "../utils/stateContext";
import { VsDebugAlt, VsDebugPause } from "solid-icons/vs";
import { BsFastForward } from "solid-icons/bs";
import { TbReload } from "solid-icons/tb";
import { FaSolidPlay } from "solid-icons/fa";
import { IoPlay, IoPlayForward } from "solid-icons/io";
import { AiOutlineStepForward } from "solid-icons/ai";

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
    }
    const runQuickly = () => {
       // CPU.reset()
        CPU.assemble()
        setState("quick", true)
        _SetInterval(setInterval(() => {
            CPU.step()
        }, 1000 / 4096))
        setCurrentSpeed(0)

    }
    const stop = () => {
        setState("quick", false)
        clearInterval(interval())
        _SetInterval(0);
    }

    createEffect(() => {
        if (state.speed != currentSpeed() && currentSpeed() != 0) {
            clearInterval(interval())
            run()
        }
    })
    return (
       <div class="code_buttons">
            <Show when={interval() != 0}>
                <VsDebugPause color="red" size={35} onClick={stop}/>    
            
            </Show>
            <Show when={interval() === 0}>

            <IoPlay color="#2ecc71" size={35} onClick={run} />
            <AiOutlineStepForward color="#2ecc71" size={35} onClick={() => CPU.step()} />
            <IoPlayForward color="#2ecc71" size={35} onClick={runQuickly}/>
            <TbReload color="#2c3e50" size={35} onClick={() => CPU.reset()} />
            </Show>

            
        </div>
)};