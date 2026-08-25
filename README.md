# VectorCraft AI — Image to SVG Vector Converter

A modern, blazingly fast client-side web and desktop application to convert **JPG, PNG, WEBP, and GIF** raster images into clean, scalable **SVG vector graphics**.

[![GitHub Repository](https://img.shields.io/badge/GitHub-sanjayGL2006%2Fimage--to--svg--converter-181717?style=for-the-badge&logo=github)](https://github.com/sanjayGL2006/image-to-svg-converter)
[![Privacy Guarantee](https://img.shields.io/badge/Privacy-100%25_On--Device_Local-10b981?style=for-the-badge&logo=shield)](PRIVACY_POLICY.md)
[![Python Version](https://img.shields.io/badge/Python-3.8%2B-3776ab?style=for-the-badge&logo=python)](https://www.python.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-f7df1e?style=for-the-badge&logo=javascript)](https://developer.mozilla.org)

---

## ✨ Features

- **🔒 100% On-Device Privacy**: All image color quantization, contour extraction, and SVG generation happen **locally on your device**. Zero cloud uploads, zero telemetry, zero cookies.
- **🚀 Dual Platform Support**:
  - **Web Application (Browser)**: Interactive HTML5 canvas engine with drag-and-drop, real-time split compare slider, live SVG code viewer, and zoom/pan tools.
  - **Desktop Application (Tkinter GUI)**: Native Python GUI window with file selector dialogs, preview canvas, and 1-click browser inspection.
- **🎨 3 Vectorization Modes**:
  - **Vector Art**: Multi-color path tracing ($2$ to $64$ quantized palette colors with live swatches).
  - **Silhouette / Line Art**: Monochrome high-contrast vector path extraction for logos and sketches.
  - **Embedded Data-URI**: Loss-free SVG wrapper embedding original raster data.
- **✂️ Smart Subpath Hole Subtraction**: Uses OpenCV `RETR_CCOMP` 2-level contour hierarchy and SVG `fill-rule="evenodd"` to properly subtract inner holes in shapes and text characters (e.g. "A", "O", "P", "R", shield cutouts).
- **📈 Cubic Bezier Curve Smoothing**: Smooth Catmull-Rom to Cubic Bezier curve fitting (`C cp1x,cp1y cp2x,cp2y x,y`) to eliminate pixelation and rough polyline edges.

---

## 🛠️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/sanjayGL2006/image-to-svg-converter.git
cd image-to-svg-converter
```

### 2. Install Python Dependencies

```bash
py -m pip install -r requirements.txt
```

#### `requirements.txt`
```txt
Pillow>=9.0.0
opencv-python>=4.5.0
numpy>=1.20.0
```

> **Note on Tkinter**: `tkinter` comes pre-installed with Python on Windows and macOS. On Linux (Ubuntu/Debian), install it via `sudo apt-get install python3-tk`.

---

## 🚀 How to Run

### Option 1: Web Application (Browser)

Start the Python HTTP web server:

```bash
py -m http.server 8000 --bind 127.0.0.1
```

Open your browser and navigate to:
👉 **[http://127.0.0.1:8000](http://127.0.0.1:8000)** or **[http://localhost:8000](http://localhost:8000)** (or double-click `index.html`).

### Option 2: Desktop GUI Application (Tkinter Window)

Launch the native desktop window:

```bash
py gui_app.py
```

### Option 3: Command Line Interface (CLI Script)

Convert any image file directly:

```bash
py convert_logo.py input.png
```

---

## 📁 Repository Structure

```
image-to-svg-converter/
├── index.html        # Web Application interface shell
├── styles.css        # Modern glassmorphism UI design system
├── vectorizer.js    # Pure JS Canvas quantization & contour vector engine
├── sample_images.js  # High-res canvas sample graphics generator
├── app.js            # Web UI event controller & split-slider handlers
├── gui_app.py        # Desktop Tkinter GUI application
├── convert_logo.py   # Python OpenCV & Pillow vector engine with evenodd subtraction
├── input.png         # Sample input graphic asset
├── requirements.txt  # Python package dependencies
├── PRIVACY_POLICY.md # Privacy Policy document
├── .gitignore        # Git ignore rules
└── README.md         # Repository documentation
```

---

## 🔒 Privacy Policy

VectorCraft AI is built with privacy by design. **Your images and converted graphics never leave your computer.** Read our full privacy policy in [PRIVACY_POLICY.md](PRIVACY_POLICY.md).

---

## 👨‍💻 Author & Credits

- **Developer:** Sanjay GL (`sanjayGL2006`)
- **Organization:** SPVM³ Tech Solution
- **Tagline:** *Education: The Passport To Your Future*

---

*Star ⭐️ this repository if you find it helpful!*
