MOV 925, 1
.start:
    MOV C, 1000
.loop:
    MOV [C], 1
    ADD C, 2
    JMP .loop