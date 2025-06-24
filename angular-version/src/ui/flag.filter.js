app.filter('flag', function() {
    return function(input) {
        return input ? "1" : "0";
    };
});
