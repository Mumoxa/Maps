#!/usr/bin/env python3
"""Tiny diagnostic: verify the CI runner -> branch push-back channel, and
report the outcome via a PR issue comment (readable through api.github.com)."""
import json
import os
import platform
import subprocess
import sys
import urllib.request
from pathlib import Path

OUT = Path("probe-out")
OUT.mkdir(exist_ok=True)
repo = os.environ.get("GITHUB_REPOSITORY", "Mumoxa/Maps")
pr = os.environ.get("PR_NUMBER") or os.environ.get("GITHUB_EVENT_NUMBER")
head_ref = os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME")
token = os.environ.get("GITHUB_TOKEN")

logs = []
info = {
    "python": platform.python_version(),
    "head_ref": head_ref,
    "ref_name": os.environ.get("GITHUB_REF_NAME"),
    "event": os.environ.get("GITHUB_EVENT_NAME"),
    "sha": os.environ.get("GITHUB_SHA"),
    "has_token": bool(token),
    "cwd": str(Path.cwd()),
}
(OUT / "ping.json").write_text(json.dumps(info, indent=2), encoding="utf-8")
print("ping wrote", json.dumps(info))


def run(cmd, **kw):
    kw.setdefault("capture_output", True)
    kw.setdefault("text", True)
    kw.setdefault("timeout", 120)
    r = subprocess.run(cmd, **kw)
    logs.append(f"$ {' '.join(cmd)}\nexit={r.returncode}\n{(r.stdout or '')[-800:]}\n{(r.stderr or '')[-800:]}")
    return r


def api(method, path, body=None):
    req = urllib.request.Request(
        f"https://api.github.com{path}",
        data=json.dumps(body).encode() if body else None,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "User-Agent": "offerzen-probe",
        },
        method=method,
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = resp.read().decode()
            logs.append(f"API {method} {path} -> {resp.status} {data[:500]}")
            return resp.status, data
    except urllib.error.HTTPError as e:
        data = e.read().decode()
        logs.append(f"API {method} {path} -> {e.code} {data[:500]}")
        raise
    except Exception as e:  # noqa: BLE001
        logs.append(f"API {method} {path} -> EXC {e}")
        raise


try:
    subprocess.run(["git", "config", "user.email", "bot@example.com"], check=True)
    subprocess.run(["git", "config", "user.name", "bot"], check=True)
    run(["git", "fetch", "--depth=1", "origin", head_ref])
    run(["git", "reset", "--hard", "FETCH_HEAD"])
    subprocess.run(["git", "add", "probe-out"], check=True)
    subprocess.run(["git", "commit", "-m", "probe ping"], check=True)
    url = f"https://x-access-token:{token}@github.com/{repo}.git"
    r = run(["git", "push", url, f"HEAD:refs/heads/{head_ref}"])
    print(f"PING_PUSH exit={r.returncode}")
except Exception as e:  # noqa: BLE001
    logs.append(f"PUSH EXC {e!r}")

try:
    api("GET", f"/repos/{repo}/issues?state=all&per_page=1")
    if pr:
        api("POST", f"/repos/{repo}/issues/{pr}/comments", {"body": "PING_RESULT:\n" + "\n".join(logs[-3000:])})
    print("PING_REPORTED")
except Exception:  # noqa: BLE001
    print("PING_REPORT FAILED")
