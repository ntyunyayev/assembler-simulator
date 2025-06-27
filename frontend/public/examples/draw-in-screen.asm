; Draw the screen in green
.start:
    MOV C, 1026
.loop: 
    MOV [C], 0x0F00 ; Green
    ADD C, 2 
    JMP .loop 