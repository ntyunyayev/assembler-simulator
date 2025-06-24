app.directive('recordKeys', [function () {
    return {
        restrict: 'A',
        link: function(scope, element) {

            element[0].addEventListener("keydown", (e) => {
                if (!scope.recordingKeys) return;
                scope.inputbuffer.processEvent(scope, e);
                e.preventDefault();
            });
        }
    };
}]);
