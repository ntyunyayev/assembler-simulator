import { DEVICES } from "./devices.js";
import { type IMemory } from "./memory.js";
import { opcodes } from "./opcodes.js";
export class LittleCPU {
    fault?: boolean
    maxSP!: number;
    minSP!: number; 
    gpr!: [number, number, number, number];
    sp!: number;
    ip!: number;
    dp!: number;
    zero!: boolean;
    carry!: boolean; 
    memory: IMemory;

    step() {
        if (this.fault === true) {
            throw "FAULT. Reset to continue.";
        }

        try {
            var checkGPR = (reg: number) => {
                if (reg < 0 || reg >= this.gpr.length) {
                    throw "Invalid register: " + reg;
                } else {
                    return reg;
                }
            };

            var checkGPR_SP = (reg: number) => {
                if (reg < 0 || reg >= 1 + this.gpr.length) {
                    throw "Invalid register: " + reg;
                } else {
                    return reg;
                }
            };

            var setGPR_SP = (reg: number, value: number) => {
                if (reg >= 0 && reg < this.gpr.length) {
                    this.gpr[reg] = value;
                } else if (reg == this.gpr.length) {
                    this.sp = value;

                    // Not likely to happen, since we always get here after checkOpertion().
                    if (this.sp < this.minSP) {
                        throw "Stack overflow";
                    } else if (this.sp > this.maxSP) {
                        throw "Stack underflow";
                    }
                } else {
                    throw "Invalid register: " + reg;
                }
            };

            var getGPR_SP = (reg: number) => {
                if (reg >= 0 && reg < this.gpr.length) {
                    return this.gpr[reg];
                } else if (reg == this.gpr.length) {
                    return this.sp;
                } else {
                    throw "Invalid register: " + reg;
                }
            };

            var indirectRegisterAddress = (value: number) => {
                var reg = value % 8;

                var base;
                if (reg < this.gpr.length) {
                    base = this.gpr[reg];
                } else {
                    base = this.sp;
                }

                var offset = Math.floor(value / 8);
                if (offset > 15) {
                    offset = offset - 32;
                }
                return base! + offset;
            };

            var checkOperation = (value:number) => {
                this.zero = false;
                this.carry = false;

                if (value >= 65536) {
                    this.carry = true;
                    value = value % 65536;
                } else if (value === 0) {
                    this.zero = true;
                } else if (value < 0) {
                    this.carry = true;
                    value = 65536 - (-value) % 65536;
                }

                return value;
            };

            var jump = (newIP: number) => {
                if (newIP < 0 || newIP >= this.memory.data.length) {
                    throw "IP outside this.memory";
                } else {
                    this.ip = newIP;
                }
            };

            var push = (value: number) => {
                this.sp -= 2;
                this.memory.store16(this.sp, value);
                if (this.sp < this.minSP) {
                    throw "Stack overflow";
                }
            };

            var pop = () => {
                var value = this.memory.load16(this.sp);
                this.sp += 2;
                if (this.sp > this.maxSP) {
                    throw "Stack underflow";
                }
                return value;
            };

            var division = (divisor: number) => {
                if (divisor === 0) {
                    throw "Division by 0";
                }

                return Math.floor(this.gpr[0] / divisor);
            };

            if (this.ip < 0 || this.ip >= this.memory.data.length) {
                throw "Instruction pointer is outside of this.memory";
            }

            var regTo, regFrom, memFrom, memTo, number;
            var instr = this.memory.load16(this.ip);
            this.ip++;
            switch (instr) {
                case opcodes.NONE:
                    return false; // Abort step
                case opcodes.MOV_REG_TO_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    setGPR_SP(regTo, getGPR_SP(regFrom)!);
                    this.ip++;
                    break;
                case opcodes.MOV_ADDRESS_TO_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.MOV_REGADDRESS_TO_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.MOV_REG_TO_ADDRESS:
                    memTo = this.memory.load16(++this.ip);
                    this.ip++;
                    regFrom = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    this.memory.store16(memTo, getGPR_SP(regFrom)!);
                    this.ip++;
                    break;
                case opcodes.MOV_REG_TO_REGADDRESS:
                    regTo = this.memory.load16(++this.ip);
                    this.ip++;
                    regFrom = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    this.memory.store16(indirectRegisterAddress(regTo), getGPR_SP(regFrom)!);
                    this.ip++;
                    break;
                case opcodes.MOV_NUMBER_TO_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, number);
                    this.ip++;
                    break;
                case opcodes.MOV_NUMBER_TO_ADDRESS:
                    memTo = this.memory.load16(++this.ip);
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.memory.store16(memTo, number);
                    this.ip++;
                    break;
                case opcodes.MOV_NUMBER_TO_REGADDRESS:
                    regTo = this.memory.load16(++this.ip);
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.memory.store16(indirectRegisterAddress(regTo), number);
                    this.ip++;
                    break;
                case opcodes.ADD_REG_TO_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! + getGPR_SP(regFrom)!));
                    this.ip++;
                    break;
                case opcodes.ADD_REGADDRESS_TO_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! + this.memory.load16(indirectRegisterAddress(regFrom))));
                    this.ip++;
                    break;
                case opcodes.ADD_ADDRESS_TO_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! + this.memory.load16(memFrom)));
                    this.ip++;
                    break;
                case opcodes.ADD_NUMBER_TO_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! + number));
                    this.ip++;
                    break;
                case opcodes.SUB_REG_FROM_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! - this.gpr[regFrom]!));
                    this.ip++;
                    break;
                case opcodes.SUB_REGADDRESS_FROM_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! - this.memory.load16(indirectRegisterAddress(regFrom))));
                    this.ip++;
                    break;
                case opcodes.SUB_ADDRESS_FROM_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! - this.memory.load16(memFrom)));
                    this.ip++;
                    break;
                case opcodes.SUB_NUMBER_FROM_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! - number));
                    this.ip++;
                    break;
                case opcodes.INC_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! + 1));
                    this.ip++;
                    break;
                case opcodes.DEC_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    setGPR_SP(regTo, checkOperation(getGPR_SP(regTo)! - 1));
                    this.ip++;
                    break;
                case opcodes.CMP_REG_WITH_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    checkOperation(getGPR_SP(regTo)! - getGPR_SP(regFrom)!);
                    this.ip++;
                    break;
                case opcodes.CMP_REGADDRESS_WITH_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    checkOperation(getGPR_SP(regTo)! - this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.CMP_ADDRESS_WITH_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    checkOperation(getGPR_SP(regTo)! - this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.CMP_NUMBER_WITH_REG:
                    regTo = checkGPR_SP(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    checkOperation(getGPR_SP(regTo)! - number);
                    this.ip++;
                    break;
                case opcodes.JMP_REGADDRESS:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    jump(this.gpr[regTo]!);
                    break;
                case opcodes.JMP_ADDRESS:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    jump(number);
                    break;
                case opcodes.JC_REGADDRESS:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    if (this.carry) {
                        jump(this.gpr[regTo]!);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JC_ADDRESS:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    if (this.carry) {
                        jump(number);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JNC_REGADDRESS:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    if (!this.carry) {
                        jump(this.gpr[regTo]!);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JNC_ADDRESS:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    if (!this.carry) {
                        jump(number);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JZ_REGADDRESS:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    if (this.zero) {
                        jump(this.gpr[regTo]!);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JZ_ADDRESS:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    if (this.zero) {
                        jump(number);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JNZ_REGADDRESS:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    if (!this.zero) {
                        jump(this.gpr[regTo]!);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JNZ_ADDRESS:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    if (!this.zero) {
                        jump(number);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JA_REGADDRESS:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    if (!this.zero && !this.carry) {
                        jump(this.gpr[regTo]!);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JA_ADDRESS:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    if (!this.zero && !this.carry) {
                        jump(number);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JNA_REGADDRESS: // JNA REG
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    if (this.zero || this.carry) {
                        jump(this.gpr[regTo]!);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.JNA_ADDRESS:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    if (this.zero || this.carry) {
                        jump(number);
                    } else {
                        this.ip++;
                    }
                    break;
                case opcodes.PUSH_REG:
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    push(this.gpr[regFrom]!);
                    this.ip++;
                    break;
                case opcodes.PUSH_REGADDRESS:
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    push(this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.PUSH_ADDRESS:
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    push(this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.PUSH_NUMBER:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    push(number);
                    this.ip++;
                    break;
                case opcodes.POP_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[regTo] = pop();
                    this.ip++;
                    break;
                case opcodes.CALL_REGADDRESS:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    push(this.ip + 2);
                    jump(this.gpr[regTo]!);
                    break;
                case opcodes.CALL_ADDRESS:
                    number = this.memory.load16(++this.ip);
                    push(this.ip + 2);
                    jump(number);
                    break;
                case opcodes.RET:
                    let jump_addr = pop();
                    jump(jump_addr);
                    break;
                case opcodes.MUL_REG: // A = A * REG
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[0] = checkOperation(this.gpr[0] * this.gpr[regFrom]!);
                    this.ip++;
                    break;
                case opcodes.MUL_REGADDRESS: // A = A * [REG]
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[0] = checkOperation(this.gpr[0] * this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.MUL_ADDRESS: // A = A * [NUMBER]
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[0] = checkOperation(this.gpr[0] * this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.MUL_NUMBER: // A = A * NUMBER
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[0] = checkOperation(this.gpr[0] * number);
                    this.ip++;
                    break;
                case opcodes.DIV_REG: // A = A / REG
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[0] = checkOperation(division(this.gpr[regFrom]!));
                    this.ip++;
                    break;
                case opcodes.DIV_REGADDRESS: // A = A / [REG]
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[0] = checkOperation(division(this.memory.load16(indirectRegisterAddress(regFrom))));
                    this.ip++;
                    break;
                case opcodes.DIV_ADDRESS: // A = A / [NUMBER]
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[0] = checkOperation(division(this.memory.load16(memFrom)));
                    this.ip++;
                    break;
                case opcodes.DIV_NUMBER: // A = A / NUMBER
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[0] = checkOperation(division(number));
                    this.ip++;
                    break;
                case opcodes.AND_REG_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! & this.gpr[regFrom]!);
                    this.ip++;
                    break;
                case opcodes.AND_REGADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! & this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.AND_ADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! & this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.AND_NUMBER_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! & number);
                    this.ip++;
                    break;
                case opcodes.OR_REG_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! | this.gpr[regFrom]!);
                    this.ip++;
                    break;
                case opcodes.OR_REGADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! | this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.OR_ADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! | this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.OR_NUMBER_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! | number);
                    this.ip++;
                    break;
                case opcodes.XOR_REG_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! ^ this.gpr[regFrom]!);
                    this.ip++;
                    break;
                case opcodes.XOR_REGADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! ^ this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.XOR_ADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! ^ this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.XOR_NUMBER_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! ^ number);
                    this.ip++;
                    break;
                case opcodes.NOT_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[regTo] = checkOperation(~this.gpr[regTo]!);
                    this.ip++;
                    break;
                case opcodes.SHL_REG_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! << this.gpr[regFrom]!);
                    this.ip++;
                    break;
                case opcodes.SHL_REGADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! << this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.SHL_ADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! << this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.SHL_NUMBER_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! << number);
                    this.ip++;
                    break;
                case opcodes.SHR_REG_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! >>> this.gpr[regFrom]!);
                    this.ip++;
                    break;
                case opcodes.SHR_REGADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    regFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! >>> this.memory.load16(indirectRegisterAddress(regFrom)));
                    this.ip++;
                    break;
                case opcodes.SHR_ADDRESS_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    memFrom = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! >>> this.memory.load16(memFrom));
                    this.ip++;
                    break;
                case opcodes.SHR_NUMBER_WITH_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.gpr[regTo] = checkOperation(this.gpr[regTo]! >>> number);
                    this.ip++;
                    break;
                case opcodes.MOV_DP_TO_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.gpr[regTo] = this.dp;
                    this.ip++;
                    break;

                case opcodes.MOV_REG_TO_DP:
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.dp = this.gpr[regFrom];
                    this.ip++;
                    break;

                case opcodes.MOV_NUMBER_TO_DP:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.dp = number;
                    this.ip++;
                    break;

                case opcodes.MOV_DPADDRESS_TO_REG:
                    regTo = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    var offset = this.memory.load16(++this.ip); // Declare offset here
                    this.ip++;
                    setGPR_SP(regTo, this.memory.load16(this.dp + offset));
                    this.ip++;
                    break;

                case opcodes.MOV_REG_TO_DPADDRESS:
                    var offset = this.memory.load16(++this.ip); // Declare offset here
                    this.ip++;
                    regFrom = checkGPR(this.memory.load16(++this.ip));
                    this.ip++;
                    this.memory.store16(this.dp + offset, getGPR_SP(regFrom)!);
                    this.ip++;
                    break;

                case opcodes.ADD_NUMBER_TO_DP:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.dp = checkOperation(this.dp + number);
                    this.ip++;
                    break;

                case opcodes.SUB_NUMBER_FROM_DP:
                    number = this.memory.load16(++this.ip);
                    this.ip++;
                    this.dp = checkOperation(this.dp - number);
                    this.ip++;
                    break;
                default:
                    throw "Invalid op code: " + instr;
            }

            return true;
        } catch (e) {
            this.fault = true;
            throw e;
        }
    }
    reset() {
        this.maxSP = DEVICES.base.end();
        this.minSP = DEVICES.base.start();
        this.gpr = [0, 0, 0, 0];
        this.sp = this.maxSP;
        this.ip = DEVICES.base.start();
        this.dp = DEVICES.screen.start();
        this.zero = false;
        this.carry = false;
        this.fault = false;
        this.memory.reset()
    }
    constructor(memory: IMemory) {
        this.memory = memory;
        this.reset()
   
    }
}

