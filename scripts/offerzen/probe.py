#!/usr/bin/env python3
"""Probe https://www.offerzen.com/companies structure (run inside CI).

Fetches the sitemap, counts company URLs, downloads a couple of company
profile pages + listing pages and dumps:
  * probe-out/*.html       raw HTML samples
  * probe-out/*.outline    compact DOM outline (tags, classes, short text)
  * probe-out/*.csv        sitemap urls / listing page samples
All compact findings are ALSO printed to the log between markers so they can
be recovered via `gh run view --log` even if the push-back fails.
"""
import base64
import csv
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path

import subprocess
import sys as _sys

# CI runners don't ship these; bootstrap quietly.
REQS = {"requests", "bs4", "lxml"}
try:
    import requests
    from bs4 import BeautifulSoup, Comment
except ImportError:
    subprocess.run(
        [_sys.executable, "-m", "pip", "install", "--quiet", "--user", "requests", "beautifulsoup4", "lxml"],
        check=True,
    )
    import requests
    from bs4 import BeautifulSoup, Comment

BASE = "https://www.offerzen.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}
OUT = Path("probe-out")
OUT.mkdir(exist_ok=True)

MARK_START = "===OZ_PROBE_START==="
MARK_END = "===OZ_PROBE_END==="


def get(url, retries=4, timeout=60):
    for i in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=timeout)
            if r.status_code in (200, 404) or r.status_code < 500:
                return r
        except requests.RequestException as e:
            print(f"retry {url}: {type(e).__name__} {e}", file=sys.stderr)
        time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"failed: {url}")


def outline(el, depth=0, max_depth=9, out=None, chars=90):
    for child in el.children:
        if isinstance(child, Comment):
            continue
        name = getattr(child, "name", None)
        if name is None or name in ("script", "style", "svg", "path", "noscript", "source"):
            continue
        if depth > max_depth:
            continue
        cls = ""
        if child.get("class"):
            cls = ".".join(child.get("class")[:5])
        txt = ""
        if name in ("h1", "h2", "h3", "h4", "h5", "a", "span", "p", "button", "label", "dt", "dd", "li", "figcaption"):
            txt = child.get_text(" ", strip=True)
            txt = re.sub(r"\s+", " ", txt)[:chars]
        out.write(f"{'  ' * depth}<{name} cls={cls!r}> {txt}\n")
        outline(child, depth + 1, max_depth, out)


def save_and_log(name, content: str, binary=False):
    mode = "wb" if binary else "w"
    kwargs = {"encoding": None} if binary else {"encoding": "utf-8"}
    (OUT / name).write_text(content, **kwargs) if not binary else (OUT / name).write_bytes(content)
    print(f"[saved] {name} ({len(content)} bytes)")


def try_push_branch():
    """Attempt to commit probe-out back to the PR source branch."""
    head_ref = os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME")
    token = os.environ.get("GITHUB_TOKEN")
    if not head_ref or not token:
        print("[push] no GITHUB_HEAD_REF/GITHUB_TOKEN, skipping push")
        return False
    try:
        subprocess.run(["git", "config", "user.email", "arena-ai-coding-agent[bot]@users.noreply.github.com"], check=True)
        subprocess.run(["git", "config", "user.name", "arena-ai-coding-agent[bot]"], check=True)
        subprocess.run(["git", "fetch", "--depth=1", "origin", head_ref], check=True, capture_output=True)
        subprocess.run(["git", "reset", "--hard", "FETCH_HEAD"], check=True, capture_output=True)
        subprocess.run(["git", "add", "probe-out"], check=True)
        subprocess.run(["git", "commit", "-m", "OfferZen probe output"], check=True)
        url = f"https://x-access-token:{token}@github.com/Mumoxa/Maps.git"
        r = subprocess.run(["git", "push", url, f"HEAD:refs/heads/{head_ref}"], capture_output=True, text=True, timeout=120)
        print(f"[push] exit={r.returncode} {r.stdout[-500:]}{r.stderr[-500:]}")
        return r.returncode == 0
    except Exception as e:  # noqa: BLE001
        print(f"[push] failed: {e}")
        return False


def main():
    print(MARK_START)
    sitemap = get(BASE + "/sitemap.xml")
    text = sitemap.text
    urls = re.findall(r"https://www\.offerzen\.com/companies/[a-z0-9\-]+/?", text)
    unique = sorted(set(u.rstrip("/") for u in urls))
    print(f"SITEMAP status={sitemap.status_code} size={len(text)} company_urls={len(unique)}")

    rows = []
    for m in re.finditer(r"https://www\.offerzen\.com/companies/[a-z0-9\-]+/?" r"\s*([0-9T:\-.Z]+)?", text):
        rows.append([m.group(0).rstrip("/"), m.group(1) or ""])
    with (OUT / "companies_sitemap.csv").open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["url", "lastmod"])
        w.writerows(rows)
    print(f"SITEMAP_ROWS={len(rows)}")

    # Listing pages: count cards / profile links per page
    for page in (1, 2, 3):
        r = get(BASE + f"/companies?page={page}")
        html = r.text
        links = set(re.findall(r'/companies/([a-z0-9\-]+)"', html))
        print(f"LISTING page={page} status={r.status_code} size={len(html)} slugs={len(links)}")
        if page == 2:
            (OUT / "listing_page2.html").write_text(html, encoding="utf-8")
            soup = BeautifulSoup(html, "lxml")
            with (OUT / "listing_page2.outline").open("w", encoding="utf-8") as fh:
                outline(soup.body, max_depth=8, out=fh)

    # Profile samples
    samples = ["investec", "digital-kiss", "nihka-technology-group", "forward"]
    for slug in samples:
        r = get(f"{BASE}/companies/{slug}")
        (OUT / f"{slug}.html").write_text(r.text, encoding="utf-8")
        soup = BeautifulSoup(r.text, "lxml")
        title = soup.title.get_text(strip=True) if soup.title else "?"
        print(f"SAMPLE {slug} status={r.status_code} html={len(r.text)} title={title!r}")
        with (OUT / f"{slug}.outline").open("w", encoding="utf-8") as fh:
            fh.write(f"URL: {r.url}\nTITLE: {title}\n\n")
            outline(soup.body, max_depth=9, out=fh)
        with (OUT / f"{slug}_techpaths.txt").open("w", encoding="utf-8") as fh:
            for el in soup.find_all(string=re.compile(r"tech stack", re.I)):
                node = el.parent
                for _ in range(5):
                    if node is None:
                        break
                    fh.write(f"ancestor {node.name} cls={node.get('class')}\n")
                    node = node.parent
                fh.write("---\n")

    # Print compact outlines to log (recoverable if push fails)
    for p in sorted(OUT.glob("*.outline")):
        print(f"---- OUTLINE {p.name} ----")
        print(p.read_text(encoding="utf-8")[:40000])
    print("---- SITEMAP HEAD ----")
    with (OUT / "companies_sitemap.csv").open(encoding="utf-8") as f:
        for line in f.readlines()[:20]:
            print(line.rstrip())
    print(MARK_END)

    pushed = try_push_branch()
    print(f"PUSH_OK={pushed}")


if __name__ == "__main__":
    main()
