import { Runner } from '../src/runner.js';
import * as fs from 'fs';
import * as assert from 'assert';
import { describe, it } from 'mocha';

/* Constants */
const outputFileName = "out.dat";
const infinity = 2 << 17;

/* --- Helper Functions --- */

function run_runner(runner: Runner, code: string): void {
    try {
        runner.run(code);
    } catch (error: any) {
        assert.fail(`Execution Error: ${error?.message || error}`);
    }
}

function runner_load16(runner: Runner, address: number): number {
    return runner.emulator.cpu.memory.load16(address);
}

function runner_get_register(runner: Runner, reg: string): number {
    const regs: Record<string, number> = { "A": 0, "B": 1, "C": 2, "D": 3 };
    return runner.emulator.cpu.gpr[regs[reg]];
}

function runner_get_flags(runner: Runner, flag: 'zero' | 'carry'): boolean {
    return (runner.emulator.cpu as any)[flag];
}

function check_equality(code: string, expected: Record<string, any>): void {
    const runner = new Runner();
    run_runner(runner, code);

    const res = fs.readFileSync(outputFileName, 'utf8');
    const parsedRes = JSON.parse(res);
    const labels: Record<string, number> = parsedRes.labels;

    for (const key in expected) {
        let actual: any = infinity;
        const expectedVal = expected[key];

        if (['A', 'B', 'C', 'D'].includes(key)) {
            actual = runner_get_register(runner, key);
            assert.strictEqual(actual, expectedVal, `Register ${key} mismatch`);
        }
        else if (['zero', 'carry'].includes(key) && typeof expectedVal === 'boolean') {
            actual = runner_get_flags(runner, key as 'zero' | 'carry');
            assert.strictEqual(actual, expectedVal, `Flag ${key} mismatch`);
        }
        else {
            if (!(key in labels)) {
                assert.fail(`Label "${key}" not found in assembly.`);
            }
            const addr = labels[key];
            if (Array.isArray(expectedVal)) {
                for (let i = 0; i < expectedVal.length; i++) {
                    actual = runner_load16(runner, addr + (2 * i));
                    assert.strictEqual(actual, expectedVal[i], `Array ${key}[${i}] mismatch`);
                }
            } else {
                actual = runner_load16(runner, addr);
                assert.strictEqual(actual, expectedVal, `Memory variable "${key}" mismatch`);
            }
        }
    }
}

/* --- Tests --- */

describe('ASM', function() {
    describe('INC', function() {
        const valsToTest = [0, 16, 1024, 13];
        for (let i = 0; i < valsToTest.length; i++) {
            it('Testing INC ' + valsToTest[i], function() {
                v = valsToTest[i];
                let code =
                    `
MOV A, [x]
INC A
MOV x, A
HLT
x: DB ${v}
`;
                check_equality(code, { "x": v + 1 })
            });
        };
    });
});


describe('Syllabus', function() {
    describe('MOV', function() {
        it('Testing syllabus MOV', function() {
            let code =
                `
MOV A, 1
MOV B, 2
MOV A, B
`;
            check_equality(code, { "A": 2, "B": 2 })
        });
    });
});

describe('Syllabus', function() {
    describe('MUL', function() {
        it('Testing syllabus MUL', function() {
            let code =
                `
MOV A, 9
MOV B, 2
MUL B
`;
            check_equality(code, { "A": 18 })
        });
    });
});

describe('Syllabus', function() {
    describe('MUL', function() {
        it('Testing syllabus MUL', function() {
            let code =
                `
MOV A, 9
MUL 3
`;
            check_equality(code, { "A": 27 })
        });
    });
});

describe('Syllabus', function() {
    describe('DIV', function() {
        it('Testing syllabus DIV 1', function() {
            let code =
                `
MOV A, 24
DIV 3
`;
            check_equality(code, { "A": 8 })
        });
    });
});


describe('Syllabus', function() {
    describe('DIV', function() {
        it('Testing syllabus DIV 2', function() {
            let code =
                `
MOV A, 35
MOV B, 7
DIV B
`;
            check_equality(code, { "A": 5 })
        });
    });
});

describe('Syllabus', function() {
    describe('DB', function() {
        it('DB city test', function() {
            let code =
                `
zero: DB 0x0000
lln: DB 1348
charleroi: DB 6000
`;
            check_equality(code, { "zero": 0, "lln": 1348, "charleroi": 6000 })
        });
    });
});


