import { Emulator } from "./src/emulator";

console.log("Hello via Bun!");

let emulator = new Emulator();
emulator.run("MOV A, 20\nMOV [A], 50");
emulator.dump("out.dat")

