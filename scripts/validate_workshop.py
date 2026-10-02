#!/usr/bin/env python3
"""Validate the workshop's standalone subpath, anchors and bundled resources."""

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import re
import sys


class WorkshopParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = set()
        self.links = []
        self.resources = []
        self.canonical = None

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if attrs.get("id"):
            self.ids.add(attrs["id"])
        if tag == "a" and attrs.get("href"):
            self.links.append(attrs["href"])
        if tag in ("img", "script") and attrs.get("src"):
            self.resources.append(attrs["src"])
        if tag == "link" and attrs.get("rel") == "stylesheet":
            self.resources.append(attrs["href"])
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href")


root = Path(sys.argv[1] if len(sys.argv) > 1 else "_site")
workshop = root / "wsdm2027-agentic_systems"
page = WorkshopParser()
page.feed((workshop / "index.html").read_text(encoding="utf-8"))
errors = []
if page.canonical != "https://orangecc7.github.io/wsdm2027-agentic_systems/":
    errors.append("Workshop canonical URL is incorrect")
for target in ("intro", "program", "speakers", "cfp", "dates", "organizers"):
    if target not in page.ids:
        errors.append(f"Missing workshop section: {target}")
for link in page.links:
    if link.startswith("#") and link[1:] not in page.ids:
        errors.append(f"Broken workshop anchor: {link}")


def check_resource(value, parent):
    parsed = urlsplit(value)
    if parsed.scheme or parsed.netloc or not parsed.path:
        return
    if parsed.path.startswith("/"):
        errors.append(f"Resource escapes workshop subpath: {value}")
    asset = parent / unquote(parsed.path)
    if not asset.is_file():
        errors.append(f"Missing workshop resource: {value}")


for value in page.resources:
    check_resource(value, workshop)
for css in workshop.rglob("*.css"):
    for value in re.findall(r"url\(\s*['\"]?([^)'\"\s]+)", css.read_text()):
        check_resource(value, css.parent)
if errors:
    sys.exit("\n".join(errors))
print(f"Validated workshop: {len(page.resources)} page resources, bundled fonts and {len(page.ids)} anchors.")
