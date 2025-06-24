app.service('inputbuffer', function () {
    this.size = 2;

    this.processEvent = function(scope, event) {
        let addr = scope.inputBufferStartIndex;
        const end = scope.inputBufferEndIndex;

        // Find first empty 16-bit slot (value == 0)
        while (scope.memory.load16(addr) !== 0 && addr < end) {
            addr += 2; // step by word size
        }

        if (addr < end) {
            // Space found: insert keyCode
            scope.memory.store16(addr, event.keyCode);
        } else {
            // Buffer full: shift left by one word (2 bytes)
            for (let i = scope.inputBufferStartIndex + 2; i < end; i += 2) {
                const val = scope.memory.load16(i);
                scope.memory.store16(i - 2, val);
            }
            // Insert new keyCode at the last slot
            scope.memory.store16(end - 2, event.keyCode);
        }

        scope.$apply();
    };
});
