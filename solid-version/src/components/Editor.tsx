import { assembler } from '../core/assembler';
import { CPU } from '../utils/ReactiveCPU';
import { getStateContext } from '../utils/stateContext';
import CodeActions from './CodeActions.tsx';
import { createSignal, onMount, onCleanup, createEffect, batch } from 'solid-js';
import * as monaco from 'monaco-editor';

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
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: k,
          range,
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
      fontSize: 20

    });

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

  const assemble = (): void => {
    try {
      const { code: machineCode, mapping, labels } = assembler.go(state.code);
      batch(() => {
        for (let i = 0; i < machineCode.length; i++) {
          CPU.memory.store(i, machineCode[i]);
        }
      })
    
      
      setState("labels", Object.entries(labels));
      setState("mapping", mapping);
      setState("error", "");
    } catch (err: any) {
      setState("error", `${err.error} (ligne ${err.line})`);
    }
  };

  createEffect(() => {
    if (editor && editor.getValue() !== state.code) {
      editor.setValue(state.code);
    }
  });
  

  return (
    <>
      <div class="editor-header">
        <div style="display: flex; align-items: flex-end;">
        <h4 style="margin: 0">
          Code{' '}
          <small>
            (<a href="./instruction-set.html">
              Instruction Set
            </a>)
          </small>
        </h4>
        </div>
        <CodeActions/>
      </div>
      <style>
        {`
          .myBreakpoint {
            background: #e51400;
            width: 8px !important;
            height: 8px !important;
            border-radius: 50%;
            margin-left: 5px !important;
            margin-top: 3px;
          }
        `}
      </style>
      <div
        ref={container}
        style={{
          height: "500px",
          width: "100%",
          "border-radius": "8px",
          overflow: "hidden"
        }}
      />
        <button type="button" onClick={assemble} class="btn-primary">
          Assemble
        </button>
    </>
  );
}
