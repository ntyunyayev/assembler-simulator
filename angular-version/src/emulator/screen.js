app.service('screen', function () {
    this.width = 32;
    this.height = 32;
    this.size = this.width * this.height * 2;

    this.render = function(scope) {
        // Create a 2D array representing the screen pixels
        const pixels = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const addr = scope.displayStartIndex + (y * this.width + x)*2;
                const value = scope.memory.load16(addr);
                row.push(value & 1); // only black and white ATM.

            }
            pixels.push(row);
        }
        return pixels;
    };
});