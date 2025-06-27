import { createSignal, onMount, onCleanup, createEffect } from 'solid-js';
import * as monaco from 'monaco-editor';
import { getStateContext } from '../utils/stateContext';
import { CPU } from '../utils/ReactiveCPU';
import CodeActions from './CodeActions';
import '../styles/Editor.css';


export default function Editor() {
  let container: HTMLDivElement | undefined;
  let editor: monaco.editor.IStandaloneCodeEditor | undefined;
  const [state, setState] = getStateContext(); 
  const [breakpoints, setBreakpoints] = createSignal<number[]>([]);
  let currentDecorationIds: string[] = [];

  const languageId = "assembly";
  if (!monaco.languages.getLanguages().some(lang => lang.id === languageId)) {
    monaco.languages.register({ id: languageId });

    const keywords = ['MOV', 'ADD', 'SUB', 'INC', 'DEC', 'MUL', 'DIV', 'AND', 'OR', 'XOR', 'NOT', 'SHL', 'SHR', 'SAL', 'SAR', 'CMP', 'JMP', 'JC', 'JNC', 'JZ', 'JNZ', 'JA', 'JNBE', 'JAE', 'JNB', 'JB', 'JNAE', 'JBE', 'JNA', 'JE', 'JNE', 'CALL', 'RET', 'PUSH', 'POP', 'HLT', 'DB'];
    const registers = ['A', 'B', 'C', 'D', 'SP'];

    monaco.languages.setMonarchTokensProvider(languageId, {
      keywords,
      registers,
      tokenizer: {
        root: [
          [/;.*$/, "comment"],
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@registers': 'register',
              '@default': 'identifier'
            }
          }],
          [/\b(0x[\da-fA-F]+|0o[0-7]+|\d+[db]?|[01]+b)\b/, "number"],
          [/".*?"/, "string"],
        ],
      },
    });

    const keywordDocs: {[key: string]: string} = {
      MOV: "Copy a value from source to destination. Only instruction that can write directly to memory. SP allowed.",
      ADD: "Add two values. Affects carry and zero flags. SP allowed.",
      SUB: "Subtract second value from first. Affects carry and zero flags. SP allowed.",
      INC: "Increment a register by one. Affects carry and zero flags. SP allowed.",
      DEC: "Decrement a register by one. Affects carry and zero flags. SP allowed.",
      MUL: "Multiply A register by operand. Affects carry and zero flags.",
      DIV: "Divide A register by operand. Affects carry and zero flags.",
      AND: "Logical AND. Affects carry and zero flags.",
      OR: "Logical OR. Affects carry and zero flags.",
      XOR: "Logical XOR. Affects carry and zero flags.",
      NOT: "Logical NOT (only on registers). Affects carry and zero flags.",
      SHL: "Logical shift left. Equivalent to SAL. Affects carry and zero flags.",
      SHR: "Logical shift right. Equivalent to SAR (no signed support). Affects carry and zero flags.",
      SAL: "Arithmetic shift left. Same as SHL. Affects carry and zero flags.",
      SAR: "Arithmetic shift right. Same as SHR (unsigned only). Affects carry and zero flags.",
      CMP: "Compare two values. Sets zero flag if equal. SP allowed.",
      JMP: "Unconditional jump to address or label.",
      JC: "Jump if carry is set. Equivalent: JB, JNAE.",
      JNC: "Jump if carry is clear. Equivalent: JNB, JAE.",
      JZ: "Jump if zero flag is set. Equivalent: JE.",
      JNZ: "Jump if zero flag is clear. Equivalent: JNE.",
      JA: "Jump if above (carry=0 and zero=0). Equivalent: JNBE.",
      JNBE: "Jump if not below or equal (carry=0 and zero=0). Equivalent: JA.",
      JAE: "Jump if above or equal (carry=0). Equivalent: JNC, JNB.",
      JNB: "Jump if not below (carry=0). Equivalent: JNC, JAE.",
      JB: "Jump if below (carry=1). Equivalent: JC, JNAE.",
      JNAE: "Jump if not above or equal (carry=1). Equivalent: JC, JB.",
      JBE: "Jump if below or equal (carry=1 or zero=1). Equivalent: JNA.",
      JNA: "Jump if not above (carry=1 or zero=1). Equivalent: JBE.",
      JE: "Jump if equal (zero=1). Equivalent: JZ.",
      JNE: "Jump if not equal (zero=0). Equivalent: JNZ.",
      CALL: "Call a subroutine. Pushes return address to stack and jumps.",
      RET: "Return from subroutine. Pops return address into instruction pointer.",
      PUSH: "Push value to stack. Decreases SP.",
      POP: "Pop value from stack into register. Increases SP.",
      HLT: "Halt execution.",
      DB: "Define byte. Allows constants, characters, or strings."
    };
    

    monaco.languages.registerCompletionItemProvider(languageId, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range: monaco.IRange = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };

        const keywordSuggestions = keywords.map(k => ({
          label: k,
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: k,
          range,
          documentation: {
            value: `**${k}**: ${keywordDocs[k] || 'No documentation available.'}`,
            isTrusted: true
          },
          
        }));

        const registerSuggestions = registers.map(r => ({
          label: r,
          kind: monaco.languages.CompletionItemKind.Variable,
          insertText: r,
          range,
       

        }));

        return { suggestions: [...keywordSuggestions, ...registerSuggestions] };
      },
    });


    
    // Register hover provider
    monaco.languages.registerHoverProvider(languageId, {
      provideHover: (model, position) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;
    
        const keyword: string = word.word.toUpperCase();
        if (keywordDocs[keyword]) {
          return {
            contents: [{ value: `**${keyword}**: ${keywordDocs[keyword]}` }],
          };
        }
        return null;
      },
    });

    monaco.editor.defineTheme("assembly-theme", {
      base: "vs",
      inherit: true,
      rules: [
          { token: "comment", foreground: "#576574", fontStyle: "italic" },
          { token: "keyword", foreground: "#1c7ed6", fontStyle: "bold" },
          { token: "register", foreground: "#e67700" },
          { token: "number", foreground: "#5f27cd" },
          { token: "string", foreground: "#d63384" },
      ],
      colors: {
        "editor.background": "#ffffff",
      },
    });
  }

  onMount(() => {
    if (!container) return;

    editor = monaco.editor.create(container, {
      value: state.code,
      language: languageId,
      theme: "assembly-theme",
      automaticLayout: true,
      minimap: { enabled: false },
      glyphMargin: true,
      lineNumbersMinChars: 1,
      padding: { top: 10 },
      fontFamily: "Source Code Pro",
      fontSize: 20,
    });

    //@ts-ignore
    editor.getContribution("editor.contrib.suggestController")!.widget.value._setDetailsVisible(true);

    const changeDisposable = editor.onDidChangeModelContent(() => {
      setState("code", editor!.getValue());
    });
  
    const disposable = editor.onMouseDown((e) => {
      if (e.target.type === monaco.editor.MouseTargetType.GUTTER_GLYPH_MARGIN) {
        const line = e.target.position?.lineNumber;
        if (!line) return;
        setBreakpoints(prev => {
          const newBreakpoints = new Set(prev);
          if (newBreakpoints.has(line)) {
            newBreakpoints.delete(line);
          } else {
            newBreakpoints.add(line);
          }
          return Array.from(newBreakpoints);
        });
      }
    });

    onCleanup(() => {
      disposable.dispose();
      changeDisposable.dispose();
      editor?.dispose();
    });
  });

  createEffect(() => {
    if (!editor) return;

    const newDecorations = breakpoints().map(line => ({
      range: new monaco.Range(line, 1, line, 1),
      options: {
        isWholeLine: true,
        glyphMarginClassName: "myBreakpoint",
        glyphMarginHoverMessage: { value: "Click to toggle breakpoint" }
      },
    }));

    currentDecorationIds = editor.deltaDecorations(currentDecorationIds, newDecorations);
  });

  createEffect(() => {
    if (editor && editor.getValue() !== state.code) {
      editor.setValue(state.code);
    }
  });
  
  createEffect(() => {
    if (editor) {
      editor.updateOptions({ readOnly: (state.isRunning || state.isDebugging) }); // Enable read-only
    }
  })

  return (
    <>
      <div class="editor-header">
        <h4 style="margin: 0">
          Editor
        </h4>
        <CodeActions/>
      </div>
      <div
        ref={container}
        style={{
          height: "78vh",
          width: "100%",
          "border-radius": "8px",
          overflow: "visible",
        }}
        class={(state.isRunning || state.isDebugging) ? "disabled" : ""}
      />
    </>
  );
}
