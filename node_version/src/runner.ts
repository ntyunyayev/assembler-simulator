import { Emulator } from '../../cpu-core/src/emulator.js';

export class Runner {
    private emulator: Emulator;

    constructor() {
        this.emulator = new Emulator();
    }

    run(code: string): void {
        // Your Emulator.run() already calls assembler.go, 
        // fills the memory, and runs the 'while' loop.
        this.emulator.run(code);
        
        // After the loop finishes (or errors), dump the output
        this.emulator.dump('out.dat');
    }
}
