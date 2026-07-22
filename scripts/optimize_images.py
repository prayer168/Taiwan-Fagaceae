from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SPECIES_DIR = ROOT / "assets" / "images" / "species"


def convert(source: Path, destination: Path, max_size: tuple[int, int], quality: int) -> None:
    with Image.open(source) as image:
        image = image.convert("RGB")
        image.thumbnail(max_size, Image.Resampling.LANCZOS)
        image.save(destination, "WEBP", quality=quality, method=6)


for source in sorted(SPECIES_DIR.glob("*.png")):
    convert(source, source.with_suffix(".webp"), (960, 960), 82)

convert(
    ROOT / "assets" / "images" / "fagaceae-forest-hero-v2.png",
    ROOT / "assets" / "images" / "fagaceae-forest-hero-v2.webp",
    (1680, 1050),
    86,
)
convert(
    ROOT / "assets" / "images" / "fagaceae-four-genera-plate-v2.png",
    ROOT / "assets" / "images" / "fagaceae-four-genera-plate-v2.webp",
    (1536, 1024),
    86,
)

print(f"optimized {len(list(SPECIES_DIR.glob('*.webp')))} species images")
