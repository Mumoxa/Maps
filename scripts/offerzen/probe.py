#!/usr/bin/env python3
"""Probe https://www.offerzen.com/companies structure (run inside CI).

Fetches the sitemap, counts company URLs, downloads a couple of company
profile pages + listing pages and dumps:
  * probe-out/*.html       raw HTML samples
  * probe-out/*.outline    compact DOM outline (tags, classes, short text)
  * probe-out/*.csv        sitemap urls / listing page samples
Every stage is pushed back to the source branch (probe-out/) so results can
be pulled after the run even though CI logs are not reachable.
"""
import csv
import os
import re
import subprocess
import sys
import time
from pathlib import Path


def bootstrap():
    try:
        import requests  # noqa: F401
        from bs4 import BeautifulSoup  # noqa: F401

        return
    except ImportError:
        pass
    base = [sys.executable, "-m", "pip", "install", "--quiet"]
    for extra in ([], ["--user"], ["--user", "--break-system-packages"], ["--break-system-packages"]):
        try:
            subprocess.run(base + extra + ["requests", "beautifulsoup4", "lxml"], check=True, timeout=300)
            return
        except subprocess.CalledProcessError:
            continue
    # Last resort: apt packages (runner has sudo).
    subprocess.run(["sudo", "apt-get", "update", "-qq"], check=False)
    subprocess.run(["sudo", "apt-get", "install", "-y", "-qq", "python3-requests", "python3-bs4", "python3-lxml"], check=True)


bootstrap()
import requests  # noqa: E402
from bs4 import BeautifulSoup, Comment  # noqa: E402

BASE = "https://www.offerzen.com"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
}
OUT = Path("probe-out")
OUT.mkdir(exist_ok=True)


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


def save_text(name, content: str):
    (OUT / name).write_text(content, encoding="utf-8")


def push_branch(stage):
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
        subprocess.run(["git", "commit", "-m", f"OfferZen probe output [{stage}]"], check=True)
        url = f"https://x-access-token:{token}@github.com/Mumoxa/Maps.git"
        r = subprocess.run(["git", "push", url, f"HEAD:refs/heads/{head_ref}"], capture_output=True, text=True, timeout=180)
        print(f"[push:{stage}] exit={r.returncode} out={r.stdout[-300:]} err={r.stderr[-300:]}")
        return r.returncode == 0
    except Exception as e:  # noqa: BLE001
        print(f"[push:{stage}] failed: {e}")
        return False


def main():
    # Stage 1: sitemap
    try:
        sm = get(BASE + "/sitemap.xml")
        text = sm.text
        urls = re.findall(r"https://www\.offerzen\.com/companies/[a-z0-9\-]+/?", text)
        unique = sorted(set(u.rstrip("/") for u in urls))
        print(f"SITEMAP status={sm.status_code} size={len(text)} company_urls={len(unique)}")
        rows = []
        for m in re.finditer(r"https://www\.offerzen\.com/companies/[a-z0-9\-]+/?" r"\s*([0-9T:\-.Z]+)?", text):
            rows.append([m.group(0).rstrip("/"), m.group(1) or ""])
        with (OUT / "companies_sitemap.csv").open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["url", "lastmod"])
            w.writerows(rows)
        save_text("probe_summary.txt", f"company_urls={len(unique)}\n")
        (OUT / "sitemap.xml").write_text(text, encoding="utf-8")
        push_branch("sitemap")
    except Exception as e:  # noqa: BLE001
        print(f"sitemap stage failed: {e}")

    # Stage 2: listing pages
    for page in (1, 2, 3):
        try:
            r = get(BASE + f"/companies?page={page}")
            html = r.text
            links = set(re.findall(r'/companies/([a-z0-9\-]+)"', html))
            print(f"LISTING page={page} status={r.status_code} size={len(html)} slugs={len(links)}")
            if page == 2:
                (OUT / "listing_page2.html").write_text(html, encoding="utf-8")
                soup = BeautifulSoup(html, "lxml")
                with (OUT / "listing_page2.outline").open("w", encoding="utf-8") as fh:
                    outline(soup.body, max_depth=8, out=fh)
                push_branch("listing")
        except Exception as e:  # noqa: BLE001
            print(f"listing page={page} failed: {e}")

    # Stage 3: profile samples
    samples = ["investec", "digital-kiss", "nihka-technology-group", "forward", "offerzen"]
    for slug in samples:
        try:
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
        except Exception as e:  # noqa: BLE001
            print(f"sample {slug} failed: {e}")
    push_branch("samples")
    print("PROBE DONE")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:  # noqa: BLE001
        print(f"FATAL {e}", file=sys.stderr)
        push_branch("fatal")
        sys.exit(1)