describe('Syllabus', function() {
    describe('ADD', function() {
        it('ADD two variables', function() {
            let code =
                `
MOV A, [x]
MOV B, [y]
ADD A, B
HLT
; Variables et données du programme
x: DB 3
y: DB 7
`;
            check_equality(code, { "A": 10 })
        });
    });
});



describe('Syllabus', function() {
    describe('GENERAL', function() {
        it('Testing syllabus computation', function() {
            let code =
                `
MOV A, [y]
 ; place la valeur de la variable y dans A
MUL A
 ; multiplie le contenu de A par lui-même
MOV B, A
 ; sauvegarde du résultat dans le registre B
MOV A, [x]
 ; place la valeur de la variable x dans A
MUL A
 ; multiplie le contenu de A par lui-même
SUB A, B
 ; soustraction des deux carrés
MOV z1, A
 ; sauvegarde du résultat du calcul dans la variable z1
MOV A, [x]
 ; place la valeur de la variable x dans A
SUB A, [y]
 ; calcul de x-y
MOV B, [x]
 ; place la valeur de la variable x dans B
ADD B, [y]
 ; calcul de x+y
MUL B
MOV z2, A
 ; sauvegarde du résultat du calcul dans la variable z2
HLT
; Variables et données du programme
x: DB 9
y: DB 2
z1: DB 0
z2: DB 0
`;
            check_equality(code, { "z1": 77, "z2": 77 })
        });
    });
});



describe('Syllabus', function() {
    describe('CMP', function() {
        it('Simple CMP test 1', function() {
            let code =
                `
MOV A, 2
MOV B, 3
MOV C, 2
CMP A, B
`;
            check_equality(code, { "zero": false })
        });
    });
});

describe('Syllabus', function() {
    describe('CMP', function() {
        it('Simple CMP test 2', function() {
            let code =
                `
MOV A, 2
MOV B, 3
MOV C, 2
CMP A, C
`;
            check_equality(code, { "zero": true })
        });
    });
});


describe('Syllabus', function() {
    describe('overflow', function() {
        it('overflow 1', function() {
            let code =
                `
MOV A, 65534
INC A
`;
            check_equality(code, { "carry": false })
        });
    });
});

describe('Syllabus', function() {
    describe('overflow', function() {
        it('overflow 2', function() {
            let code =
                `
MOV A, 65534
INC A
INC A
`;
            check_equality(code, { "carry": true })
        });
    });
});


describe('Syllabus', function() {
    describe('overflow', function() {
        it('overflow 3', function() {
            let code =
                `
MOV A, 40000
MUL A
`;
            check_equality(code, { "carry": true })
        });
    });
});


describe('Syllabus', function() {
    describe('Jump', function() {
        it('First jump', function() {
            let code =
                `
MOV A, 123
MOV B, 123
CMP A, B
JE equal
ne:
 MOV C, 0
JMP suite:
equal:
 MOV C, 1
suite:
 HLT
`;
            check_equality(code, { "C": 1 })
        });
    });
});


describe('Syllabus', function() {
    describe('Jump', function() {
        it('JZ test', function() {
            let code =
                `
MOV A, 1
DEC A
JZ zero
nz: MOV C, 1
JMP suite:
zero: MOV C, 0
suite: HLT
`;
            check_equality(code, { "C": 0 })
        });
    });
});


describe('Syllabus', function() {
    describe('Jump', function() {
        it('Abs value computation', function() {
            let code =
                `
JMP start
; déclarations des variables et constantes
x:
 DB 12
y:
 DB 9
start:
 MOV A, [x]
CMP A, [y]
JBE petit
MOV C, A
SUB C, [y]
JMP fin
petit:
 MOV C, [y]
SUB C, A
fin:
 HLT
`;
            check_equality(code, { "C": 3 })
        });
    });
});



describe('Syllabus', function() {
    describe('Jump', function() {
        it('No overflow check', function() {
            let code =
                `
MOV A, 1000
MOV B, 123
MUL B
JNC correct
; dépassement de capacité
HLT
correct: MOV B, D
`;
            check_equality(code, { "B": 123 })
        });
    });
});


