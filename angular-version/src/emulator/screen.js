app.service('screen', function ($document, cpu) {
    this.width = 32;
    this.height = 32;
    this.size = this.width * this.height * 2;

    this.render = function(scope) {
        // Create a 2D array representing the screen pixels
        const pixels = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
            const addr = scope.displayStartIndex + (y * this.width + x) * 2;
            const value = scope.memory.load16(addr);
            if (cpu.screenMode) {
                row.push(value & 1); // only black and white ATM.
            } else {
                if (String.fromCharCode(value) === '\0') {
                    row.push(0); // Null character
                } else {
                    row.push(String.fromCharCode(value));
                }
            }
            }
            pixels.push(row);
        }
        console.log("White", pixels[0] === 0);
        console.log("Black", pixels[0] === 1);
        console.log("ASCII", pixels[0] !== 0 && pixels[0] !== 1);
        console.log("Screen pixels:", pixels);
        return pixels;
    };
});