import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function AnimatedBackground() {
  const { animatedBg, primaryColor } = useTheme();
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!animatedBg) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = window.innerWidth;
      height = canvasRef.current.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Grid animation state
    let phase = 0;

    // Helper to convert hex to rgba
    const hexToRgba = (hex, opacity) => {
      let c;
      if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
          c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return `rgba(${(c >> 16) & 255}, ${(c >> 8) & 255}, ${c & 255}, ${opacity})`;
      }
      return `rgba(73, 75, 214, ${opacity})`; // Fallback
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const gridSpacing = 60;
      const strokeColor = hexToRgba(primaryColor, 0.035);
      const dotColor = hexToRgba(primaryColor, 0.08);

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1;

      phase += 0.002;

      // Draw vertical lines with wave-like horizontal shift
      for (let x = 0; x < width + gridSpacing; x += gridSpacing) {
        ctx.beginPath();
        for (let y = 0; y < height; y += 20) {
          const shift = Math.sin(y * 0.004 + phase + (x * 0.001)) * 6;
          if (y === 0) {
            ctx.moveTo(x + shift, y);
          } else {
            ctx.lineTo(x + shift, y);
          }
        }
        ctx.stroke();
      }

      // Draw horizontal lines with wave-like vertical shift
      for (let y = 0; y < height + gridSpacing; y += gridSpacing) {
        ctx.beginPath();
        for (let x = 0; x < width; x += 20) {
          const shift = Math.cos(x * 0.004 + phase + (y * 0.001)) * 6;
          if (x === 0) {
            ctx.moveTo(x, y + shift);
          } else {
            ctx.lineTo(x, y + shift);
          }
        }
        ctx.stroke();
      }

      // Draw intersection dots for an architectural schematic look
      for (let x = 0; x < width + gridSpacing; x += gridSpacing) {
        for (let y = 0; y < height + gridSpacing; y += gridSpacing) {
          const shiftX = Math.sin(y * 0.004 + phase + (x * 0.001)) * 6;
          const shiftY = Math.cos(x * 0.004 + phase + (y * 0.001)) * 6;

          ctx.fillStyle = dotColor;
          ctx.beginPath();
          ctx.arc(x + shiftX, y + shiftY, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [animatedBg, primaryColor]);

  if (!animatedBg) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
