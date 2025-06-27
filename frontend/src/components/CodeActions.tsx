import { createEffect, createSignal, Show } from "solid-js";
import { CPU } from "../utils/ReactiveCPU";
import { getStateContext } from "../utils/stateContext";
import { VsDebugPause } from "solid-icons/vs";
import { IoPlay, IoPlayForward } from "solid-icons/io";
import { AiFillBug, AiOutlineClose, AiOutlineStepForward } from "solid-icons/ai";
import "../styles/CodeActions.css"; 
import { RiDocumentFolderDownloadFill, RiDocumentFolderUploadFill} from "solid-icons/ri";
import "../utils/fileManager.ts"; 
import { downloadFile, uploadFile } from "../utils/fileManager.ts";

export default function CodeActions() {
    let [state, setState] = getStateContext();
    let [interval, _SetInterval] = createSignal(0);
    let [currentSpeed, setCurrentSpeed] = createSignal(0);

    const dcontinue = () => {
        if (state.error) return;
        _SetInterval(setInterval(() => {
            CPU.step()
            if (state.breakpoints.includes(state.lineHighlight)) {
                stop()
            }
        }, 1000 / state.speed))
        setCurrentSpeed(state.speed)
        setState("isRunning", true)
    }
    const runQuickly = () => {
        CPU.reset()
        CPU.assemble()
        if (state.error) return;
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
            dcontinue()
        }
    })

    const launchDebug = () => {
        CPU.reset()
        CPU.assemble()
        if (state.error) return;
        setState("isDebugging", true)
    }

    const loadUploadedFile = () => {
        uploadFile().then(content => {
            setState("code", content);
            CPU.assemble();
        }).catch(error => {
            console.error("Error loading file:", error);
        });
    }

    return (
       <div class="code_buttons">
            <Show when={!state.isRunning && !state.isDebugging}>
                <RiDocumentFolderUploadFill title="Upload Code" color="#2c3e50" size={35} onClick={() => loadUploadedFile()}/>
                <RiDocumentFolderDownloadFill title="Download Code" color="#2c3e50" size={35} onClick={() => downloadFile(state.code)}/>
            </Show>
            <Show when={state.isRunning}>
                <VsDebugPause title="Pause" color="red" size={35} onClick={stop}/>    
            </Show>
            <Show when={state.isDebugging === false && !state.isRunning}>
                <AiFillBug title="Debug" color="#2ecc71" size={35} onClick={launchDebug} />
                <IoPlayForward title="Run fast" class="bite" color="#2ecc71" size={35} onClick={runQuickly}/>
            </Show>
            <Show when={state.isDebugging === true}>
                <Show when={!state.isRunning}>
                    <AiOutlineClose title="Stop Debugging" color="red" size={35} onClick={() => setState("isDebugging", false)}/>    
                    <IoPlay title="Run" color="#2ecc71" size={35} onClick={dcontinue} />
                    <IoPlay color="#2ecc71" size={35} onClick={dcontinue} />
                    <AiOutlineStepForward title="Step" color="#2ecc71" size={35} onClick={() => CPU.step()} />                
                </Show>
            </Show>
           
        </div>
)};