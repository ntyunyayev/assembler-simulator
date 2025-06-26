import { getStateContext } from '../utils/stateContext';

export default function Navbar() {
    const [state, setState] = getStateContext();

    return (
    <div class="container-sim">
      <a
        class="navbar-link"
        role="navigation"
        style="background-color: #428bca;"
      >
      Simple 16-bit Assembler Simulator
      
      </a>
      <a class="github-fork-link" href="https://github.com/ntyunyayev/assembler-simulator" title="Fork me on GitHub">Fork me on GitHub</a>
    </div>
)};
