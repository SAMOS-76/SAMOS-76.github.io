#!/usr/bin/env python3
"""Refresh _data/substack.json from the Substack RSS feed.

Reads `links.substack` from _config.yml, fetches <substack>/feed and writes
title / url / date / subtitle / cover image for each post. Standard library
only. Run by .github/workflows/substack-sync.yml, or by hand:

    python scripts/substack_sync.py                 # uses _config.yml
    python scripts/substack_sync.py https://name.substack.com
"""
import html
import json
import re
import sys
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "_config.yml"
OUT = ROOT / "_data" / "substack.json"
MAX_POSTS = 50


def substack_url():
    if len(sys.argv) > 1:
        return sys.argv[1].rstrip("/")
    in_links = False
    for line in CONFIG.read_text(encoding="utf-8").splitlines():
        if re.match(r"^links:\s*$", line):
            in_links = True
            continue
        if in_links and re.match(r"^\S", line):
            break
        m = re.match(r'^\s+substack:\s*"?([^"\s#]*)', line)
        if in_links and m:
            return m.group(1).rstrip("/")
    return ""


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (portfolio substack sync)"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def parse(xml_bytes):
    root = ET.fromstring(xml_bytes)
    posts = []
    for item in root.iter("item"):
        def text(tag):
            el = item.find(tag)
            return (el.text or "").strip() if el is not None else ""

        date = ""
        if text("pubDate"):
            date = parsedate_to_datetime(text("pubDate")).astimezone(timezone.utc).strftime("%Y-%m-%d")
        enclosure = item.find("enclosure")
        image = enclosure.get("url", "") if enclosure is not None and "image" in enclosure.get("type", "image") else ""
        subtitle = html.unescape(re.sub(r"<[^>]+>", "", text("description"))).strip()
        if subtitle in ("...", "…"):  # Substack's stand-in for "no subtitle"
            subtitle = ""
        posts.append({
            "title": html.unescape(text("title")),
            "url": text("link"),
            "date": date,
            "subtitle": subtitle,
            "image": image,
        })
    posts.sort(key=lambda p: p["date"], reverse=True)
    return posts[:MAX_POSTS]


def main():
    url = substack_url()
    if not url or "REPLACE-ME" in url:
        print("Substack URL not set in _config.yml (links.substack); nothing to sync.")
        return 0

    posts = parse(fetch(url + "/feed"))
    old = {}
    if OUT.exists():
        try:
            old = json.loads(OUT.read_text(encoding="utf-8"))
        except ValueError:
            pass
    if old.get("posts") == posts and old.get("source") == url:
        print("No new posts (%d total)." % len(posts))
        return 0

    data = {
        "source": url,
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "posts": posts,
    }
    OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print("Wrote %d posts to %s" % (len(posts), OUT.relative_to(ROOT)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
