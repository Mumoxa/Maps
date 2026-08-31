#!/usr/bin/env python3
"""Connectivity test: can the CI runner reach public paste/receive channels?

1. POSTs a marker to webhook.site (uuid hardcoded below; request history
   readable via https://webhook.site/token/<uuid>/requests).
2. Publishes a marker paste to rentry.co under a fixed slug.
Exit 0 if at least one succeeded; 1 otherwise (observable via CI conclusion).
"""
import json
import os
import re
import sys
import urllib.error
import urllib.request
import uuid as _uuid
from http.cookiejar import CookieJar
from urllib.parse import urlencode

RUN_ID = os.environ.get("GITHUB_RUN_ID", "n/a")
SHA = os.environ.get("GITHUB_SHA", "n/a")
HEAD = os.environ.get("GITHUB_HEAD_REF") or os.environ.get("GITHUB_REF_NAME", "n/a")
MARKER = json.dumps({"run_id": RUN_ID, "sha": SHA, "head": HEAD, "t": _uuid.uuid4().hex[:8]})

WH_UUID = "c088a7a4-05a2-4384-bb9c-1e7c47705c9e"
RENTRY_SLUG = "ozdata-connectivity"


def post(url, data=None, headers=None, raw=None):
    req = urllib.request.Request(
        url,
        data=raw if raw is not None else (urlencode(data).encode() if data is not None else None),
        headers=headers or {"User-Agent": "offerzen-probe"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=45) as resp:
        return resp.status, resp.read().decode("utf-8", "replace")


def wh_test():
    try:
        st, body = post(
            f"https://webhook.site/{WH_UUID}",
            raw=MARKER.encode(),
            headers={"Content-Type": "application/json", "User-Agent": "offerzen-probe"},
        )
        print(f"WH {st} {body[:200]}")
        return True
    except Exception as e:  # noqa: BLE001
        print("WH_FAIL", repr(e))
        return False


def rentry_test():
    try:
        jar = CookieJar()
        opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
        opener.addheaders = [("User-Agent", "offerzen-probe")]
        with opener.open("https://rentry.co/new", timeout=45) as resp:
            page = resp.read().decode("utf-8", "replace")
        m = re.search(r'name="csrfmiddlewaretoken" value="([^"]+)"', page) or re.search(r'csrfmiddlewaretoken["\']?\s*[:=]\s*["\']([^"\']+)', page)
        csrf = m.group(1) if m else ""
        form = {
            "csrfmiddlewaretoken": csrf,
            "edit_code": _uuid.uuid4().hex[:12],
            "text": MARKER + "\nchannel:rentry",
            "url": RENTRY_SLUG,
        }
        st, body = post(
            "https://rentry.co/api/paste",
            data=form,
            headers={"Referer": "https://rentry.co/new", "User-Agent": "offerzen-probe"},
        )
        print(f"RENTRY {st} {body[:300]}")
        return st in (200, 201) and ("success" in body or RENTRY_SLUG in body)
    except Exception as e:  # noqa: BLE001
        print("RENTRY_FAIL", repr(e))
        return False


def main():
    a = wh_test()
    b = rentry_test()
    print("WH_OK" if a else "WH_FAIL", "RENTRY_OK" if b else "RENTRY_FAIL")
    return 0 if (a or b) else 1


if __name__ == "__main__":
    sys.exit(main())
