#!/usr/bin/env python3
"""Probe https://www.offerzen.com/companies structure.

Fetches the sitemap, counts company URLs, downloads a couple of company
profile pages and dumps a simplified DOM outline so the full scraper can be
written against the real markup.
"""
import csv
import json
import re
import sys
import time
from pathlib import Path

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


def get(url, retries=4, timeout=40):
    for i in range(retries):
        try:
            r = requests.get(url, headers=HEADERS, timeout=timeout)
            if r.status_code in (200, 404) or r.status_code < 500:
                return r
        except requests.RequestException as e:
            print("retry", url, type(e).__name__, file=sys.stderr)
        time.sleep(1.5 * (i + 1))
    raise RuntimeError(f"failed: {url}")


def outline(el, depth=0, max_depth=8, out=None):
    """Write a compact DOM outline with classes and short text."""
    for child in el.children:
        if isinstance(child, Comment):
            continue
        name = getattr(child, "name", None)
        if name is None or name in ("script", "style", "svg", "path", "noscript"):
            continue
        if depth > max_depth:
            continue
        cls = ""
        if child.get("class"):
            cls = ".".join(child.get("class")[:4])
        txt = child.get_text(" ", strip=True) if name in ("h1", "h2", "h3", "h4", "a", "span", "p", "button", "label") else ""
        txt = re.sub(r"\s+", " ", txt)[:80]
        out.write(f"{'  ' * depth}<{name} class={cls!r}> {txt}\n")
        outline(child, depth + 1, max_depth, out)


def main():
    sitemap = get(BASE + "/sitemap.xml")
    text = sitemap.text
    urls = re.findall(r"https://www\.offerzen\.com/companies/[a-z0-9\-]+/?", text)
    unique = sorted(set(url.rstrip("/") for url in urls))
    print(f"sitemap status={sitemap.status_code} size={len(text)} company_urls={len(unique)}")

    companies_csv = OUT / "companies_sitemap.csv"
    with companies_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["url", "lastmod"])
        for m in re.finditer(r"https://www\.offerzen\.com/companies/[a-z0-9\-]+/?\s*([0-9T:\-.Z]+)?", text):
            u = m.group(0).rstrip("/")
            w.writerow([u, m.group(1) or ""])
    print("wrote", companies_csv)

    # Order-of-magnitude check on the listing: how many companies per page?
    for page in (1, 2):
        r = get(BASE + f"/companies?page={page}")
        html = r.text
        links = re.findall(r'href="(/companies/[a-z0-9\-]+)"', html)
        print(f"page={page} status={r.status_code} size={len(html)} profile_links={len(set(links))}")

    samples = ["investec", "digital-kiss", "nihka-technology-group"]
    for slug in samples:
        r = get(f"{BASE}/companies/{slug}")
        (OUT / f"{slug}.html").write_text(r.text, encoding="utf-8")
        soup = BeautifulSoup(r.text, "lxml")
        title = soup.title.get_text(strip=True) if soup.title else "?"
        print(f"sample {slug}: status={r.status_code} html={len(r.text)} title={title!r}")
        with (OUT / f"{slug}_outline.txt").open("w", encoding="utf-8") as fh:
            fh.write(f"URL: {r.url}\nTITLE: {title}\n\n")
            outline(soup.body, max_depth=7, out=fh)

        # try to list candidate tech-stack containers
        with (OUT / f"{slug}_techpaths.txt").open("w", encoding="utf-8") as fh:
            for el in soup.find_all(string=re.compile(r"tech stack", re.I)):
                node = el.parent
                for _ in range(4):
                    if node is None:
                        break
                    fh.write(f"ancestor {node.name} class={node.get('class')}\n")
                    node = node.parent
                fh.write("---\n")

    print("probe complete")


if __name__ == "__main__":
    main()
