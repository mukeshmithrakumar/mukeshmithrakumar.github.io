#!/usr/bin/env python3
from __future__ import annotations

import re
from pathlib import Path

import yaml


BLOG_DIR = "C:\\Users\\mukes\\Desktop\\MukeshMithrakumar\\mukeshmithrakumar.github.io\\src\\data\\blog"

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n?", re.DOTALL)
ANCHOR_RE = re.compile(
    r'<a\s+name="[^"]*"\s*>\s*</a>|<a\s+name="[^"]*"\s*/?>\s*</a>?',
    re.IGNORECASE,
)
BACK_TO_TOP_RE = re.compile(
    r'<p\s+align="right">\s*<a\s+href="#contents">\s*<sup>.*?</sup>\s*</a>\s*</p>\s*',
    re.IGNORECASE | re.DOTALL,
)
MORE_TAG_RE = re.compile(r"<!--\s*more\s*-->\s*\n?", re.IGNORECASE)
IMG_TAG_RE = re.compile(r"<img\s+[^>]*?>", re.IGNORECASE | re.DOTALL)


def slugify(text: str) -> str:
    text = text.strip().lower()
    text = re.sub(r"[\"'`]", "", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-{2,}", "-", text)
    return text.strip("-")


def parse_frontmatter(text: str) -> tuple[dict | None, str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return None, text

    raw_frontmatter = match.group(1)
    body = text[match.end():]
    data = yaml.safe_load(raw_frontmatter) or {}

    if not isinstance(data, dict):
        raise ValueError("Frontmatter is not a YAML mapping.")

    return data, body


def dump_frontmatter(data: dict) -> str:
    dumped = yaml.safe_dump(
        data,
        sort_keys=False,
        allow_unicode=True,
        default_flow_style=False,
    ).strip()
    return f"---\n{dumped}\n---\n"


def map_frontmatter(frontmatter: dict, source_path: Path) -> dict:
    new_data: dict = {}

    if "title" in frontmatter:
        new_data["title"] = frontmatter["title"]
    else:
        new_data["title"] = source_path.stem

    if "slug" in frontmatter:
        new_data["slug"] = frontmatter["slug"]
    else:
        new_data["slug"] = slugify(source_path.stem)

    if "description" in frontmatter:
        new_data["description"] = frontmatter["description"]
    else:
        new_data["description"] = ""

    new_data["draft"] = bool(frontmatter.get("draft", False))

    if "authors" in frontmatter:
        new_data["authors"] = frontmatter["authors"]

    if "pubDate" in frontmatter:
        new_data["pubDate"] = frontmatter["pubDate"]
    elif "date" in frontmatter:
        new_data["pubDate"] = frontmatter["date"]

    if "heroImage" in frontmatter:
        new_data["heroImage"] = frontmatter["heroImage"]
    elif "image" in frontmatter:
        new_data["heroImage"] = frontmatter["image"]

    if "tags" in frontmatter:
        new_data["tags"] = frontmatter["tags"]

    if "categories" in frontmatter:
        new_data["categories"] = frontmatter["categories"]

    return new_data


def convert_img_tag(img_tag: str) -> str:
    src_match = re.search(r'src="([^"]+)"', img_tag, re.IGNORECASE)
    alt_match = re.search(r'alt="([^"]*)"', img_tag, re.IGNORECASE)

    if not src_match:
        return img_tag

    src = src_match.group(1)
    alt = alt_match.group(1) if alt_match else ""
    return f'<Image src="{src}" alt="{alt}" />'


def transform_body(body: str) -> str:
    body = ANCHOR_RE.sub("", body)
    body = BACK_TO_TOP_RE.sub("", body)
    body = MORE_TAG_RE.sub("", body)

    body = IMG_TAG_RE.sub(lambda m: convert_img_tag(m.group(0)), body)

    body = re.sub(r"\n{3,}", "\n\n", body).strip() + "\n"
    return body


def convert_file(md_path: Path) -> str:
    original = md_path.read_text(encoding="utf-8")
    frontmatter, body = parse_frontmatter(original)

    if frontmatter is None:
        new_frontmatter = {
            "title": md_path.stem,
            "slug": slugify(md_path.stem),
            "description": "",
            "draft": False,
        }
        body_text = original
    else:
        new_frontmatter = map_frontmatter(frontmatter, md_path)
        body_text = body

    new_body = transform_body(body_text)
    return dump_frontmatter(new_frontmatter) + "\n" + new_body


def main() -> None:
    if not BLOG_DIR.exists() or not BLOG_DIR.is_dir():
        raise SystemExit(f"Missing blog directory: {BLOG_DIR}")

    md_files = sorted(BLOG_DIR.rglob("*.md"))
    if not md_files:
        print("No .md files found under blog/")
        return

    converted = 0
    skipped = 0
    failed = 0

    for md_path in md_files:
        mdx_path = md_path.with_suffix(".mdx")

        if mdx_path.exists():
            print(f"SKIP  {mdx_path} already exists")
            skipped += 1
            continue

        try:
            converted_text = convert_file(md_path)
            mdx_path.write_text(converted_text, encoding="utf-8")
            print(f"OK    {md_path.relative_to(BLOG_DIR)} -> {mdx_path.relative_to(BLOG_DIR)}")
            converted += 1
        except Exception as exc:
            print(f"FAIL  {md_path.relative_to(BLOG_DIR)}: {exc}")
            failed += 1

    print("\nDone.")
    print(f"Converted: {converted}")
    print(f"Skipped:   {skipped}")
    print(f"Failed:    {failed}")


if __name__ == "__main__":
    main()