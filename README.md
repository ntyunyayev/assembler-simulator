# Simple 16-bit Assembler Simulator

A simple assembler simulator for educational purposes, designed to help users understand the basics of assembly language and CPU instruction execution.

## Try it online
You can try the simulator online at [Assembler Simulator](http://asm.info.ucl.ac.be/).

## Features
This project implements simplified version of assembly language and CPU simulation on a 16-bit architecture. The details of the instruction set can be found [here](http://asm.info.ucl.ac.be/instruction-set.html).

The simulator includes the following features:
- Parse and execute basic assembly instructions
- Step-by-step simulation of instruction execution
- Visualize registers and memory state
- User-friendly interface for loading and editing assembly code
- Small screen mapped to memory to visualize the output

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements.

## Acknowledgements
This project is based on the original work by Marco Schweighauser, which can be found at [Marco's Blog](https://www.mschweighauser.com/make-your-own-assembler-simulator-in-javascript-part1/).

The new version has been completely rewritten as part of an UCL/INGI Open Week 2025 project by @tdaron, @Piwy-dev and @ernesto.

### Clone the repository
```bash
git clone https://github.com/ntyunyayev/assembler-simulator.git
cd assembler-simulator
```

### Go to the frontend directory
```bash
cd frontend
```

### Install dependencies

```bash
pnpm install
```

3. **Run the simulator**
```bash
pnpm run dev
```
### Open the website
Navigate to `http://localhost:5173/` to access the simulator.


## Contributors

Thank you to everyone who has contributed to this project!

<a href="https://github.com/ntyunyayev/assembler-simulator/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ntyunyayev/assembler-simulator" />
</a>

## License

This project is licensed under the MIT License.
