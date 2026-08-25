import sys
import time
from pathlib import Path
import cv2
import numpy as np
from PIL import Image
import base64

def find_input_image():
    # 1. Command line argument
    if len(sys.argv) > 1:
        p = Path(sys.argv[1])
        if p.exists() and p.is_file():
            return p
            
    # 2. Local directory search
    for name in ["Falllssmg.jpg", "img.png", "logo.png", "input.png", "img.jpg", "logo.jpg"]:
        p = Path(__file__).parent / name
        if p.exists():
            return p

    return None

def convert_to_vector_svg(img_path, output_paths, colors_num=16, min_area=8, smooth=True):
    """
    High-Fidelity Color Vectorizer using OpenCV Contour Hierarchy and SVG evenodd fill-rule.
    Properly handles holes in letters/shapes (e.g. A, O, P, R, logos with cutouts).
    """
    start_t = time.time()
    pil_img = Image.open(img_path).convert("RGB")
    w, h = pil_img.size

    # Fast & accurate color quantization using Pillow Median Cut
    quantized_pil = pil_img.quantize(colors=colors_num, method=Image.Quantize.MEDIANCUT)
    palette = quantized_pil.getpalette()  # RGB list
    indexed_arr = np.array(quantized_pil)  # 2D array of color indices

    svg_paths = []
    
    # Identify background color index (most frequent color)
    indices, counts = np.unique(indexed_arr, return_counts=True)
    bg_idx = indices[np.argmax(counts)]

    for idx in indices:
        r = palette[idx * 3]
        g = palette[idx * 3 + 1]
        b = palette[idx * 3 + 2]
        hex_color = f"#{r:02x}{g:02x}{b:02x}"

        # Mask for current color index
        mask = (indexed_arr == idx).astype(np.uint8) * 255

        # Subtle bilateral/morphological cleaning to remove pixel noise while retaining sharp corners
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (2, 2))
        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

        # RETR_CCOMP retrieves 2-level hierarchy: outer boundaries & hole boundaries
        contours, hierarchy = cv2.findContours(mask, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
        if hierarchy is None or len(contours) == 0:
            continue

        hierarchy = hierarchy[0]
        color_subpaths = []
        total_points = 0
        layer_area = 0

        for c_idx, contour in enumerate(contours):
            area = cv2.contourArea(contour)
            if area < min_area:
                continue

            layer_area += area

            # High precision polygon approximation
            epsilon = (0.0006 if smooth else 0.001) * cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(contour, epsilon, True)

            if len(approx) < 3:
                continue

            pts = approx.reshape(-1, 2)
            total_points += len(pts)

            if smooth and len(pts) >= 4:
                d_str = points_to_bezier_path(pts)
            else:
                d_parts = [f"M {pts[0][0]},{pts[0][1]}"]
                for pt in pts[1:]:
                    d_parts.append(f"L {pt[0]},{pt[1]}")
                d_parts.append("Z")
                d_str = " ".join(d_parts)

            color_subpaths.append(d_str)

        if color_subpaths:
            is_bg = (idx == bg_idx)
            svg_paths.append({
                "color": hex_color,
                "d": " ".join(color_subpaths),
                "area": layer_area,
                "is_bg": is_bg,
                "points": total_points
            })

    # Sort layers: background first, then largest to smallest
    svg_paths.sort(key=lambda x: (not x["is_bg"], x["area"]), reverse=True)

    svg_lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">',
        '  <title>SPVM³ Tech Solution — Sanjay GL</title>',
        '  <style>',
        '    path { fill-rule: evenodd; stroke-linejoin: round; stroke-linecap: round; }',
        '  </style>'
    ]

    for item in svg_paths:
        svg_lines.append(f'  <path d="{item["d"]}" fill="{item["color"]}" stroke="{item["color"]}" stroke-width="0.5"/>')

    svg_lines.append('</svg>\n')

    svg_content = "\n".join(svg_lines)
    elapsed = time.time() - start_t

    for out_path in output_paths:
        out_p = Path(out_path)
        out_p.write_text(svg_content, encoding="utf-8")
        print(f"Generated Vector SVG: {out_p.name} (Size: {out_p.stat().st_size:,} bytes, Layers: {len(svg_paths)}, Time: {elapsed:.2f}s)")

def points_to_bezier_path(pts):
    """
    Converts polylines into smooth Cubic Bezier path data
    """
    n = len(pts)
    if n < 3:
        return f"M {pts[0][0]},{pts[0][1]} L {pts[1][0]},{pts[1][1]} Z"

    d_parts = [f"M {pts[0][0]},{pts[0][1]}"]
    for i in range(n):
        p0 = pts[(i - 1 + n) % n]
        p1 = pts[i]
        p2 = pts[(i + 1) % n]
        p3 = pts[(i + 2) % n]

        cp1x = int(p1[0] + (p2[0] - p0[0]) / 6)
        cp1y = int(p1[1] + (p2[1] - p0[1]) / 6)
        cp2x = int(p2[0] - (p3[0] - p1[0]) / 6)
        cp2y = int(p2[1] - (p3[1] - p1[1]) / 6)

        d_parts.append(f"C {cp1x},{cp1y} {cp2x},{cp2y} {p2[0]},{p2[1]}")

    d_parts.append("Z")
    return " ".join(d_parts)

def convert_to_embedded_svg(img_path, output_paths):
    pil_img = Image.open(img_path)
    w, h = pil_img.size
    data = base64.b64encode(img_path.read_bytes()).decode("ascii")
    
    # Detect mime type
    mime = "image/png" if img_path.suffix.lower() == ".png" else "image/jpeg"
    
    svg = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     xmlns:xlink="http://www.w3.org/1999/xlink"
     width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <title>SPVM³ Tech Solution — Sanjay GL</title>
  <image width="{w}" height="{h}"
         preserveAspectRatio="xMidYMid meet"
         href="data:{mime};base64,{data}"/>
</svg>
'''
    for out_path in output_paths:
        out_p = Path(out_path)
        out_p.write_text(svg, encoding="utf-8")
        print(f"Generated Embedded SVG: {out_p.name} (Size: {out_p.stat().st_size:,} bytes)")

def main():
    img_path = find_input_image()
    if not img_path:
        print("Error: Input image file not found.")
        sys.exit(1)

    print(f"Using input image: {img_path}")

    svg_path = Path(__file__).parent / f"{img_path.stem}_converted.svg"
    logo_svg_path = Path(__file__).parent / "logo.svg"
    output_paths = [svg_path, logo_svg_path]

    try:
        convert_to_vector_svg(img_path, output_paths, colors_num=16, min_area=8, smooth=True)
    except Exception as e:
        print(f"Vector conversion failed ({e}), falling back to embedded SVG...")
        convert_to_embedded_svg(img_path, output_paths)

if __name__ == "__main__":
    main()
