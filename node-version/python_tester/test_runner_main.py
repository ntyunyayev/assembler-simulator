import subprocess
import sys
import json
import os
from test_runner_utils import *




def main():
    asm_file = sys.argv[1]
    test_file = sys.argv[2]
    try:
        test_fd = open(test_file, "r")

        array_of_tests = json.load(test_fd)

        asm_fd = open(asm_file, "r")
        asm_str = asm_fd.read()

    except FileNotFoundError:
        print("Error: File does not appear to exist.")
        return

    run_and_print_feedbacks_generic(asm_str, array_of_tests, print)


if __name__ == "__main__":
    main()
