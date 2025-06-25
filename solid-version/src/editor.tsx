export default function Editor(){
    return (
        <div class="editor-container">
            <div class="alert alert-danger" ng-hide="error === ''">ERROR</div> {/* TODO: Fix this */}
            <div>
                <h4>
                    Code
                    <small>(
                        <a class="instruction-set-button" href="./instruction-set.html" target="_blank">
                            Instruction Set
                        </a>
                    )</small>
                </h4>
            </div>
            <div>
                <div class="editor" id="editor" select-line ng-blur="updateCode($event)" ng-keyup="updateCode($event)">
                </div>
                <button type="button" ng-click="assemble()">
                    Assemble
                </button>
            </div>
        </div>
)};