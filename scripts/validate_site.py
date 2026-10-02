#!/usr/bin/env python3
"""Check the rendered homepage for stale identity, broken assets, and links."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.assets = []
        self.text = []
        self.ignored_depth = 0

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag in ("img", "script") and attrs.get("src"):
            self.assets.append(attrs["src"])
        if tag == "link" and attrs.get("rel") in ("stylesheet", "icon"):
            self.assets.append(attrs["href"])
        if tag in ("script", "style"):
            self.ignored_depth += 1

    def handle_endtag(self, tag):
        if tag in ("script", "style"):
            self.ignored_depth -= 1

    def handle_data(self, data):
        if not self.ignored_depth:
            self.text.append(data)


root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
html = (root / "index.html").read_text(encoding="utf-8")
page = SiteParser()
page.feed(html)
errors = []
for old in ("RainNight11", "rainnight11.github.io", "orange-blog.top", "Lorem ipsum", "YOUR_GOOGLE_SCHOLAR_ID", "260000+"):
    if old in html:
        errors.append(f"Stale homepage content: {old}")
for asset in page.assets:
    parsed = urlsplit(asset)
    if not parsed.scheme and not (root / unquote(parsed.path.lstrip("/"))).is_file():
        errors.append(f"Missing local asset: {asset}")
for link in page.links:
    if link.startswith("#") and link[1:] not in page.ids:
        errors.append(f"Missing navigation target: {link}")
for target in ("about-me", "research", "aigc-detection", "llm-safety", "education", "projects", "ra-det-title", "wda-det-title", "mambaguard-title", "cira-title"):
    if target not in page.ids:
        errors.append(f"Missing section or publication: {target}")
for expected in ("ICLR 2027", "Under review", "Co-first author", "2023–2027", "2027–2030", "Planned"):
    if expected not in html:
        errors.append(f"Missing research or education information: {expected}")
if any("\u4e00" <= char <= "\u9fff" for char in "".join(page.text)):
    errors.append("Unexpected Chinese text in the rendered page")
if errors:
    sys.exit("\n".join(errors))
print(f"Validated homepage: {len(page.assets)} local assets, {len(page.ids)} sections, and {len(page.links)} links.")
