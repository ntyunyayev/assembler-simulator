import { createEffect, createSignal, Show } from "solid-js";
import { CPU } from "./ReactiveCPU";
import { getStateContext } from "./stateContext";

export default function CodeActions() {
    let [state, _] = getStateContext();
    let [interval, _SetInterval] = createSignal(0);
    let [currentSpeed, setCurrentSpeed] = createSignal(0);

    const run = () => {
        _SetInterval(setInterval(() => {
            CPU.step()
        }, 1000 / state.speed))
        setCurrentSpeed(state.speed)
    }
    const runQuickly = () => {
        _SetInterval(setInterval(() => {
            CPU.step()
        }, 1000 / 1024))
        setCurrentSpeed(0)

    }
    const stop = () => {
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
       <div>
            <button type="button" onClick={run} disabled={interval() != 0}>
                Run
            </button>
            <button type="button" onClick={runQuickly} disabled={interval() != 0}>
                Run Quickly
            </button>
            <Show when={interval() != 0}>
                <button type="button" onClick={stop}>
                    Stop
                </button>
            </Show>
       
            <button type="button" onClick={() => CPU.step()}>
                Step
            </button>
            <button type="button" ng-click="reset()">
                Reset
            </button>
        </div>
)};