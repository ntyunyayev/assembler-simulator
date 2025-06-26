import { onMount, createEffect, onCleanup } from 'solid-js';
import { assembler } from './core/assembler';
import { CPU } from './ReactiveCPU';
import { getStateContext } from './stateContext';
import "./Editor.css"
export default function Editor() {
  const [state, setState] = getStateContext();

  let textareaRef: HTMLTextAreaElement | undefined;
  let backdropRef: HTMLDivElement | undefined;
  let updateTimer: number;

  // Micro syntax highlighter for Assembly
  const highlight = (code: string): string => {
    const keywords = /\b(MOV|ADD|SUB|INC|DEC|MUL|DIV|AND|OR|XOR|NOT|SHL|SHR|SAL|SAR|CMP|JMP|JC|JNC|JZ|JNZ|JA|JNBE|JAE|JNB|JB|JNAE|JBE|JNA|JE|JNE|CALL|RET|PUSH|POP|HLT|DB)\b/gi;
    const registers = /\b([ABCD]|SP)\b/g;
    const numbers = /\b(0x[\da-fA-F]+|0o[0-7]+|\d+[db]?|[01]+b)\b/g;
    const strings = /(["'`])(?:(?=(\\?))\2.)*?\1/g;
    const comments = /(;.*$)/gm;
    const labels = /^(\s*\.?\w+):/gm;
    
    return code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(strings, '<span class="hl strings">$&</span>')
      .replace(comments, '<span class="hl comments">$&</span>')
      .replace(labels, '<span class="hl labels">$1</span>:')
      .replace(keywords, '<span class="hl instruction">$&</span>')
      .replace(registers, '<span class="hl register">$&</span>')
      .replace(numbers, '<span class="hl number">$&</span>');
  };

  const updateHighlight = (): void => {
    if (backdropRef && textareaRef) {
      backdropRef.innerHTML = highlight(state.code);
      backdropRef.scrollTop = textareaRef.scrollTop;
      backdropRef.scrollLeft = textareaRef.scrollLeft;
    }
  };

  const handleInput = (e: Event): void => {
    const target = e.target as HTMLTextAreaElement;
    setState("code", target.value);
    
    // Debounce highlighting for performance
    clearTimeout(updateTimer);
    updateTimer = setTimeout(updateHighlight, 50);
  };

  const handleScroll = (e: Event): void => {
    const target = e.target as HTMLTextAreaElement;
    if (backdropRef) {
      backdropRef.scrollTop = target.scrollTop;
      backdropRef.scrollLeft = target.scrollLeft;
    }
  };

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      const newValue = target.value.substring(0, start) + '  ' + target.value.substring(end);
      target.value = newValue;
      target.selectionStart = target.selectionEnd = start + 2;
      
      setState("code", newValue);
    }
  };

  const assemble = (): void => {
    try {
      const { code: machineCode, mapping, labels } = assembler.go(state.code);
      
      for (let i = 0; i < machineCode.length; i++) {
        CPU.memory.store(i, machineCode[i]);
      }
      
      setState("labels", Object.entries(labels));
      setState("error", "");
    } catch (err: any) {
      setState("error", `${err.error} (ligne ${err.line})`);
    }
  };

  const clearEditor = (): void => {
    setState("code", '');
    setState("error", "");
  };

  // Update highlighting when code changes
  createEffect(() => {
    updateHighlight();
  });

 
  onCleanup(() => {
    clearTimeout(updateTimer);
  });

  return (
    <div class="editor-container">
      {/* Error Display */}
      <div class="error-message" classList={{ hidden: !state.error }}>
        {state.error}
      </div>

      {/* Header */}
      <div class="editor-header">
        <h4>
          Code{' '}
          <small>
            (<a href="./instruction-set.html" target="_blank">
              Instruction Set
            </a>)
          </small>
        </h4>
      </div>

      {/* Editor */}
      <div class="prism-editor">
        <div 
          ref={backdropRef}
          class="editor-backdrop"
        />
        <textarea
          ref={textareaRef}
          class="editor-textarea"
          value={state.code}
          onInput={handleInput}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          spellcheck={false}
          placeholder="Enter assembly code..."
        />
      </div>

      {/* Controls */}
      <div class="editor-controls">
        <button type="button" onClick={assemble} class="btn-primary">
          Assemble
        </button>
        <button type="button" onClick={clearEditor} class="btn-secondary">
          Clear
        </button>
      </div>
   

    </div>
  );
}