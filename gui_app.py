"""
Image to SVG Desktop Application (Tkinter GUI)
SPVM³ Tech Solution — Sanjay GL
"""

import sys
import os
import time
import webbrowser
from pathlib import Path
import tkinter as tk
from tkinter import ttk, filedialog, messagebox
from PIL import Image, ImageTk

# Import vectorization functions from convert_logo.py
from convert_logo import convert_to_vector_svg, convert_to_embedded_svg

class ImageToSvgGui:
    def __init__(self, root):
        self.root = root
        self.root.title("VectorCraft AI — Image to SVG Desktop Converter")
        self.root.geometry("900x700")
        self.root.minsize(750, 550)
        
        self.input_file_path = None
        self.output_svg_path = None
        self.tk_img = None

        self.setup_ui()
        self.load_default_sample()

    def setup_ui(self):
        style = ttk.Style()
        style.theme_use('clam')

        # Header Frame
        header_frame = ttk.Frame(self.root, padding=(20, 15, 20, 10))
        header_frame.pack(fill='x')

        title_lbl = ttk.Label(header_frame, text="VectorCraft AI — Image to SVG", font=('Helvetica', 16, 'bold'))
        title_lbl.pack(anchor='w')
        sub_lbl = ttk.Label(header_frame, text="Convert JPG, PNG, WEBP into clean vector graphics", font=('Helvetica', 9))
        sub_lbl.pack(anchor='w')

        # Main Panes
        main_frame = ttk.Frame(self.root, padding=(20, 0, 20, 15))
        main_frame.pack(fill='both', expand=True)

        # Left Controls Sidebar
        left_frame = ttk.LabelFrame(main_frame, text="Settings & Controls", padding=15)
        left_frame.pack(side='left', fill='y', padx=(0, 15))

        # Select Image Button
        btn_select = ttk.Button(left_frame, text="📁 Select JPG / PNG Image", command=self.select_image)
        btn_select.pack(fill='x', pady=(0, 10))

        self.lbl_file_name = ttk.Label(left_frame, text="No image loaded", font=('Helvetica', 9, 'italic'), wraplength=220)
        self.lbl_file_name.pack(fill='x', pady=(0, 15))

        # Conversion Mode
        ttk.Label(left_frame, text="Vector Mode:").pack(anchor='w')
        self.mode_var = tk.StringVar(value="vector")
        mode_combo = ttk.Combobox(left_frame, textvariable=self.mode_var, values=["vector", "embedded"], state="readonly")
        mode_combo.pack(fill='x', pady=(0, 15))

        # Color Count Slider
        ttk.Label(left_frame, text="Color Palette Count:").pack(anchor='w')
        self.color_var = tk.IntVar(value=16)
        self.color_slider = ttk.Scale(left_frame, from_=2, to=64, variable=self.color_var, command=self.update_slider_labels)
        self.color_slider.pack(fill='x')
        self.lbl_colors = ttk.Label(left_frame, text="16 colors", font=('Helvetica', 9, 'bold'))
        self.lbl_colors.pack(anchor='e', pady=(0, 10))

        # Min Area Filter Slider
        ttk.Label(left_frame, text="Noise Filter (Min Area):").pack(anchor='w')
        self.min_area_var = tk.IntVar(value=8)
        self.min_area_slider = ttk.Scale(left_frame, from_=0, to=100, variable=self.min_area_var, command=self.update_slider_labels)
        self.min_area_slider.pack(fill='x')
        self.lbl_min_area = ttk.Label(left_frame, text="8 px²", font=('Helvetica', 9, 'bold'))
        self.lbl_min_area.pack(anchor='e', pady=(0, 15))

        # Bezier Curve Checkbox
        self.smooth_var = tk.BooleanVar(value=True)
        chk_smooth = ttk.Checkbutton(left_frame, text="Smooth Bezier Curves", variable=self.smooth_var)
        chk_smooth.pack(anchor='w', pady=(0, 15))

        # Convert Button
        self.btn_convert = ttk.Button(left_frame, text="⚡ Convert to SVG Vector", command=self.run_conversion)
        self.btn_convert.pack(fill='x', pady=(10, 8))

        # Action Buttons
        self.btn_open_browser = ttk.Button(left_frame, text="👁️ Open SVG in Browser", command=self.open_svg_in_browser, state='disabled')
        self.btn_open_browser.pack(fill='x', pady=(0, 5))

        self.btn_save = ttk.Button(left_frame, text="💾 Save As...", command=self.save_svg, state='disabled')
        self.btn_save.pack(fill='x')

        # Right Display Area
        right_frame = ttk.LabelFrame(main_frame, text="Preview & Conversion Stats", padding=15)
        right_frame.pack(side='right', fill='both', expand=True)

        self.canvas_preview = tk.Canvas(right_frame, bg='#111827', highlightthickness=0)
        self.canvas_preview.pack(fill='both', expand=True, pady=(0, 10))

        # Stats Panel
        self.stats_frame = ttk.Frame(right_frame)
        self.stats_frame.pack(fill='x')

        self.lbl_stats_dim = ttk.Label(self.stats_frame, text="Dim: -", font=('Helvetica', 9))
        self.lbl_stats_dim.pack(side='left', padx=(0, 15))

        self.lbl_stats_size = ttk.Label(self.stats_frame, text="SVG Size: -", font=('Helvetica', 9, 'bold'))
        self.lbl_stats_size.pack(side='left', padx=(0, 15))

        self.lbl_stats_time = ttk.Label(self.stats_frame, text="Time: -", font=('Helvetica', 9))
        self.lbl_stats_time.pack(side='left')

        # Status Bar
        self.status_var = tk.StringVar(value="Ready. Select an image to convert.")
        status_bar = ttk.Label(self.root, textvariable=self.status_var, relief='sunken', padding=5)
        status_bar.pack(fill='x', side='bottom')

    def update_slider_labels(self, _=None):
        self.lbl_colors.config(text=f"{int(self.color_var.get())} colors")
        self.lbl_min_area.config(text=f"{int(self.min_area_var.get())} px²")

    def load_default_sample(self):
        sample_p = Path(__file__).parent / "input.png"
        if sample_p.exists():
            self.input_file_path = sample_p
            self.lbl_file_name.config(text=f"{sample_p.name} (Sample)", font=('Helvetica', 9, 'bold'))
            self.show_preview_image(sample_p)

    def select_image(self):
        file_path = filedialog.askopenfilename(
            title="Select Image File",
            filetypes=[("Image Files", "*.png *.jpg *.jpeg *.webp *.bmp"), ("All Files", "*.*")]
        )
        if file_path:
            self.input_file_path = Path(file_path)
            self.lbl_file_name.config(text=self.input_file_path.name, font=('Helvetica', 9, 'bold'))
            self.show_preview_image(self.input_file_path)
            self.status_var.set(f"Loaded {self.input_file_path.name}")

    def show_preview_image(self, path):
        try:
            img = Image.open(path)
            w, h = img.size
            self.lbl_stats_dim.config(text=f"Dim: {w} × {h}")

            canvas_w = self.canvas_preview.winfo_width() or 400
            canvas_h = self.canvas_preview.winfo_height() or 400

            img.thumbnail((canvas_w - 40, canvas_h - 40))
            self.tk_img = ImageTk.PhotoImage(img)

            self.canvas_preview.delete("all")
            cx = canvas_w // 2
            cy = canvas_h // 2
            self.canvas_preview.create_image(cx, cy, image=self.tk_img)
        except Exception as e:
            messagebox.showerror("Error", f"Failed to load preview: {e}")

    def run_conversion(self):
        if not self.input_file_path:
            messagebox.showwarning("Warning", "Please select an image first!")
            return

        out_path = self.input_file_path.parent / f"{self.input_file_path.stem}_converted.svg"
        colors = int(self.color_var.get())
        min_area = int(self.min_area_var.get())
        smooth = self.smooth_var.get()
        mode = self.mode_var.get()

        self.status_var.set("Quantizing colors & vectorizing image...")
        self.root.update()

        try:
            start_t = time.time()
            if mode == "embedded":
                convert_to_embedded_svg(self.input_file_path, [out_path])
            else:
                convert_to_vector_svg(self.input_file_path, [out_path], colors_num=colors, min_area=min_area, smooth=smooth)

            elapsed = time.time() - start_t
            self.output_svg_path = out_path

            svg_size = out_path.stat().st_size
            self.lbl_stats_size.config(text=f"SVG Size: {svg_size / 1024:.1f} KB")
            self.lbl_stats_time.config(text=f"Time: {elapsed:.2f}s")

            self.btn_open_browser.config(state='normal')
            self.btn_save.config(state='normal')
            self.status_var.set(f"Successfully converted SVG in {elapsed:.2f}s! Saved to {out_path.name}")
            
            messagebox.showinfo("Success", f"SVG Vector Created Successfully!\n\nFile: {out_path.name}\nSize: {svg_size:,} bytes\nTime: {elapsed:.2f} seconds")
        except Exception as e:
            messagebox.showerror("Error", f"Conversion failed: {e}")
            self.status_var.set("Conversion failed.")

    def open_svg_in_browser(self):
        if self.output_svg_path and self.output_svg_path.exists():
            webbrowser.open(self.output_svg_path.as_uri())

    def save_svg(self):
        if not self.output_svg_path or not self.output_svg_path.exists():
            return
        
        save_path = filedialog.asksaveasfilename(
            title="Save SVG File",
            defaultextension=".svg",
            initialfile=self.output_svg_path.name,
            filetypes=[("SVG Vector Graphics", "*.svg")]
        )
        if save_path:
            save_p = Path(save_path)
            save_p.write_bytes(self.output_svg_path.read_bytes())
            messagebox.showinfo("Saved", f"Saved SVG file to:\n{save_p.name}")

def main():
    root = tk.Tk()
    app = ImageToSvgGui(root)
    root.mainloop()

if __name__ == "__main__":
    main()
