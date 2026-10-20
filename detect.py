"""
IBVAP - Standalone YOLOv8 + ByteTrack Object Detection Script
Redirects execution to scripts/ml/detect.py.
"""
import os
import sys

if __name__ == "__main__":
    script_path = os.path.join(os.path.dirname(__file__), "scripts", "ml", "detect.py")
    with open(script_path, "r", encoding="utf-8") as f:
        code = compile(f.read(), script_path, "exec")
        exec(code, globals())