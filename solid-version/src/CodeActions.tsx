import { CPU } from "./ReactiveCPU";

export default function CodeActions() {
    return (
    <div class="code_buttons">
      <button class="btn btn-success"
        ng-click="run()"
        ng-hide="isRunning"
        title="Run"
      >
      &#x25B6
      </button>
      <button
        class="btn btn-success"
        ng-click="runQuickly()"
        ng-hide="isRunning"
        title="Run quickly"
      >
      &#x25B6<span style="margin-left:-0.3em;">&#x25B6</span>
      </button>
      <button
            class="btn btn-default"
            ng-click="stop()"
            ng-show="isRunning"
            title="Stop"
          >
            &#x23F8
          </button>
          <button
            class="btn btn-step btn-default"
            onclick={() => CPU.step()}
            ng-disabled="isRunning"
            title="Step"
          >
            <span class="glyphicon glyphicon-forward"></span>
            &#x2B95
        </button>
        <button
            class="btn btn-default btn-reset"
            ng-click="reset()"
            title="Reset"
          >
            &#x21BB
          </button>
    </div>
)};