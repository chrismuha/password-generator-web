#!/usr/bin/env python3
"""Rebuild all web icons with the same transparent rounded corners."""

from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/icon.png"
PUBLIC = ROOT / "public"
OUTPUTS = {
    "pwa-icon-192.png": 192,
    "pwa-icon-512.png": 512,
    "pwa-icon-maskable-512.png": 512,
    "apple-touch-icon.png": 180,
}


def rounded_master() -> Image.Image:
    image = Image.open(SOURCE).convert("RGBA")
    if image.size != (1024, 1024):
        image = image.resize((1024, 1024), Image.Resampling.LANCZOS)
    mask = Image.new("L", image.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, 1023, 1023), radius=220, fill=255)
    image.putalpha(mask)
    return image


def main() -> None:
    master = rounded_master()
    master.save(SOURCE, optimize=True)
    for filename, size in OUTPUTS.items():
        icon = master.resize((size, size), Image.Resampling.LANCZOS)
        icon.save(PUBLIC / filename, optimize=True)


if __name__ == "__main__":
    main()
