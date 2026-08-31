#!/usr/bin/env python3
"""Tiny diagnostic: verify the CI runner -> branch push-back channel."""
import json
import os
import platform
import subprocess
import sys
from pathlib import Path

OUT = Path("probe-out")
OUT.mkdir(exist_ok=True)
info = {
    "python": platform.python_version(),
    "head_ref": os.environ.get("GITHUB_HEAD_REF"),
    "ref_name": os.environ.get("GITHUB_REF_NAME"),
    "event": os.environ.get("GITHUB_EVENT_NAME"),
    "sha": os.environ.get("GITHUB_SHA"),
    "has_token": bool(os.environ.get("GITHUB_TOKEN")),
    "cwd": str(Path.cwd()),
}
(OUT / "ping.json").write_text(json.dumps(info, indent=2), encoding="utf-8")
print("ping wrote", info)

head_ref = os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME")
token = os.environ.get("GITHUB_TOKEN")
try:
    subprocess.run(["git", "config", "user.email", "bot@example.com"], check=True)
    subprocess.run(["git", "config", "user.name", "bot"], check=True)
    subprocess.run(["git", "fetch", "--depth=1", "origin", head_ref], check=True, capture_output=True)
    subprocess.run(["git", "reset", "--hard", "FETCH_HEAD"], check=True, capture_output=True)
    subprocess.run(["git", "add", "probe-out"], check=True)
    subprocess.run(["git", "commit", "-m", "probe ping"], check=True)
    url = f"https://x-access-token:{token}@github.com/Mumoxa/Maps.git"
    r = subprocess.run(["git", "push", url, f"HEAD:refs/heads/{head_ref}"], capture_output=True, text=True, timeout=120)
    print(f"PING_PUSH exit={r.returncode}")
    print(r.stdout[-1000:])
    print(r.stderr[-1000:])
except Exception as e:  # noqa: BLE001
    print("PING_PUSH_EXC", repr(e))