describe('Syllabus', function() {
    describe('Jump', function() {
        it('MAX function', function() {
            let code =
                `
JMP start
x:
 DB 12
y:
 DB 9
max:
 DB 0
start:
 MOV A, [x]
MOV B, [y]
CMP A, B
JA xmax
MOV max, B
JMP fin
xmax:
 MOV max, A
fin:
 HLT
`;
            check_equality(code, { "max": 12 })
        });
    });
});


describe('Syllabus', function() {
    describe('Loops', function() {
        it('Simple loop', function() {
            let code =
                `
JMP boucle
; variables
x:
 DB 1
n:
 DB 1
boucle: MOV A, [n]
CMP A, 10
JAE fin
INC A
MOV n, A
MOV B, [x]
ADD B, B
MOV x, B
JMP boucle
fin:
 HLT
`;
            check_equality(code, { "B": 512 })
        });
    });
});




describe('Syllabus', function() {
    describe('Structures', function() {
        it('coordinates structures v1', function() {
            let code =
                `
JMP start
; mis à 1 si égales, 0 sinon
eq:
 DB 42
; premier point
CAx:
 DB 1 ; coordonnée x
CAy:
 DB 2 ; coordonnée y
; second point
CBx:
 DB 1 ; coordonnée x
CBy:
 DB 7 ; coordonnée y
start: MOV A, [CAx]
MOV B, [CBx]
CMP A, B
JNE diff
MOV A, [CAy]
MOV B, [CBy]
CMP A, B
JNE diff
egal:
MOV eq, 1
JMP fin
diff:
MOV eq, 0
fin:
 HLT
`;
            check_equality(code, { "eq": 0 })
        });
    });
});




describe('Syllabus', function() {
    describe('Structures', function() {
        it('coordinates structures v2', function() {
            let code =
                `
JMP start
; mis à 1 si égales, 0 sinon
eq:
 DB 42
; coordonnées premier point
CA:
 DB 1
DB 2
; coordonnées second point
CB:
 DB 1
DB 2
start:
MOV A, CA
MOV B, CB
MOV C, [A]
MOV D, [B]
CMP C, D
JNE diff
MOV C, [A+2]
MOV D, [B+2]
CMP C, D
JNE diff
egal:
MOV eq, 1
JMP fin
diff:
MOV eq, 0
fin:
HLT
`;
            check_equality(code, { "eq": 1 })
        });
    });
});

describe('Syllabus', function() {
    describe('Structures', function() {
        it('Sum days', function() {
            let code =
                `
 JMP start
 ; variables
 jours: DB 0
 mois: DB 31
 DB 28
 DB 31
 DB 30
 DB 31
 DB 30
 DB 31
 DB 31
 DB 30
 DB 31
 DB 30
 DB 31
 start:
 MOV C, 0
 ; index dans le tableau
 boucle:
 MOV A, C
 MUL 2
 ADD A, mois ; adresse en mémoire du Ceme mois
 MOV B, [A]
 ADD B, [jours]
 MOV jours, B
 INC C
 CMP C,11
 JA fin
 JMP boucle
 fin:
 HLT
`;
            check_equality(code, { "jours": 365 })
        });
    });
});

describe('Syllabus', function() {
    describe('Structures', function() {
        it('Count occurences', function() {
            let code =
                `
JMP start
; Compte le nombre d'occurrences du caractère char dans la chaine string
count: DB 0
char:
 DB "o"
string:
DB "Hello World!" ; Chaîne de caractères
DB 0
 ; Marqueur de fin de chaîne
start:
MOV C, [char]
 ; caractère à rechercher
MOV D, 0
 ; index de la position dans la chaîne
boucle:
MOV A,D
MUL 2
ADD A, string
CMP C, [A]
JNE suite
MOV B, [count]
INC B
MOV count, B
suite:
INC D
 ; incrément indice boucle
MOV B, 0
CMP B, [A]
 ; fin de chaîne ?
JNE boucle
fin:
HLT
`;
            check_equality(code, { "count": 2 })
        });
    });
});



