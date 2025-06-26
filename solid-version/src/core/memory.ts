export interface IMemory {
    data: number[]
    load(address: number): number;
    load16(address: number): number;
    store(address: number, value: number): void;
    store16(address: number, value: number): void;
}

export class ArrayMemory {
    data: Array<number>
    lastAccess: number

    load(address: number): number {

        if (address < 0 || address >= this.data.length) {
            throw "Memory access violation at " + address;
        }

        this.lastAccess = address;
        return this.data[address];
    }

    load16(address: number): number {

        if (address < 0 || (address + 1) >= this.data.length) {
            throw "Memory access violation at " + address;
        }

        this.lastAccess = address;
        return (this.data[address] << 8) + (this.data[address + 1]);
    }


    store(address: number, value: number) {

        if (address < 0 || address >= this.data.length) {
            throw "Memory access violation at " + address;
        }

        this.lastAccess = address;
        this.data[address] = value;
    }
    store16(address: number, value: number) {

        if (address < 0 || address + 1 >= this.data.length) {
            throw "Memory access violation at " + address;
        }
        this.lastAccess = address;
        this.data[address] = (value >> 8) & 0xFF;
        this.data[address + 1] = value & 0xFF;
    }

    constructor() {
        this.data = Array(4096)
        this.lastAccess = -1;
        for (var i = 0, l = this.data.length; i < l; i++) {
            this.data[i] = 0;
        }
    }
}


