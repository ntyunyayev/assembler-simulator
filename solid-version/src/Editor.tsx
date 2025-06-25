import { createSignal, onMount } from 'solid-js';
import { assembler } from './core/assembler';
import { CPU } from './core/cpu';
interface AssemblyEditorProps {}

export default function AssemblyEditor(props: AssemblyEditorProps) {
  const [error, setError] = createSignal<string>('');
  let editorRef: HTMLDivElement | undefined;

  const keywords: string[] = [
    'MOV','ADD','SUB','INC','DEC','MUL','DIV',
    'AND','OR','XOR','NOT','SHL','SHR','SAL','SAR',
    'CMP','JMP','JC','JNC','JZ','JNZ','JA','JNBE','JAE','JNB',
    'JB','JNAE','JBE','JNA','JE','JNE','CALL','RET','PUSH','POP','HLT','DB'
  ];
  const registers: string[] = ['A','B','C','D','SP'];

  const kwRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');
  const regRegex = new RegExp(`\\b(${registers.join('|')})\\b`, 'g');
  const labelRegex = /^\s*(\.?\w+):/;
  const numRegex = /\b(0x[\da-fA-F]+|0o[0-7]+|\d+[db]?|[01]+b)\b/g;
  const strRegex = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
  const commentRegex = /(;.*)$/;

  const highlight = (el: HTMLElement): void => {
    for (const node of el.children) {
      const raw = (node as HTMLElement).innerText;

      let line = raw
        .replace(strRegex, '<span class="hl strings">$&</span>')
        .replace(commentRegex, '<span class="hl comments">$1</span>')
        .replace(labelRegex, '<span class="hl labels">$1</span>:')
        .replace(kwRegex, '<span class="hl instruction">$1</span>')
        .replace(regRegex, '<span class="hl register">$1</span>')
        .replace(numRegex, '<span class="hl number">$1</span>');

      (node as HTMLElement).innerHTML = line;
    }
  };

  const getCaret = (el: HTMLElement): number => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;
    
    const range = selection.getRangeAt(0);
    const prefix = range.cloneRange();
    prefix.selectNodeContents(el);
    prefix.setEnd(range.endContainer, range.endOffset);
    return prefix.toString().length;
  };

  const setCaret = (pos: number, parent: HTMLElement = editorRef!): number => {
    for (const node of parent.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent && node.textContent.length >= pos) {
          const range = document.createRange();
          const sel = window.getSelection();
          if (sel) {
            range.setStart(node, pos);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
          }
          return -1;
        } else {
          pos = pos - (node.textContent?.length || 0);
        }
      } else {
        pos = setCaret(pos, node as HTMLElement);
        if (pos < 0) {
          return pos;
        }
      }
    }
    return pos;
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.ctrlKey) return;
    if (e.which === 9) {
      if (!editorRef) return;
      const pos = getCaret(editorRef) + 2;
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        range.insertNode(document.createTextNode('  '));
        highlight(editorRef);
        setCaret(pos);
      }
      e.preventDefault();
    }
  };

  const handleKeyUp = (e: KeyboardEvent): void => {
    if (e.ctrlKey || !editorRef) return;
    if (e.keyCode >= 0x30 || e.keyCode === 0x20 || e.key === "Backspace") {
      const pos = getCaret(editorRef);
      highlight(editorRef);
      setCaret(pos);
    }
  };

  const assemble = (): void => {
    try {
      var {code, mapping, labels} = assembler.go(editorRef?.innerText as string);
      console.log("aaah")
      for (var i = 0, l = code.length; i < l; i++) {
        CPU.memory.store(i, code[i]);
    }
    console.log("DONE ! ")
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  onMount(() => {
    if (editorRef) {
      editorRef.focus();
      highlight(editorRef);
    }
  });

  //@ts-ignore
  window.CPU = CPU

  return (
    <div class='editor-container'>
      <div hidden={!error()}>
        ERROR: {error()}
      </div>
      
      <div>
        <h4>
          Code{' '}
          <small>
            (<a href="./instruction-set.html" target="_blank">
              Instruction Set
            </a>)
          </small>
        </h4>
      </div>
      
      <div>
        <div 
          ref={editorRef}
          contentEditable={true}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          spellcheck={false}
          class="editor"
        >
          <div>; Welcome to Assembly Editor</div>
          <div>MOV A, 10</div>
          <div>ADD B, A</div>
          <div>HLT</div>
        </div>
        
        <button 
          type="button" 
          onClick={assemble}
        >
          Assemble
        </button>
      </div>
    </div>
  );
}