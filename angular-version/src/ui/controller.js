app.controller('Ctrl', ['$document', '$scope', '$timeout', 'cpu', 'memory', 'assembler', 'screen', function($document, $scope, $timeout, cpu, memory, assembler, screen) {
    $scope.memory = memory;
    $scope.cpu = cpu;
    $scope.error = '';
    $scope.isRunning = false;
    $scope.displayHex = true;
    $scope.displayInstr = true;
    $scope.displayA = true;
    $scope.displayB = true;
    $scope.displayC = true;
    $scope.displayD = true;
    $scope.speeds = [{ speed: 1, desc: "1 HZ" },
    { speed: 4, desc: "4 HZ" },
    { speed: 8, desc: "8 HZ" },
    { speed: 16, desc: "16 HZ" },
    { speed: 1024, desc: "1024 HZ" }];
    $scope.speed = 4;
    $scope.outputStartIndex = 925;
    $scope.outputEndIndex = 1023;
    $scope.outputLimit = $scope.outputEndIndex - $scope.outputStartIndex + 1;
    $scope.displayStartIndex = 925;
    $scope.ramDisplayMode = "HEX";
    $scope.screenPixels = [];
    $scope.code = "";
    updateScreenPixels();

    $scope.reset = function() {
        cpu.reset();
        memory.reset();
        $scope.error = '';
        $scope.selectedLine = -1;
    };

    $scope.downloadCode = function() {
        var link = document.createElement('a');
        var content = $scope.code;
        var file = new Blob([content], { type: 'text/plain' });
        link.href = URL.createObjectURL(file);
        link.download = 'code.asm';
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
    };

    $scope.loadFile = function() {
        var file = document.querySelector("input").files[0];
        console.log(file);
        var reader = new FileReader();
        reader.addEventListener("load", function(event) {
            $scope.code = event.target.result;
            $scope.$apply();
        });
        reader.readAsText(file, "UTF-8");
    };

    $scope.executeStep = function() {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        try {
            // Execute
            var res = cpu.step();

            // Mark in code
            if (cpu.ip in $scope.mapping) {
                $scope.selectedLine = $scope.mapping[cpu.ip];
            }

            return res;
        } catch (e) {
            $scope.error = e;
            return false;
        }
    };

    var runner;
    $scope.run = function() {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        $scope.isRunning = true;
        runner = $timeout(function() {
            if ($scope.executeStep() === true) {
                $scope.run();
            } else {
                $scope.isRunning = false;
            }
        }, 1000 / $scope.speed);
    };

    $scope.runQuickly = function() {
        if (!$scope.checkPrgrmLoaded()) {
            $scope.assemble();
        }

        $scope.isRunning = true;
        runner = $timeout(function() {
            if ($scope.executeStep() === true) {
                $scope.runQuickly();
            } else {
                $scope.isRunning = false;
            }
        }, 1);
    };
    $scope.stop = function() {
        $timeout.cancel(runner);
        $scope.isRunning = false;
    };

    $scope.checkPrgrmLoaded = function() {
        for (var i = 0, l = memory.data.length; i < l; i++) {
            if (memory.data[i] !== 0) {
                return true;
            }
        }

        return false;
    };

    $scope.getChar = function(value) {
        var text = String.fromCharCode(value);

        if (text.trim() === '') {
            return '\u00A0\u00A0';
        } else {
            return text;
        }
    };
    $scope.get8HigherBits = function(value) {
        return (value >> 8) & 0xFF;
    };
    $scope.get8LowerBits = function(value) {
        return value & 0xFF;
    };

    $scope.updateCode = function($event) {
        $scope.code = $event.target.innerText;
    };
    $scope.$watch('code', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            var editor = document.getElementById('editor');
            if (!editor || editor.innerText === newVal) return;
            $scope.refreshEditorView();
        }
    });

    $scope.refreshEditorView = function() {
        var editor = document.getElementById('editor');

        // Clear existing content
        editor.innerHTML = '';

        // Split code by lines and append each as a new div
        const lines = $scope.code.split('\n');
        while (lines.length < 10) {
            lines.push(' ');
        }
        lines.forEach(line => {
            const row = document.createElement('div');
            row.textContent = line;
            editor.appendChild(row);
        });

    };

    $scope.assemble = function() {
        try {
            $scope.reset();
            var assembly = assembler.go($scope.code);
            $scope.mapping = assembly.mapping;
            var binary = assembly.code;
            $scope.labels = assembly.labels;

            if (binary.length > memory.data.length)
                throw "Binary code does not fit into the memory. Max " + memory.data.length + " bytes are allowed";

            for (var i = 0, l = binary.length; i < l; i++) {
                memory.data[i] = binary[i];
            }
        } catch (e) {
            if (e.line !== undefined) {
                $scope.error = e.line + " | " + e.error;
                $scope.selectedLine = e.line;
            } else {
                $scope.error = e.error;
            }
        }
    };

    $scope.jumpToLine = function(index) {
       // $document[0].getElementById('editor').scrollIntoView();
        $scope.selectedLine = $scope.mapping[index];
    };

    $scope.isInstruction = function(index) {
        return $scope.mapping !== undefined &&
            $scope.mapping[index] !== undefined &&
            $scope.displayInstr;
    };

    $scope.getMemoryCellCss = function(index) {
        if (index >= $scope.outputStartIndex && index <= $scope.outputEndIndex) {
            return 'output-bg';
        } else if ($scope.isInstruction(index)) {
            return 'instr-bg';
        } else if (index > cpu.sp && index <= cpu.maxSP) {
            return 'stack-bg';
        } else if (index >= $scope.displayStartIndex) {
            return 'display-bg';
        } else {
            return '';
        }
    };

    $scope.getMemoryInnerCellCss = function(index) {
        if (index === cpu.ip) {
            return 'marker marker-ip';
        } else if (index === cpu.sp) {
            return 'marker marker-sp';
        } else if (index === cpu.dp) {
            return 'marker marker-dp';
        } else if (index === cpu.gpr[0] && $scope.displayA) {
            return 'marker marker-a';
        } else if (index === cpu.gpr[1] && $scope.displayB) {
            return 'marker marker-b';
        } else if (index === cpu.gpr[2] && $scope.displayC) {
            return 'marker marker-c';
        } else if (index === cpu.gpr[3] && $scope.displayD) {
            return 'marker marker-d';
        } else {
            return '';
        }
    };
    $scope.changeRamDisplayMode = function() {
        if ($scope.ramDisplayMode === 'ASCII') {
            $scope.ramDisplayMode = 'HEX';
        } else {
            $scope.ramDisplayMode = 'ASCII';
        }
    };

    function updateScreenPixels() {
        console.log("Updating screen pixels");
        $scope.screenPixels = screen.render($scope.memory.data);
    }

    $scope.$watch('memory.data', function (newVal, oldVal) {
        console.log("Memory data changed");
        if (newVal !== oldVal) {
            updateScreenPixels();
        }
    }, true);

}]);
