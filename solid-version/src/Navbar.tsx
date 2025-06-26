export default function Navbar() {
    return (
    <nav class="navbar">
        <div class="navbar-header">
            <a class="navbar-title">
                Simple 16-bit Assembler Simulator
            </a>
            <a type="instruction-set-button" href="instruction-set.html">
                Instruction set
            </a>
        </div>

        <form method="post" enctype="multipart/form-data">
            <label for="file">Choose file to load</label>
            <input type="file" id="file" name="file" />
            <button type="button" ng-click="loadFile()">
                Load file
            </button>
        </form>

        <button type="button" ng-click="downloadCode()">
            Download Code
        </button>
    </nav>
)};