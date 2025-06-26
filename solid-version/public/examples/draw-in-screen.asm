; Set SM flag at 1 to enable screen drawing
MOV 925, 1 
.start:
    ; Move to the start of the screen memory
    MOV C, 927 
.loop: 
    ; Set the current screen memory location to 1
    MOV [C], 1 
    ; Move to the next screen memory location
    ADD C, 2 
    ; Repeat the loop indefinitely
    JMP .loop 