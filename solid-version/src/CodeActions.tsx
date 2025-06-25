export default function CodeActions() {
    return (
       <div>
            <button type="button" ng-click="run()" ng-hide="isRunning">
                Run
            </button>
            <button type="button" ng-click="runQuickly()" ng-hide="isRunning">
                Run Quickly
            </button>
            <button type="button" ng-click="stop()" ng-show="isRunning">
                Stop
            </button>
            <button type="button" ng-click="executeStep()" ng-disabled="isRunning">
                Step
            </button>
            <button type="button" ng-click="reset()">
                Reset
            </button>
        </div>
)};