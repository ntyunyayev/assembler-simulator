; Simple example
; Writes Hello World to the output
   JMP start
hello: DB "Hello World!" ; Variable
       DB 0	; String terminator
start:
   MOV D, hello    ; Point to var
   PUSH 925	; Point to output
   CALL print
   HLT             ; Stop execution
print:		; print(D:*from, SP+2:*to)
   PUSH C
   PUSH B
   MOV C, [SP+6]
   MOV B, 0
.loop:
   MOV A, [D]	; Get char from var
   MOV [C], A	; Write to output
   INC D
   INC C
   INC D
   INC C
   CMP B, [D]	; Check if end
   JNZ .loop	; jump if not
   POP B
   POP C
   RET