// Syntax highlight for JS
const asm = (el) => {
    const keywords = [
        'MOV','ADD','SUB','INC','DEC','MUL','DIV',
        'AND','OR','XOR','NOT','SHL','SHR','SAL','SAR',
        'CMP','JMP','JC','JNC','JZ','JNZ','JA','JNBE','JAE','JNB',
        'JB','JNAE','JBE','JNA','JE','JNE','CALL','RET','PUSH','POP','HLT','DB'
    ];
    const registers = ['A','B','C','D','SP'];

    const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
    const regRegex = new RegExp(`\\b(${registers.join('|')})\\b`, 'g');
    const labelRegex = /^\s*(\.?\w+):/;
    const numRegex = /\b(0x[\da-fA-F]+|0o[0-7]+|\d+[db]?|[01]+b)\b/g;
    const strRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
    const commentRegex = /(;.*)$/;

    for (const node of el.children) {
        const raw = node.innerText;

        let line = raw
            .replace(strRegex, '<span class="hl strings">$&</span>') // Strings
            .replace(commentRegex, '<span class="hl comments">$1</span>')               // Comments
            .replace(labelRegex, '<span class="hl labels" >$1</span>:')        // Labels
            .replace(kwRegex, '<span class="hl instruction">$1</span>')            // Instructions
            .replace(regRegex, '<span class="hl register">$1</span>')           // Registers
            .replace(numRegex, '<span class="hl number">$1</span>'); // Numbers

        node.innerHTML = line;
    }
};

const editor = (el, highlight = asm, tab = '    ') => {
    const caret = () => {
        const range = window.getSelection().getRangeAt(0);
        const prefix = range.cloneRange();
        prefix.selectNodeContents(el);
        prefix.setEnd(range.endContainer, range.endOffset);
        return prefix.toString().length;
    };

    const setCaret = (pos, parent = el) => {
        for (const node of parent.childNodes) {
            if (node.nodeType == Node.TEXT_NODE) {
                if (node.length >= pos) {
                    const range = document.createRange();
                    const sel = window.getSelection();
                    range.setStart(node, pos);
                    range.collapse(true);
                    sel.removeAllRanges();
                    sel.addRange(range);
                    return -1;
                } else {
                    pos = pos - node.length;
                }
            } else {
                pos = setCaret(pos, node);
                if (pos < 0) {
                    return pos;
                }
            }
        }
        return pos;
    };

    highlight(el);

    el.addEventListener('keydown', e => {
        if (e.which === 9) {
            const pos = caret() + tab.length;
            const range = window.getSelection().getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(tab));
            highlight(el);
            setCaret(pos);
            e.preventDefault();
        }
    });

    el.addEventListener('keyup', e => {
        if (e.keyCode >= 0x30 || e.keyCode == 0x20) {
            const pos = caret();
            highlight(el);
            setCaret(pos);
        }
    });
};

// Turn div into an editable assembler editor
const el = document.querySelector('.editor');
const lines = [
    '; Simple example',
    '; Writes Hello World to the output',
    '   JMP start',
    'hello: DB "Hello World!" ; Variable',
    '       DB 0\t; String terminator',
    'start:',
    '   MOV D, hello    ; Point to var',
    '   PUSH 925\t; Point to output',
    '   CALL print',
    '   HLT             ; Stop execution',
    'print:\t\t; print(D:*from, SP+2:*to)',
    '   PUSH C',
    '   PUSH B',
    '   MOV C, [SP+6]',
    '   MOV B, 0',
    '.loop:',
    '   MOV A, [D]	; Get char from var',
    '   MOV [C], A	; Write to output',
    '   INC D',
    '   INC C',
    '   INC D',
    '   INC C',
    '   CMP B, [D]	; Check if end',
    '   JNZ .loop	; jump if not',
    '   POP B',
    '   POP C',
    '   RET',
];

// clear existing content
el.innerHTML = '';

// populate editor with one <div> per line
lines.forEach(line => {
    const row = document.createElement('div');
    row.textContent = line;
    el.appendChild(row);
});

el.focus();
editor(el);