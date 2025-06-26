import type { SetStoreFunction } from "solid-js/store";
import {LittleCPU} from "../core/cpu"
import type { IMemory } from "../core/memory";
import type { State } from "../stores/state";
import { ReactiveMemory } from "./ReactiveMemory";

class ReactiveCPU extends LittleCPU {
    state?: State
    setState?: SetStoreFunction<State>
    interval?: number;
    setup(state: State, setState: SetStoreFunction<State>) {
        this.state = state
        this.setState = setState
    }
    step() {
        const val = super.step()
        this.setState!("cpuState", (prev) => ({
            ...prev,
            a: this.gpr[0],
            b: this.gpr[1],
            c: this.gpr[2],
            d: this.gpr[3],
            dp: this.dp,
            sp: this.sp,
            pc: this.ip,
            flags: {
                ...prev.flags,
                c: this.carry,
                f: this.fault || false,
                z: this.zero,
            }
        }));
        
        return val;
    }
    run() {
        if (this.interval != null) return;
        this.interval = setInterval(() => {
            this.step();
        }, 1000/(this.state?.speed || 1))
    }
    constructor(memory: IMemory) {
        super(memory)
    }
}

export const CPU = new ReactiveCPU(new ReactiveMemory())