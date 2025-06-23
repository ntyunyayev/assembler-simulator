app.directive('selectLine', [function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            scope.$watch('selectedLine', function(lineIndex) {
                const editor = element[0];

                // Remove existing highlights
                Array.from(editor.children).forEach(div => {
                    div.classList.remove('highlight');
                });

                // Add highlight to the selected line (if valid index)
                if (typeof lineIndex === 'number' && lineIndex >= 0 && lineIndex < editor.children.length) {
                    editor.children[lineIndex].classList.add('highlight');
                }
            });
        }
    };
}]);
