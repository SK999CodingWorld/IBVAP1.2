"""
IBVAP - Custom YOLOv8 Model Training Pipeline
Redirects execution to scripts/ml/train_custom_yolo.py.
"""
import os
import sys

if __name__ == "__main__":
    script_path = os.path.join(os.path.dirname(__file__), "scripts", "ml", "train_custom_yolo.py")
    with open(script_path, "r", encoding="utf-8") as f:
        code = compile(f.read(), script_path, "exec")
        exec(code, globals())
