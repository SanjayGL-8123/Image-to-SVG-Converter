/**
 * Application Controller for Image to SVG Converter
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const samplesGrid = document.getElementById('samplesGrid');

  // Controls
  const modeSegmented = document.getElementById('modeSegmented');
  const presetButtons = document.querySelectorAll('.btn-preset');
  const colorSlider = document.getElementById('colorSlider');
  const colorVal = document.getElementById('colorVal');
  const epsilonSlider = document.getElementById('epsilonSlider');
  const epsilonVal = document.getElementById('epsilonVal');
  const minAreaSlider = document.getElementById('minAreaSlider');
  const minAreaVal = document.getElementById('minAreaVal');
  const blurSlider = document.getElementById('blurSlider');
  const blurVal = document.getElementById('blurVal');
  const bgControlGroup = document.getElementById('bgControlGroup');
  const transparentBgCheckbox = document.getElementById('transparentBgCheckbox');
  const curveSegmented = document.getElementById('curveSegmented');
  const btnConvert = document.getElementById('btnConvert');
  const palettePreview = document.getElementById('palettePreview');

  // Display Tabs & Viewport
  const tabVisual = document.getElementById('tabVisual');
  const tabSplit = document.getElementById('tabSplit');
  const tabCode = document.getElementById('tabCode');
  const viewportVisual = document.getElementById('viewportVisual');
  const viewportSplit = document.getElementById('viewportSplit');
  const viewportCode = document.getElementById('viewportCode');

  const svgWrapper = document.getElementById('svgWrapper');
  const originalLayerImg = document.getElementById('originalLayerImg');
  const svgLayerContainer = document.getElementById('svgLayerContainer');
  const splitDivider = document.getElementById('splitDivider');
  const codeBody = document.getElementById('codeBody');

  // Toolbar Actions
  const btnZoomIn = document.getElementById('btnZoomIn');
  const btnZoomOut = document.getElementById('btnZoomOut');
  const btnZoomReset = document.getElementById('btnZoomReset');
  const zoomLevelDisplay = document.getElementById('zoomLevelDisplay');
  const btnToggleBg = document.getElementById('btnToggleBg');
  const btnCopySvg = document.getElementById('btnCopySvg');
  const btnDownloadSvg = document.getElementById('btnDownloadSvg');
  const btnThemeToggle = document.getElementById('btnThemeToggle');
  const btnPrivacy = document.getElementById('btnPrivacy');
  const btnClosePrivacy = document.getElementById('btnClosePrivacy');
  const privacyModal = document.getElementById('privacyModal');
  const toastContainer = document.getElementById('toastContainer');
  const loadingOverlay = document.getElementById('loadingOverlay');

  // Stats
  const statDimensions = document.getElementById('statDimensions');
  const statPathCount = document.getElementById('statPathCount');
  const statPointCount = document.getElementById('statPointCount');
  const statOriginalSize = document.getElementById('statOriginalSize');
  const statSvgSize = document.getElementById('statSvgSize');
  const statReduction = document.getElementById('statReduction');
  const statDuration = document.getElementById('statDuration');

  // State Variables
  let currentImageElement = null;
  let originalFileSizeBytes = 0;
  let currentSvgString = '';
  let zoomLevel = 1.0;
  let activeMode = 'vector'; // 'vector', 'monochrome', 'embedded'
  let isSplitDragging = false;

  // Initialize Sample Images Grid
  initSampleImages();

  // Preset Configurations
  const PRESETS = {
    logo: { mode: 'vector', colors: 16, epsilon: 1.2, minArea: 10, blur: 0, curve: 'bezier', transparent: true },
    icon: { mode: 'vector', colors: 8, epsilon: 0.8, minArea: 5, blur: 0, curve: 'bezier', transparent: true },
    photo: { mode: 'vector', colors: 32, epsilon: 0.5, minArea: 15, blur: 1, curve: 'polygon', transparent: false },
    sketch: { mode: 'monochrome', colors: 2, epsilon: 1.5, minArea: 12, blur: 0, curve: 'bezier', transparent: true },
    embedded: { mode: 'embedded', colors: 16, epsilon: 1.0, minArea: 0, blur: 0, curve: 'bezier', transparent: false }
  };

  // --- Event Listeners ---

  // Drag & Drop
  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  });
  fileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  });

  // Clipboard Paste Support
  window.addEventListener('paste', (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          handleFileSelect(file);
          showToast('Image pasted from clipboard!', 'success');
          break;
        }
      }
    }
  });

  // Mode Segmented Buttons
  modeSegmented.querySelectorAll('.segment-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      modeSegmented.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeMode = btn.dataset.mode;
      updateControlVisibility();
      triggerAutoConversion();
    });
  });

  // Curve Segmented Buttons
  curveSegmented.querySelectorAll('.segment-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      curveSegmented.querySelectorAll('.segment-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      triggerAutoConversion();
    });
  });

  // Preset Buttons
  presetButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const presetKey = btn.dataset.preset;
      if (PRESETS[presetKey]) {
        applyPreset(PRESETS[presetKey]);
      }
    });
  });

  // Sliders
  colorSlider.addEventListener('input', () => {
    colorVal.textContent = colorSlider.value;
    triggerAutoConversion();
  });
  epsilonSlider.addEventListener('input', () => {
    epsilonVal.textContent = epsilonSlider.value;
    triggerAutoConversion();
  });
  minAreaSlider.addEventListener('input', () => {
    minAreaVal.textContent = minAreaSlider.value;
    triggerAutoConversion();
  });
  blurSlider.addEventListener('input', () => {
    blurVal.textContent = blurSlider.value;
    triggerAutoConversion();
  });
  transparentBgCheckbox.addEventListener('change', () => triggerAutoConversion());

  btnConvert.addEventListener('click', () => runConversion());

  // Tab Navigation
  tabVisual.addEventListener('click', () => switchTab('visual'));
  tabSplit.addEventListener('click', () => switchTab('split'));
  tabCode.addEventListener('click', () => switchTab('code'));

  // Zoom Controls
  btnZoomIn.addEventListener('click', () => updateZoom(0.15));
  btnZoomOut.addEventListener('click', () => updateZoom(-0.15));
  btnZoomReset.addEventListener('click', () => resetZoom());

  // Toggle Background Pattern
  btnToggleBg.addEventListener('click', () => {
    viewportVisual.classList.toggle('checkerboard-bg');
  });

  // Copy & Download
  btnCopySvg.addEventListener('click', () => {
    if (!currentSvgString) return;
    navigator.clipboard.writeText(currentSvgString).then(() => {
      showToast('SVG XML copied to clipboard!', 'success');
    }).catch(() => {
      showToast('Failed to copy SVG code.', 'error');
    });
  });

  btnDownloadSvg.addEventListener('click', () => {
    if (!currentSvgString) return;
    const blob = new Blob([currentSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'vectorized_image.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Downloaded SVG file successfully!', 'success');
  });

  // Theme Toggle
  btnThemeToggle.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', newTheme);
    showToast(`Switched to ${newTheme} mode.`, 'info');
  });

  // Privacy Policy Modal Handlers
  if (btnPrivacy && privacyModal) {
    btnPrivacy.addEventListener('click', () => {
      privacyModal.style.display = 'flex';
    });
    btnClosePrivacy?.addEventListener('click', () => {
      privacyModal.style.display = 'none';
    });
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) {
        privacyModal.style.display = 'none';
      }
    });
  }

  // Split Divider Dragging
  splitDivider.addEventListener('mousedown', () => isSplitDragging = true);
  window.addEventListener('mouseup', () => isSplitDragging = false);
  window.addEventListener('mousemove', (e) => {
    if (!isSplitDragging) return;
    const rect = viewportSplit.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    let percentage = (offsetX / rect.width) * 100;
    percentage = Math.max(0, Math.min(100, percentage));
    
    splitDivider.style.left = `${percentage}%`;
    const originalLayer = viewportSplit.querySelector('.original-layer');
    if (originalLayer) {
      originalLayer.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
    }
  });

  // --- Functions ---

  function initSampleImages() {
    samplesGrid.innerHTML = '';
    if (!window.sampleImages || window.sampleImages.length === 0) return;

    window.sampleImages.forEach((sample, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'sample-thumb';
      thumb.title = sample.name;
      thumb.innerHTML = `<img src="${sample.url}" alt="${sample.name}"/>`;
      thumb.addEventListener('click', () => {
        loadSampleImage(sample.url, sample.name);
      });
      samplesGrid.appendChild(thumb);
    });

    // Auto-load first sample on launch
    loadSampleImage(window.sampleImages[0].url, window.sampleImages[0].name);
  }

  function loadSampleImage(url, name) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      currentImageElement = img;
      originalFileSizeBytes = Math.round(url.length * 0.75); // approx base64 size
      originalLayerImg.src = url;
      runConversion();
      showToast(`Loaded sample: ${name}`, 'info');
    };
    img.src = url;
  }

  function handleFileSelect(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid JPG, PNG, or WEBP image file.', 'error');
      return;
    }

    originalFileSizeBytes = file.size;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        currentImageElement = img;
        originalLayerImg.src = e.target.result;
        runConversion();
        showToast(`Loaded image: ${file.name}`, 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function applyPreset(preset) {
    activeMode = preset.mode;
    modeSegmented.querySelectorAll('.segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === activeMode);
    });

    colorSlider.value = preset.colors;
    colorVal.textContent = preset.colors;

    epsilonSlider.value = preset.epsilon;
    epsilonVal.textContent = preset.epsilon;

    minAreaSlider.value = preset.minArea;
    minAreaVal.textContent = preset.minArea;

    blurSlider.value = preset.blur;
    blurVal.textContent = preset.blur;

    curveSegmented.querySelectorAll('.segment-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.curve === preset.curve);
    });

    transparentBgCheckbox.checked = preset.transparent;

    updateControlVisibility();
    runConversion();
  }

  function updateControlVisibility() {
    const isVector = activeMode === 'vector';
    const isMono = activeMode === 'monochrome';
    const isEmbedded = activeMode === 'embedded';

    document.getElementById('colorsControlGroup').style.display = isVector ? 'block' : 'none';
    document.getElementById('epsilonControlGroup').style.display = (isVector || isMono) ? 'block' : 'none';
    document.getElementById('minAreaControlGroup').style.display = (isVector || isMono) ? 'block' : 'none';
    document.getElementById('blurControlGroup').style.display = (isVector || isMono) ? 'block' : 'none';
    document.getElementById('curveControlGroup').style.display = (isVector || isMono) ? 'block' : 'none';
    bgControlGroup.style.display = (isVector || isMono) ? 'block' : 'none';
  }

  let autoConvertTimer = null;
  function triggerAutoConversion() {
    clearTimeout(autoConvertTimer);
    autoConvertTimer = setTimeout(() => {
      runConversion();
    }, 200);
  }

  async function runConversion() {
    if (!currentImageElement) return;

    loadingOverlay.classList.add('active');

    const selectedCurve = curveSegmented.querySelector('.segment-btn.active')?.dataset.curve || 'bezier';

    const options = {
      mode: activeMode,
      colors: colorSlider.value,
      epsilon: epsilonSlider.value,
      minArea: minAreaSlider.value,
      blur: blurSlider.value,
      transparentBg: transparentBgCheckbox.checked,
      curveType: selectedCurve
    };

    try {
      const result = await window.vectorizer.vectorize(currentImageElement, options);

      currentSvgString = result.svgString;

      // Update Visual SVG Viewport
      svgWrapper.innerHTML = currentSvgString;
      svgLayerContainer.innerHTML = currentSvgString;
      codeBody.textContent = currentSvgString;

      // Update Palette Preview Swatches
      updatePaletteSwatches(result.palette);

      // Update Stats
      const width = currentImageElement.naturalWidth || currentImageElement.width;
      const height = currentImageElement.naturalHeight || currentImageElement.height;
      const svgSizeBytes = new Blob([currentSvgString]).size;

      statDimensions.textContent = `${width} × ${height}`;
      statPathCount.textContent = result.pathCount.toLocaleString();
      statPointCount.textContent = result.pointCount.toLocaleString();
      statOriginalSize.textContent = formatBytes(originalFileSizeBytes);
      statSvgSize.textContent = formatBytes(svgSizeBytes);

      const reduction = originalFileSizeBytes > 0 ? ((1 - (svgSizeBytes / originalFileSizeBytes)) * 100).toFixed(1) : '0';
      statReduction.textContent = `${reduction > 0 ? '-' : '+'}${Math.abs(reduction)}%`;
      statReduction.style.color = reduction > 0 ? 'var(--success-color)' : 'var(--warning-color)';
      statDuration.textContent = `${result.durationMs} ms`;

    } catch (err) {
      console.error(err);
      showToast('Conversion error occurred.', 'error');
    } finally {
      loadingOverlay.classList.remove('active');
    }
  }

  function updatePaletteSwatches(paletteHexArray) {
    palettePreview.innerHTML = '';
    if (!paletteHexArray || paletteHexArray.length === 0) {
      palettePreview.innerHTML = '<span style="font-size:0.75rem; color:var(--text-muted);">None</span>';
      return;
    }
    paletteHexArray.forEach(hex => {
      const swatch = document.createElement('div');
      swatch.className = 'palette-swatch';
      swatch.style.backgroundColor = hex;
      swatch.title = hex;
      palettePreview.appendChild(swatch);
    });
  }

  function switchTab(tabName) {
    tabVisual.classList.toggle('active', tabName === 'visual');
    tabSplit.classList.toggle('active', tabName === 'split');
    tabCode.classList.toggle('active', tabName === 'code');

    viewportVisual.style.display = tabName === 'visual' ? 'flex' : 'none';
    viewportSplit.style.display = tabName === 'split' ? 'block' : 'none';
    viewportCode.style.display = tabName === 'code' ? 'flex' : 'none';
  }

  function updateZoom(delta) {
    zoomLevel = Math.max(0.2, Math.min(5.0, zoomLevel + delta));
    svgWrapper.style.transform = `scale(${zoomLevel})`;
    zoomLevelDisplay.textContent = `${Math.round(zoomLevel * 100)}%`;
  }

  function resetZoom() {
    zoomLevel = 1.0;
    svgWrapper.style.transform = 'scale(1)';
    zoomLevelDisplay.textContent = '100%';
  }

  function showToast(msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;

    if (type === 'success') toast.style.borderColor = 'var(--success-color)';
    if (type === 'error') toast.style.borderColor = 'var(--danger-color)';

    toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2800);
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
});
