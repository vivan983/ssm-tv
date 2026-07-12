"""
Generate favicon assets from the official SSM TV logo.
Square-crops the logo with minimal white space, then produces
all required favicon formats and sizes.
"""
import os
from PIL import Image, ImageStat

# Paths
LOGO_PATH = r"C:\Users\tuyiz\Downloads\SSM Official\SSM Logo with Sailboat and Mother Silhouette1.png"
PUBLIC_DIR = r"C:\Users\tuyiz\ssm-tv\public"

# Output sizes
SIZES = {
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "favicon-48x48.png": (48, 48),
    "favicon-64x64.png": (64, 64),
    "apple-touch-icon.png": (180, 180),
    "android-chrome-192x192.png": (192, 192),
    "android-chrome-512x512.png": (512, 512),
}

# Threshold for "white" pixels (close to white — handles anti-aliased edges and off-white backgrounds)
WHITE_THRESHOLD = 240


def is_whiteish(rgba):
    """Return True if pixel counts as background (white/near-white/transparent)."""
    r, g, b, a = rgba
    if a < 10:  # fully transparent
        return True
    return r > WHITE_THRESHOLD and g > WHITE_THRESHOLD and b > WHITE_THRESHOLD


def find_content_bounds(img):
    """Find tight bounding box around non-white content, with a small margin."""
    w, h = img.size
    left, top, right, bottom = w, h, 0, 0

    pixels = img.load()
    for y in range(h):
        for x in range(w):
            if not is_whiteish(pixels[x, y]):
                if x < left:
                    left = x
                if x > right:
                    right = x
                if y < top:
                    top = y
                if y > bottom:
                    bottom = y

    # Add 5% margin on each side (reduced from default — we want minimal space)
    margin_x = max(int((right - left) * 0.03), 2)
    margin_y = max(int((bottom - top) * 0.03), 2)

    left = max(0, left - margin_x)
    top = max(0, top - margin_y)
    right = min(w, right + margin_x)
    bottom = min(h, bottom + margin_y)

    return left, top, right, bottom


def square_crop(img, bounds):
    """Crop to content bounds, then make it square by extending the shorter dimension equally on both sides."""
    left, top, right, bottom = bounds
    content = img.crop((left, top, right, bottom))
    cw = right - left
    ch = bottom - top

    if cw == ch:
        return content

    # Make square: pad the shorter dimension with white
    size = max(cw, ch)
    square = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    offset_x = (size - cw) // 2
    offset_y = (size - ch) // 2
    square.paste(content, (offset_x, offset_y))
    return square


def create_ico(png_32_path, ico_path):
    """Create a multi-size .ico file (16, 32, 48) from the 48x48 PNG."""
    img_48 = Image.open(os.path.join(PUBLIC_DIR, "favicon-48x48.png"))
    ico_sizes = [(16, 16), (32, 32), (48, 48)]
    img_48.save(ico_path, format="ICO", sizes=ico_sizes)
    print(f"  Created: favicon.ico (16x16, 32x32, 48x48)")


def main():
    print(f"Opening logo: {LOGO_PATH}")
    img = Image.open(LOGO_PATH).convert("RGBA")
    print(f"  Original size: {img.size[0]}x{img.size[1]}")

    # 1. Find tight content bounds
    bounds = find_content_bounds(img)
    print(f"  Content bounds: {bounds}")
    print(f"  Content area: {bounds[2]-bounds[0]}x{bounds[3]-bounds[1]}")

    # 2. Square-crop the content
    square_img = square_crop(img, bounds)
    print(f"  Square crop size: {square_img.size[0]}x{square_img.size[1]}")

    # 3. Create favicons at all required sizes
    os.makedirs(PUBLIC_DIR, exist_ok=True)

    for filename, size in SIZES.items():
        # Use high-quality LANCZOS resampling
        resized = square_img.resize(size, Image.Resampling.LANCZOS)
        output_path = os.path.join(PUBLIC_DIR, filename)
        resized.save(output_path, "PNG", optimize=True)
        print(f"  Created: {filename} ({size[0]}x{size[1]})")

    # 4. Create .ico file (multi-size)
    ico_path = os.path.join(PUBLIC_DIR, "favicon.ico")
    create_ico(os.path.join(PUBLIC_DIR, "favicon-48x48.png"), ico_path)
    print(f"  Created: favicon.ico (16x16, 32x32, 48x48)")

    # 5. Also save a square SVG favicon for modern browsers
    #    We keep the SVG simple as a fallback — the PNGs are the primary favicons
    #    But let's create a clean SVG that references the actual brand
    print("\nDone! All favicon assets generated in /public/")
    print("\nFiles created:")
    for f in sorted(os.listdir(PUBLIC_DIR)):
        if f.startswith("favicon") or f.startswith("apple-") or f.startswith("android-"):
            fpath = os.path.join(PUBLIC_DIR, f)
            fsize = os.path.getsize(fpath)
            print(f"  {f} — {fsize:,} bytes")


if __name__ == "__main__":
    main()
