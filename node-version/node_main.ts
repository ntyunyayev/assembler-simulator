import { Runner } from './src/runner.js';
import * as fs from 'fs';
import * as process from 'process';

async function main() {
    let filename: string = 'hello_world.asm';

    // Handle command line arguments
    if (process.argv.length === 3) {
        filename = process.argv[2];
    }

    try {
        // Read the assembly file
        const code: string = fs.readFileSync(filename, 'utf8');

        // Initialize and execute the runner
        const runner = new Runner();
        
        console.log(`Assembling and running: ${filename}...`);
        runner.run(code);
        console.log("Execution finished successfully.");
        
    } catch (err) {
        if (err instanceof Error) {
            console.error(`Fatal Error: ${err.message}`);
        } else {
            console.error("An unknown error occurred during execution:", err);
        }
        process.exit(1);
    }
}

main();
