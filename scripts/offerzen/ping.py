#!/usr/bin/env python3
"""Diagnostic: can the CI runner push data back to the PR branch?

Exits 0 only if a push to the source branch succeeded. Also writes
probe-out/push_report.json with token permissions (before exiting) and tries
`git add -f` so gitignore quirks can't block the commit.
"""
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
head_ref = os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME")
token = os.environ.get("GITHUB_TOKEN", "")
event = os.environ.get("GITHUB_EVENT_NAME", "")

report = {
    "python": platform.python_version(),
    "event": event,
    "head_ref": head_ref,
    "ref_name": os.environ.get("GITHUB_REF_NAME"),
    "sha": os.environ.get("GITHUB_SHA"),
    "run_id": os.environ.get("GITHUB_RUN_ID"),
    "has_token": bool(token),
    "token_prefix": token[:6],
}
(OUT / "push_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")

perms = {}
try:
    req = urllib.request.Request(
        f"https://api.github.com/repos/{repo}",
        headers={"Authorization": f"Bearer {token}", "User-Agent": "offerzen-probe", "Accept": "application/vnd.github+json"},
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        data = json.loads(r.read().decode())
        perms = data.get("permissions", {})
        report["repo_permissions"] = perms
        report["private"] = data.get("private")
except Exception as e:  # noqa: BLE001
    report["perms_error"] = repr(e)
(OUT / "push_report.json").write_text(json.dumps(report, indent=2), encoding="utf-8")
print("push_report:", json.dumps(report))


def run_quiet(cmd):
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=180)
    print(f"[ping] $ {' '.join(cmd)} -> {r.returncode}: {(r.stdout or r.stderr)[-400:]}")
    return r


def attempt_push():
    # 1) try the already-configured origin (persisted credentials from checkout)
    r = run_quiet(["git", "push", "origin", f"HEAD:refs/heads/{head_ref}"])
    if r.returncode == 0:
        return True
    # 2) try explicit token URL
    r = run_quiet(["git", "push", f"https://x-access-token:{token}@github.com/{repo}.git", f"HEAD:refs/heads/{head_ref}"])
    return r.returncode == 0


def main():
    # Stage a sentinel file, commit it, then try to push.
    (OUT / "sentinel.txt").write_text(
        f"ping {report.get('run_id')} {report.get('sha')} {report.get('head_ref')}\n", encoding="utf-8"
    )
    subprocess.run(["git", "config", "user.email", "bot@example.com"], check=True)
    subprocess.run(["git", "config", "user.name", "offerzen-probe-bot"], check=True)
    # Ensure we're on the source branch commit (PR runs check out a merge commit).
    r = run_quiet(["git", "fetch", "--depth=1", "origin", head_ref])
    if r.returncode == 0:
        run_quiet(["git", "reset", "--hard", "FETCH_HEAD"])
    run_quiet(["git", "add", "-f", "probe-out"])
    r = run_quiet(["git", "commit", "-m", f"probe ping sentinel [{report.get('run_id')}]"])
    if r.returncode != 0:
        # nothing to commit (should not happen) => report failure
        return 2
    ok = attempt_push()
    print("PING_PUSH_OK" if ok else "PING_PUSH_FAILED")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
