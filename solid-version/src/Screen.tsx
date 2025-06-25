export default function Screen() {
    return (
        <div>
            <h4>Screen Display</h4>
                <div class="screen-container">
                    <div tabindex="0"
                        record-keys
                        ng-class="{'screen': true, 'screen-recording': recordingKeys}"
                        ng-mouseenter="recordingKeys = true; focusScreen()"
                        ng-mouseleave="recordingKeys = false; focusScreen()">
                        <table class="screen-table">
                            <tbody>
                                <tr ng-repeat="row in screenPixels track by $index">
                                    <td ng-repeat="pixel in row track by $index">
                                        <div
                                            class="screen-pixel"
                                            ng-class="{
                                                'screen-pixel-on': pixel === 1,
                                                'screen-pixel-off': pixel === 0,
                                                'screen-pixel-ascii': pixel !== 1 && pixel !== 0
                                                }">
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
        </div>
    );
}