import subprocess
import json
import os

HIDDEN_KEYWORD = "hide_me"


def load16(index, arr):
    return (arr[index] << 8) + arr[index + 1]


def run_test(asm_file, test_file, hidden_keyword=HIDDEN_KEYWORD):
    ret_list = []
    for t in test_file:
        code_to_execute = asm_file
        code_to_execute += '\nHLT\n'
        for key in t[0]:
            elem = t[0][key]
            if key[0] != "_":
                code_to_execute += f'{key}:'
            if type(elem) is list:
                for i in range(len(elem)):
                    code_to_execute += f'''DB {elem[i]}\n'''
            elif type(elem) is str:
                code_to_execute += f'''DB "{t[0][key]}"\n'''
            else:
                code_to_execute += f'''DB {t[0][key]}\n'''

        unnamed_vars = []
        for key in t[0]:
            if key[0] == "_":
                unnamed_vars.append(key)
        for key in unnamed_vars:
            del t[0][key]

        file_for_node = open("file_to_execute", "w")
        file_for_node.write(code_to_execute)
        file_for_node.close()
        try:
            os.remove("assembly_error")
        except OSError:
            pass
        try:
            os.remove("runtime_error")
        except OSError:
            pass

        subprocess.call(
            f"npx --yes tsx {os.path.dirname(os.path.abspath(__file__))}/../node_main.js file_to_execute", shell=True)

        if os.path.isfile("assembly_error"):
            error = open("assembly_error", "r").read()
            ret_list.append({"type": "assembly_error", "value": error})
            continue
        if os.path.isfile("runtime_error"):
            error = open("runtime_error", "r").read()
            ret_list.append({"type": "runtime_error", "value": error})
            continue
        data = json.loads(open("out.dat", "r").read())

        do_test_pass = True
        values = {}

        for key in t[1]:
            actual_key = key
            offset = 0
            if "+" in key:
                parsed_key = key.split("+")
                actual_key = parsed_key[0]
                offset = int(parsed_key[1])

            registers = ["A", "B", "C", "D"]
            res = None
            if actual_key in registers:
                res = data["cpu"]["gpr"][registers.index(actual_key)]
            elif actual_key.isnumeric():
                res = load16(actual_key, data["cpu"]["memory"]["data"])
            elif key == "SP":
                res = data["cpu"]["sp"]
            elif type(t[1][key]) is str:
                res = ""
                elem = t[1][key]
                for i in range(len(elem)):
                    res += chr(load16(data["labels"][actual_key] + offset +
                                      (2*i), data["cpu"]["memory"]["data"]))
            elif type(t[1][key]) is list:
                array = []
                for i in range(len(t[1][key])):
                    elem = t[1][key][i]
                    if type(elem) is int:
                        array.append(
                            load16(data["labels"][actual_key]+(2*i)+offset, data["cpu"]["memory"]["data"]))
                    else:
                        array.append("?")
                        elem = "?"
                res = array
            else:
                res = load16(data["labels"][actual_key]+offset, data["cpu"]["memory"]["data"])

            values[key] = res
            if (res != t[1][key]):
                do_test_pass = False

        ret_list.append(
            {"type": "success" if do_test_pass else "failure", "value": values})

    return ret_list


def hide(elem, hidden_keyword=HIDDEN_KEYWORD):
    if type(elem) is str:
        return elem.replace(hidden_keyword, "")
    elif type(elem) is list:
        ret = []
        for e in elem:
            ret.append(hide(e, hidden_keyword))
        return ret
    return elem


def default_success_feedback(test, res, printer, hidden_keyword=HIDDEN_KEYWORD):
    feedback = f"""- Your code passed the following test : {', '.join([f'{hide(key,hidden_keyword)} : {hide(test[0][key],hidden_keyword)}' for key in test[0]])}\n"""
    printer(feedback)


def default_failure_feedback(test, res, printer, hidden_keyword=HIDDEN_KEYWORD):
    feedback = f"""- Your code failed the following test : {', '.join([f'{hide(key,hidden_keyword)} : {hide(test[0][key],hidden_keyword)}' for key in test[0]])}

        | Expected : {', '.join([f'{hide(key,hidden_keyword)} : {hide(test[1][key],hidden_keyword)}' for key in test[1]])}
        |   Actual : {', '.join([f'{hide(key,hidden_keyword)} : {hide(res["value"][key],hidden_keyword)}' for key in res["value"]])}\n"""
    printer(feedback)


def default_runtime_error_feedback(test, res, printer, hidden_keyword=HIDDEN_KEYWORD):
    feedback = f"""- Your code produce the following runtime error : {res['value']}
    with the following test : {', '.join([f'{hide(key,hidden_keyword)} : {hide(test[0][key],hidden_keyword)}' for key in test[0]])}\n
    """
    printer(feedback)


def default_assembly_error_feedback(test, res, printer):
    feedback = f"- your code produce an assembly_error : {res['value']}\n"
    printer(feedback)


def print_feedbacks(res, tests, feedbacks, printer, hidden_keyword=HIDDEN_KEYWORD):
    for i in range(len(res)):
        test_i = tests[i]
        res_i = res[i]
        if res[i]["type"] == "success":
            feedbacks["success"](test_i, res_i, printer, hidden_keyword)
        elif res[i]["type"] == "failure":
            feedbacks["failure"](test_i, res_i, printer, hidden_keyword)
        elif res[i]["type"] == "assembly_error":
            feedbacks["assembly_error"](test_i, res_i, printer)
        elif res[i]["type"] == "runtime_error":
            feedbacks["runtime_error"](test_i, res_i, printer, hidden_keyword)


def run_and_print_feedbacks(asm, tests, printer, feedbacks, hidden_keyword=HIDDEN_KEYWORD):
    res = run_test(asm, tests, hidden_keyword)
    print_feedbacks(res, tests, feedbacks, printer, hidden_keyword)
    return res


def run_and_print_feedbacks_generic_with_res(asm, tests, printer, hidden_keyword=HIDDEN_KEYWORD):

    feedbacks = {"success": default_success_feedback,
                 "failure": default_failure_feedback,
                 "assembly_error": default_assembly_error_feedback,
                 "runtime_error": default_runtime_error_feedback}
    res = run_and_print_feedbacks(
        asm, tests, printer, feedbacks, hidden_keyword=hidden_keyword)
    grade = 0
    for r in res:
        if r["type"] == "success":
            grade += 100/len(res)
    return grade, res


def run_and_print_feedbacks_generic(asm, tests, printer, hidden_keyword=HIDDEN_KEYWORD):

    feedbacks = {"success": default_success_feedback,
                 "failure": default_failure_feedback,
                 "assembly_error": default_assembly_error_feedback,
                 "runtime_error": default_runtime_error_feedback}
    res = run_and_print_feedbacks(
        asm, tests, printer, feedbacks, hidden_keyword=hidden_keyword)
    grade = 0
    for r in res:
        if r["type"] == "success":
            grade += 100/len(res)
    return grade
