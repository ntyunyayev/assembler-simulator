import { assembler } from "./assembler.js";
import fs from 'fs';
import { LittleCPU } from "./cpu.js";
import { ArrayMemory } from "./memory.js";

export class Emulator {
  cpu: LittleCPU
  labels: { [key: string]: number }
  mapping: { [key: number]: number }
  binary: number[]
  selectedLine: number
  error: string
  constructor() {
    this.cpu = new LittleCPU(new ArrayMemory());
    this.labels = {}
    this.mapping = {}
    this.binary = []
    this.error = "";
    this.selectedLine = 0

  }
  run(src: string) {
    try {
      const { code, labels, mapping } = assembler.go(src);
      this.binary = code;
      this.labels = labels
      this.mapping = mapping

      if (this.binary.length > this.cpu.memory.data.length)
        throw "Binary code does not fit into the memory. Max " + this.cpu.memory.data.length + " bytes are allowed";

      this.cpu.reset();
      for (var i = 0, l = this.binary.length; i < l; i++) {
        this.cpu.memory.data[i] = this.binary[i]!;
      }

      while (this.executeStep() === true) {
      }
      


    } catch (e) {
      let err = e as { error: string, line: number };
      fs.writeFileSync("assembly_error", err.error);
      throw new Error(err.error);
    }
  }

  executeStep() {
    try {
      // Execute
      var res = this.cpu.step();
      // Mark in code
      if (this.cpu.ip in this.mapping) {
        this.selectedLine = this.mapping[this.cpu.ip]!;
      }
      return res;
    } catch (e) {
      this.error = e as string;
      fs.writeFileSync("runtime_error", e as string);
      return false;
    }
  }



  dump(fileName: string) {
    var outputJS: { labels?: { [key: string]: number }, cpu?: LittleCPU } = {}
    outputJS.labels = this.labels
    outputJS.cpu = this.cpu
    fs.writeFileSync(fileName, JSON.stringify(outputJS));
  }
}
