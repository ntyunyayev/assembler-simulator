import { createStore, type SetStoreFunction } from "solid-js/store";
import { DEVICES } from "../core/devices";

export class ReactiveMemory {
  data: number[];
  private _setData: SetStoreFunction<number[]>;
  lastAccess: number;

  constructor() {
    const [data, setData] = createStore(Array(DEVICES[DEVICES.length-1].end()).fill(0));
    this.data = data;
    this._setData = setData;
    this.lastAccess = -1;
  }

  load(address: number): number {
    if (address < 0 || address >= this.data.length) {
      throw `Memory access violation at ${address}`;
    }

    this.lastAccess = address;
    return this.data[address];
  }

  load16(address: number): number {
    if (address < 0 || address + 1 >= this.data.length) {
      throw `Memory access violation at ${address}`;
    }

    this.lastAccess = address;
    return (this.data[address] << 8) + this.data[address + 1];
  }

  store(address: number, value: number) {
    if (address < 0 || address >= this.data.length) {
      throw `Memory access violation at ${address}`;
    }

    this.lastAccess = address;
    this._setData(address, value); // ✅ only this cell updates
  }

  store16(address: number, value: number) {
    if (address < 0 || address + 1 >= this.data.length) {
      throw `Memory access violation at ${address}`;
    }

    this.lastAccess = address;
    this._setData(address, (value >> 8) & 0xFF);
    this._setData(address + 1, value & 0xFF);
  }
}
