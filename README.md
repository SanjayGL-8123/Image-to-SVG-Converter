# VectorCraft AI — JPG & PNG to SVG Converter

A modern, high-performance web and desktop application to convert **JPG, PNG, WEBP, and GIF** raster images into clean, scalable **SVG vector graphics**.

![VectorCraft AI Banner](https://img.shields.io/badge/VectorCraft_AI-Image_to_SVG-6366f1?style=for-the-badge&logo=svg)

---

## ✨ Features

- **🚀 Client-Side Web Engine**: Pure JavaScript vector tracing powered by K-Means color quantization, contour extraction, Ramer-Douglas-Peucker (RDP) curve simplification, and smooth Bezier fitting.
- **🖥️ Python Desktop GUI (Tkinter)**: Native desktop window converter with file selector, preview canvas, color quantization sliders, and save SVG dialog.
- **🎨 3 Vectorization Modes**:
  - **Vector Art**: Multi-color quantized path tracing (2 to 64 colors with live swatches).
  - **Silhouette / Line Art**: High-contrast monochrome vector path extraction for logos and sketches.
  - **Embedded Data-URI**: Instant 100% loss-free SVG wrapper embedding original raster data.
- **🎛️ Real-Time Tuning Controls**:
  - **Presets**: Instant settings for *Logo*, *Icon*, *Detailed Photo*, *Sketch*, and *Data URI*.
  - **Color Palette Count**: 2 to 64 color clusters.
  - **Simplification (Detail)**: RDP epsilon tolerance control.
  - **Noise Filter**: Minimum contour area threshold to eliminate pixel speckles.
  - **Path Curves**: Smooth Bezier curves or geometric Polygon polylines.
  - **Background Removal**: Auto-detects and removes dominant background color.
- **🔍 Visual Inspection Tools**:
  - **Visual SVG Canvas**: Zoom (20%–500%) & Pan controls with transparency checkerboard background.
  - **Split Compare**: Interactive drag-divider comparing Original Raster vs Vector SVG side-by-side.
  - **SVG XML Code Viewer**: Live SVG markup with 1-click **Copy SVG Code** and **Download SVG**.

---

## 📋 Requirements & Dependencies

Install Python dependencies using `requirements.txt`:

```bash
py -m pip install -r requirements.txt
```

### `requirements.txt`
```txt
Pillow>=9.0.0
opencv-python>=4.5.0
numpy>=1.20.0
```

> **Note on Tkinter**: `tkinter` is built into standard Python distributions on Windows and macOS. If you are on Linux (Ubuntu/Debian), install it via `sudo apt-get install python3-tk`.

---

## 📁 File Structure

```
d:\image to svg/
├── index.html        # Web application interface
├── styles.css        # Glassmorphism UI stylesheet
├── vectorizer.js    # Pure JS Canvas quantization & vector engine
├── sample_images.js  # High-res canvas sample graphics
├── app.js            # Web UI event controller
├── gui_app.py        # Python Desktop GUI (Tkinter interface)
├── convert_logo.py   # Python OpenCV & Pillow vectorizer engine
├── requirements.txt  # Python package dependencies
└── README.md         # Documentation
```

---

## 🚀 How to Run

### 1. Web Application (Browser)

Run the Python HTTP server bound to IPv4 `127.0.0.1`:

```bash
py -m http.server 8000 --bind 127.0.0.1
```

Open your browser and navigate to:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)** or **[http://localhost:8000](http://localhost:8000)** (or double-click `index.html`).

### 2. Desktop GUI Application (Tkinter Window)

Launch the Tkinter GUI window:

```bash
py gui_app.py
```

### 3. Command Line Interface (CLI Script)

Convert any image directly via Python CLI:

```bash
py convert_logo.py Falllssmg.jpg
```

---

## 💡 Web Usage Instructions

1. **Insert Image**: Drag and drop any `.png`, `.jpg`, or `.webp` file into the upload zone, click to browse, paste from clipboard (`Ctrl+V`), or click any sample graphic.
2. **Choose Mode / Preset**: Select **Logo**, **Icon**, **Photo**, or **Silhouette**.
3. **Adjust Controls**: Fine-tune color palette size, detail level, background removal, and curve type.
4. **Compare & Export**: Use **Split Compare** to inspect raster vs vector side-by-side, then click **Download SVG** or **Copy SVG Code**.

---

## 🛠️ Built With

- **Web**: HTML5, CSS3, ES6 JavaScript, Google Fonts (*Plus Jakarta Sans* & *Fira Code*).
- **Python**: Tkinter, OpenCV (`cv2`), Pillow (`PIL`), NumPy.

---

*Created by SPVM³ Tech Solution — Sanjay GL*
