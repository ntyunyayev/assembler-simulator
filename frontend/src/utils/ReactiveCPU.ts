import type { SetStoreFunction } from "solid-js/store";
import {LittleCPU} from "cpu-core/src/cpu"
import type { IMemory } from "cpu-core/src/memory";
import type { State } from "../stores/state";
import { ReactiveMemory } from "./ReactiveMemory";
import { batch } from "solid-js";
import { assembler } from "cpu-core/src/assembler";

class ReactiveCPU extends LittleCPU {
    state?: State
    setState?: SetStoreFunction<State>
    interval?: number;
    setup(state: State, setState: SetStoreFunction<State>) {
        this.state = state
        this.setState = setState
    }
    triggerUpdate() {
        if (this.setState) {
            batch(() => {
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
                this.setState!("lineHighlight", this.state?.mapping[this.ip]!+1)
            })
         
        
        }

    }
    reset() {
        super.reset()
        this.triggerUpdate()
    }
    step() {
        const val = super.step()
        this.triggerUpdate()
        
        return val;
    }
    assemble() {
        if (!this.state || !this.setState) return;
        try {
              const { code: machineCode, mapping, labels } = assembler.go(this.state.code);
              batch(() => {
                for (let i = 0; i < machineCode.length; i++) {
                  CPU.memory.store(i, machineCode[i]);
                }
              })
            
              
              this.setState("labels", Object.entries(labels));
              this.setState("mapping", mapping);
              this.setState!("lineHighlight", this.state?.mapping[0]!+1)

              this.setState("error", "");
            } catch (err: any) {
              if (err.line !== undefined) {
                this.setState("error", `${err.error} (ligne ${err.line + 1})`);
                this.setState("lineHighlight", err.line + 1);
              } else {
                this.setState("error", `${err.error}`);
              }
            }

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
