import { Emulator } from "./src/emulator";
import * as fs from "fs";

let filename = 'hello_world.asm';
if (process.argv.length === 3) {
    filename = process.argv[2];
}

const code = fs.readFileSync(filename, 'utf8');

const emulator = new Emulator();
emulator.run(code);
emulator.dump("out.dat");

