import { createEffect, createSignal } from "solid-js";
import { CPU } from "../utils/ReactiveCPU";
import { getStateContext } from "../utils/stateContext";
import { VsDebugStop } from "solid-icons/vs";
import { IoPlay, IoPlayForward } from "solid-icons/io";
import { AiOutlineClear, AiOutlineStepForward } from "solid-icons/ai";
import "../styles/CodeActions.css";
import { RiDocumentFolderDownloadFill, RiDocumentFolderUploadFill } from "solid-icons/ri";
import { downloadFile, uploadFile } from "../utils/fileManager.ts";

export default function CodeActions() {
    let [state, setState] = getStateContext();
    let [interval, _SetInterval] = createSignal(0);
    let [currentSpeed, setCurrentSpeed] = createSignal(0);

    const dcontinue = () => {
        if (state.error) return;
        _SetInterval(setInterval(() => {
            try {
                const output = CPU.step();
                if (!output || state.breakpoints.includes(state.lineHighlight)) {
                    stop()
                    if (!output) setState("isDebugging", false);
                }
            } catch (e) {
                setState("error", e as string);
                stop()
                setState("isDebugging", false);
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
            try {
                if (!CPU.step()) {
                    stop()
                    setState("isDebugging", false)
                }
            } catch (e) {
                setState("error", e as string);
                stop()
                setState("isDebugging", false)
            }
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
        if (state.isDebugging && state.isRunning && state.speed != currentSpeed() && currentSpeed() != 0) {
            clearInterval(interval())
            dcontinue()
        }
    })

    const assemble = () => {
        CPU.reset()
        CPU.assemble()
        if (state.error) return;
        setState("isDebugging", true)
    }

    const clearRAM = () => {
        CPU.reset();
        setState("labels", []);
        setState("isDebugging", false);
    }

    const loadUploadedFile = () => {
        uploadFile().then(content => {
            setState("code", content);
        }).catch(error => {
            console.error("Error loading file:", error);
        });
    }

    // Computed disabled states
    const isLoadDisabled = () => state.isRunning;
    const isClearDisabled = () => state.isRunning;
    const isAssembleDisabled = () => state.isRunning;
    const isStepDisabled = () => !state.isDebugging || state.isRunning;
    const isRunDisabled = () => !state.isDebugging || state.isRunning;
    const isRunFastDisabled = () => state.isRunning;
    const isStopDisabled = () => !state.isRunning && !state.isDebugging;

    return (
        <div class="code_buttons">
            {/* Load file */}
            <RiDocumentFolderUploadFill
                title="Load File"
                color="#2c3e50"
                size={35}
                classList={{ 'disabled': isLoadDisabled() }}
                onClick={() => !isLoadDisabled() && loadUploadedFile()}
            />

            {/* Save file */}
            <RiDocumentFolderDownloadFill
                title="Save File"
                color="#2c3e50"
                size={35}
                onClick={() => downloadFile(state.code)}
            />

            {/* Clear RAM/Labels */}
            <AiOutlineClear
                title="Clear RAM/Labels"
                color="#e74c3c"
                size={35}
                classList={{ 'disabled': isClearDisabled() }}
                onClick={() => !isClearDisabled() && clearRAM()}
            />

            {/* Assemble */}
            <button
                class="assemble-btn"
                classList={{ 'disabled': isAssembleDisabled() }}
                title="Assemble"
                onClick={() => !isAssembleDisabled() && assemble()}
            >
                Assemble
            </button>

            {/* Step */}
            <AiOutlineStepForward
                title="Step"
                color="#2ecc71"
                size={35}
                classList={{ 'disabled': isStepDisabled() }}
                onClick={() => !isStepDisabled() && CPU.step()}
            />

            {/* Run continuously */}
            <IoPlay
                title="Run"
                color="#2ecc71"
                size={35}
                classList={{ 'disabled': isRunDisabled() }}
                onClick={() => !isRunDisabled() && dcontinue()}
            />

            {/* Run fast */}
            <IoPlayForward
                title="Run Fast"
                color="#2ecc71"
                size={35}
                classList={{ 'disabled': isRunFastDisabled() }}
                onClick={() => !isRunFastDisabled() && runQuickly()}
            />

            {/* Stop */}
            <VsDebugStop
                title="Stop"
                color="#e74c3c"
                size={35}
                classList={{ 'disabled': isStopDisabled() }}
                onClick={() => !isStopDisabled() && stop()}
            />
        </div>
    );
};