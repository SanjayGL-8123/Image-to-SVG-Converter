/**
 * Canvas-Safe High Quality PNG Base64 Sample Graphics for Instant Testing
 */

window.sampleImages = [
  {
    name: "Tech Shield Logo",
    type: "image/png",
    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA_SURBVHhe7cExAQAAAMKg9Ut2C26gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBvQO0AAAHyqYQ7AAAAAElFTkSuQmCC"
  },
  {
    name: "Geometric Icon",
    type: "image/png",
    url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA_SURBVHhe7cExAQAAAMKg9Ut2C26gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBvQO0AAAHyqYQ7AAAAAElFTkSuQmCC"
  }
];

// Generate dynamic canvas sample graphics if base64 placeholder is short
(function generateDynamicSamples() {
  function drawSampleCanvas(type) {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 256;
    const ctx = c.getContext('2d');

    if (type === 'shield') {
      // Dark gradient background
      const grad = ctx.createLinearGradient(0, 0, 256, 256);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      // Shield shape
      ctx.beginPath();
      ctx.moveTo(128, 30);
      ctx.lineTo(200, 70);
      ctx.lineTo(200, 150);
      ctx.quadraticCurveTo(200, 210, 128, 235);
      ctx.quadraticCurveTo(56, 210, 56, 150);
      ctx.lineTo(56, 70);
      ctx.closePath();
      ctx.fillStyle = '#6366f1';
      ctx.fill();
      ctx.lineWidth = 6;
      ctx.strokeStyle = '#a855f7';
      ctx.stroke();

      // Inner Star
      ctx.beginPath();
      ctx.arc(128, 130, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#06b6d4';
      ctx.fill();
    } else if (type === 'gem') {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, 256, 256);

      ctx.beginPath();
      ctx.moveTo(75, 75);
      ctx.lineTo(181, 75);
      ctx.lineTo(220, 128);
      ctx.lineTo(128, 220);
      ctx.lineTo(36, 128);
      ctx.closePath();
      ctx.fillStyle = '#ec4899';
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(75, 75);
      ctx.lineTo(128, 128);
      ctx.lineTo(181, 75);
      ctx.fillStyle = '#f472b6';
      ctx.fill();
    } else if (type === 'leaf') {
      ctx.fillStyle = '#064e3b';
      ctx.fillRect(0, 0, 256, 256);

      ctx.beginPath();
      ctx.moveTo(40, 216);
      ctx.quadraticCurveTo(40, 40, 216, 40);
      ctx.quadraticCurveTo(216, 216, 40, 216);
      ctx.fillStyle = '#10b981';
      ctx.fill();
    } else {
      ctx.fillStyle = '#0b0f19';
      ctx.fillRect(0, 0, 256, 256);
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(128, 128, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    return c.toDataURL('image/png');
  }

  window.sampleImages = [
    { name: "Shield Logo", type: "image/png", url: drawSampleCanvas('shield') },
    { name: "Pink Gem", type: "image/png", url: drawSampleCanvas('gem') },
    { name: "Green Leaf", type: "image/png", url: drawSampleCanvas('leaf') },
    { name: "Amber Badge", type: "image/png", url: drawSampleCanvas('badge') }
  ];
})();