describe('Syllabus', function() {
    describe('Structures', function() {
        it('compteur', function() {
            let code =
                `
JMP start
x:
 DB 0
compteur:
 DB 0
start:
 MOV A, 123
PUSH A
PUSH B
PUSH C
PUSH D
CALL COMPTE
POP D
POP C
POP B
POP A
ADD A, [compteur]
MOV x, A
HLT
COMPTE:
MOV A, [compteur]
INC A
MOV compteur, A
RET
`;
            check_equality(code, { "compteur": 1, "x": 124 })
        });
    });
});


describe('Syllabus', function() {
    describe('Functions', function() {
        it('MIN', function() {
            let code =
                `
JMP start
arg1: DB 5
arg2: DB 10
start:
MOV D, [arg1]
 ; premier argument
PUSH [arg2]
 ; second argument
CALL min
ADD SP, 2
HLT
min:
MOV A,[SP+2] ; second argument copié dans A
CMP A,D
JBE finmin
MOV A,D
finmin: RET
`;
            check_equality(code, { "A": 5 })
        });
    });
});




describe('Syllabus', function() {
    describe('functions', function() {
        it('setbit', function() {
            let code =
                `
JMP start
x: DB 2
start:
MOV D, 0
PUSH [x]
CALL setbit
MOV x, A
POP A
HLT
setbit:
PUSH B ; préservation de la valeur de B
MOV B, 1
SHL B, D
MOV A, [SP+4]
OR A, B
POP B ; récupération de la valeur de B
RET
`;
            check_equality(code, { "x": 3 })
        });
    });
});



describe('Syllabus', function() {
    describe('functions', function() {
        it('resetbit', function() {
            let code =
                `
JMP start
x: DB 2
start:
MOV D, 1
PUSH [x]
CALL resetbit
MOV x, A
POP A
HLT
resetbit:
PUSH B
MOV B, 1
SHL B, D
NOT B
MOV A, [SP+4]
AND A, B
POP B
RET
`;
            check_equality(code, { "x": 0 })
        });
    });
});



describe('Syllabus', function() {
    describe('functions', function() {
        it('f', function() {
            let code =
                `
MOV D, 3
PUSH 4
PUSH 1
CALL f
ADD SP, 4
HLT

f:
MOV A, [SP+4] ; récupère x
MUL D
ADD A, [SP+2]
RET
`;
            check_equality(code, { "A": 13 })
        });
    });
});




describe('Syllabus', function() {
    describe('functions', function() {
        it('t', function() {
            let code =
                `
JMP start
t: DB 1
DB 2
DB 3
DB 4
DB 5
start:
MOV D, 3 ; valeur à ajouter
PUSH t
 ; adresse du premier élément du tableau
PUSH 5
 ; nombre d'éléments
CALL ajouter_entier
HLT
ajouter_entier:
PUSH B ; préservation du contenu de B
PUSH C ; préservation du contenu de C
MOV B, [SP+8] ; adresse du tableau
MOV C, [SP+6] ; nombre d'éléments

loop:
MOV A, D
ADD A, [B] ; calcule de tableau[i]+entier
MOV [B], A ; sauvegarde du résultat en mémoire
ADD B, 2 ; adresse suivante
DEC C
CMP C, 0
JNE loop
POP B ; récupération du contenu de B
POP C ; récupération du contenu de C
RET
`;
            check_equality(code, { "t": [4, 5, 6, 7, 8] })
        });
    });
});




describe('Syllabus', function() {
    describe('functions', function() {
        it('sumn', function() {
            let code =
                `
JMP start
n: DB 5
start:
MOV D, [n]
CALL sumn
HLT
sumn:
PUSH B
 ; sauvegarde
CMP D,1
JNE recursif
MOV A, D ; n==1, return(n)
POP B
 ; récupération
RET
recursif:
MOV B, D ; on aura besoin de n après
DEC D
CALL sumn ; appel récursif
rec2:
ADD A, B ; résultat dans A
POP B
RET
`;
            check_equality(code, { "A": 15 })
        });
    });
});



describe('Syllabus', function() {
    describe('functions', function() {
        it('fact', function() {
            let code =
                `
JMP start
n: DB 5
start:
MOV D, [n]
CALL fact
HLT
fact:
PUSH B
CMP D,1
JNE suite
MOV A, D
POP B
RET
suite:
MOV B, D
DEC D
CALL fact
MUL B
POP B
RET
`;
            check_equality(code, { "A": 120 })
        });
    });
});
