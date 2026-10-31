"""Render the photos in photos/ as green-screen images for the CRT theme.

For each photo it writes three looks into photos/crt/:
  <name>-phosphor.jpg  monochrome green, like a photo on a phosphor tube
  <name>-dither.png    ordered dither in four greens at low resolution, pixels kept crisp
  <name>-ascii.png     the photo redrawn as text characters

Run from the project root after adding or changing a photo:  python3 tools/crt-photos.py

With --publish, it instead copies the named photos into public/photos/ so they go out with the
site: the dithered look plus a web-sized original for the hover reveal, e.g.
  python3 tools/crt-photos.py --publish jessie vader-jedi
--publish with no names publishes every photo the site uses (PUBLISHED below).

Needs Pillow and the DejaVu Sans Mono font.
"""

import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFont, ImageOps

SRC = Path('photos')
OUT = SRC / 'crt'
PUBLIC = Path('public/photos')

# Every photo used on the site's pages (see src/app/content.ts). Only these are published.
PUBLISHED = [
    'doug-puppy-vader',
    'doug-melanie',
    'family-camp-selfie',
    'doug-son-bench',
    'doug-daughter-selfie',
    'son-splashpad',
    'daughter-chair',
    'vader-jedi',
    'loki-lab-costume',
    'jessie',
    'jedi-vet',
]

# The theme's greens, darkest to brightest (see the top of src/styles.scss).
BG = (3, 7, 4)
FAINT = (22, 77, 38)
DIM = (42, 159, 74)
FG = (79, 224, 122)
GLOW = (57, 255, 106)
LEVELS = [BG, FAINT, DIM, GLOW]

BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]
RAMP = " .'`:,;-~+=*xoXO#%@"
FONT = '/usr/share/fonts/TTF/DejaVuSansMono.ttf'


def gray(im: Image.Image) -> Image.Image:
    g = ImageOps.grayscale(ImageOps.exif_transpose(im))
    return ImageEnhance.Contrast(ImageOps.autocontrast(g, cutoff=1)).enhance(1.15)


def phosphor(im: Image.Image) -> Image.Image:
    # A gamma above 1 keeps most of the frame dark, so the image glows out of a black tube.
    g = gray(im).point(lambda v: round(255 * (v / 255) ** 1.35))
    g.thumbnail((1400, 1400))
    return ImageOps.colorize(g, black=BG, mid=(24, 120, 52), white=GLOW, midpoint=150)


def dither(im: Image.Image, width: int = 220, scale: int = 4) -> Image.Image:
    g = gray(im).point(lambda v: round(255 * (v / 255) ** 1.35))
    g = g.resize((width, round(g.height * width / g.width)), Image.LANCZOS)
    out = Image.new('RGB', g.size)
    px, opx = g.load(), out.load()
    steps = len(LEVELS) - 1
    for y in range(g.height):
        for x in range(g.width):
            v = px[x, y] / 255 * steps
            base = int(v)
            frac = v - base
            level = base + (1 if frac > (BAYER[y % 4][x % 4] + 0.5) / 16 else 0)
            opx[x, y] = LEVELS[min(level, steps)]
    return out.resize((g.width * scale, g.height * scale), Image.NEAREST)


def ascii_art(im: Image.Image, cols: int = 84, size: int = 16) -> Image.Image:
    font = ImageFont.truetype(FONT, size)
    cw = font.getlength('M')
    ch = size * 1.2
    # Equalizing spreads the tones across the whole ramp, so faces keep their detail in text.
    g = ImageOps.equalize(gray(im))
    rows = round(g.height / g.width * cols * cw / ch)
    g = g.resize((cols, rows), Image.LANCZOS)
    out = Image.new('RGB', (round(cols * cw) + 16, round(rows * ch) + 16), BG)
    draw = ImageDraw.Draw(out)
    px = g.load()
    for y in range(rows):
        for x in range(cols):
            v = px[x, y] / 255
            c = RAMP[min(int(v * len(RAMP)), len(RAMP) - 1)]
            if c != ' ':
                color = tuple(round(a + (b - a) * v) for a, b in zip(FAINT, GLOW))
                draw.text((8 + x * cw, 8 + y * ch), c, font=font, fill=color)
    return out


def publish(names: list[str]) -> None:
    (PUBLIC / 'crt').mkdir(parents=True, exist_ok=True)
    for name in names:
        im = ImageOps.exif_transpose(Image.open(SRC / f'{name}.jpg')).convert('RGB')
        im.thumbnail((1000, 1000))
        im.save(PUBLIC / f'{name}.jpg', quality=80, optimize=True)
        dither(im).save(PUBLIC / 'crt' / f'{name}-dither.png', optimize=True)
        print('published', name)


def main() -> None:
    if sys.argv[1:2] == ['--publish']:
        publish(sys.argv[2:] or PUBLISHED)
        return
    OUT.mkdir(exist_ok=True)
    for path in sorted(SRC.glob('*.jpg')):
        im = Image.open(path)
        phosphor(im).save(OUT / f'{path.stem}-phosphor.jpg', quality=85)
        dither(im).save(OUT / f'{path.stem}-dither.png', optimize=True)
        ascii_art(im).save(OUT / f'{path.stem}-ascii.png', optimize=True)
        print(path.name)


if __name__ == '__main__':
    main()
