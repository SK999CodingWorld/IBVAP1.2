"""
IBVAP - Standalone Automatic Number Plate Recognition (ANPR) Script
Redirects execution to scripts/ml/anpr.py.
"""
import os
import sys

if __name__ == "__main__":
    script_path = os.path.join(os.path.dirname(__file__), "scripts", "ml", "anpr.py")
    with open(script_path, "r", encoding="utf-8") as f:
        code = compile(f.read(), script_path, "exec")
        exec(code, globals())