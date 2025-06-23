app.service('memory', [function () {
    var memory = {
        data: Array(2048),
        lastAccess: -1,
        load: function (address) {
            var self = this;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            return self.data[address];
        },

        load16: function (address) {
            var self = this;

            if (address < 0 || (address + 1) >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            return (self.data[address] << 8) + (self.data[address + 1]);
        },
        store: function (address, value) {
            var self = this;

            if (address < 0 || address >= self.data.length) {
                throw "Memory access violation at " + address;
            }

            self.lastAccess = address;
            self.data[address] = value;
        },
        store16: function (address, value) {
            var self = this;

            if (address < 0 || address + 1 >= self.data.length) {
                throw "Memory access violation at " + address;
            }
            self.lastAccess = address;
            self.data[address] = (value >> 8) & 0xFF;
            self.data[address+1] = value & 0xFF;
        },

        reset: function () {
            var self = this;

            self.lastAccess = -1;
            for (var i = 0, l = self.data.length; i < l; i++) {
                self.data[i] = 0;
            }
        }
    };

    memory.reset();
    return memory;
}]);
