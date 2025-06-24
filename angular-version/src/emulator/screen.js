app.service('screen', function () {
    this.width = 32;
    this.height = 32;
    this.startAddress = 1024;
    this.endAddress = 2048;

    this.render = function(memory) {
        if (!memory || !Array.isArray(memory) || memory.length < this.endAddress) {
            throw new Error("Invalid memory provided for rendering screen.");
        }
        // Create a 2D array representing the screen pixels
        const pixels = [];
        for (let y = 0; y < this.height; y++) {
            const row = [];
            for (let x = 0; x < this.width; x++) {
                const addr = this.startAddress + y * this.width + x;
                if (addr < this.endAddress && memory[addr] !== undefined) {
                    // Only the lowest bit is used: 0 = white, 1 = black
                    row.push((memory[addr] & 1) ? 1 : 0);
                } else {
                    row.push(0); // default to white
                }
            }
            pixels.push(row);
        }
        return pixels;
    };
});