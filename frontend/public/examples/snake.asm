JMP .start
x: DB 2
y: DB 5
dpx: DB 1
dpy: DB 0
dsx: DB 0 
dsy: DB 0
length: DB 0
erase_pointer: DB 0
insert_pointer: DB 0
snake_base: DB 0
desired_length: DB 5
.allocate_snake:
        POP B
        MOV A, [desired_length]
        INC A; head
        MUL 2
        SUB SP, A
        PUSH B
        RET
.start:
        CALL .allocate_snake
        MOV erase_pointer, SP
        MOV insert_pointer, SP
        MOV snake_base, SP
.loop:
        MOV B, [x]
        MOV C, [y]
        CALL .draw_pixel
        MOV D, [insert_pointer]
        MOV [D], A; *insert_pointer = A
        MOV A, [insert_pointer]; [insert_pointer++
        ADD A, 2
        MOV insert_pointer, A; done]
        MOV A, [length]
        INC A
        MOV length, A
        ADD B, [dpx]
        ADD C, [dpy]
        SUB B, [dsx]
        SUB C, [dsy]
        MOV x, B
        MOV y, C
        CALL .process_keys
.erase:
; Do we have to erase ?
        MOV A, [length]
        CMP A, [desired_length]
        JBE .end
; length = length - 1        
        MOV A, [length]
        DEC A
        MOV length, A
; erase value at erase_pointer
        MOV A, [erase_pointer]
        MOV B, [A]
        MOV [B], 0
; setting insert_pointer to last erased pixel
        MOV insert_pointer, A
; checking if next erase pointer will overflow
        PUSH A
        MOV A, [desired_length]
        ADD A, 1
        MUL 2
        MOV C, A
        POP A
        ADD C, [snake_base]
        CMP A, C
        JB .below
; If overflow, reset erase_pointer to snake_base
.greater:
        MOV B, [snake_base]
        MOV erase_pointer, B
        JMP .erase
; However, just increment it
.below:
        ADD A, 2
        MOV erase_pointer, A        
        JMP .erase
.end:
JMP .loop
HLT
; Draw pixel on x=B, y=C
.draw_pixel:
        ; A = 32*y + x 
        MOV A, C
        MUL 32
        ADD A, B
        MUL 2
        ADD A, DP
        MOV [A], 0xFFFF
        RET
.process_keys:
        MOV A, [IB] ; Key buffer
        CMP A, 0x28
        JZ .down
        CMP A, 0x27
        JZ .right
        CMP A, 0x25
        JZ .left
        CMP A, 0x26
        JZ .up
        RET
.down:
        MOV dpy, 1
        MOV dpx, 0
        MOV dsx, 0
        MOV dsy, 0
        RET
.up:
        MOV dpy, 0
        MOV dpx, 0
        MOV dsx, 0
        MOV dsy, 1
        RET
.right:
        MOV dpy, 0
        MOV dpx, 1
        MOV dsx, 0
        MOV dsy, 0
        RET
.left:
        MOV dpy, 0
        MOV dpx, 0
        MOV dsx, 1
        MOV dsy, 0
        RET


