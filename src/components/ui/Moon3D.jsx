import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Realistic, interactive 3D Moon rendered with plain Three.js.
 *
 * Features:
 *  - Sphere with a real lunar surface texture + a derived bump map for crater
 *    relief, lit by a directional "sun" so a realistic day/night terminator is
 *    visible.
 *  - Slow, continuous auto-rotation by default.
 *  - Click / drag (desktop) and touch (mobile) to rotate; smooth damping and
 *    inertia on release; auto-rotation resumes shortly after the user lets go.
 *  - Zoom and pan are disabled; only rotation is allowed.
 *  - Respects prefers-reduced-motion (no auto-rotation, single static render).
 *  - Cleans up all GPU resources on unmount.
 *
 * Props:
 *  autoRotateSpeed  – auto-rotation speed (OrbitControls units). 0 disables.
 *  interactive      – enable pointer drag rotation.
 *  className        – forwarded to the canvas element.
 */

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

const COLOR_TEX_URL = "/images/moon/moon_color_2k.jpg";

// Build a bump map from the color texture by converting it to grayscale with
// contrast enhancement. This avoids shipping a second large image while still
// giving the craters real dimensional relief under the directional light.
function makeBumpTexture(colorTex) {
  const img = colorTex.image;
  if (!img || !img.width) return null;
  const w = Math.min(1024, img.width);
  const h = Math.floor((w / img.width) * img.height);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  for (let i = 0; i < data.length; i += 4) {
    // Luminance with a contrast curve around mid-gray.
    let lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114) / 255;
    lum = Math.pow(lum, 1.1) * 255;
    const v = lum;
    data[i] = data[i + 1] = data[i + 2] = v;
    data[i + 3] = 255;
  }
  ctx.putImageData(ctx.getImageData(0, 0, w, h), 0, 0);
  const bump = new THREE.CanvasTexture(canvas);
  bump.colorSpace = THREE.NoColorSpace;
  bump.anisotropy = 4;
  return bump;
}

export default function Moon3D({
  autoRotateSpeed = 0.18,
  interactive = true,
  className,
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 3.5);

    // --- Moon body ---
    const geometry = new THREE.SphereGeometry(1, 96, 96);
    const material = new THREE.MeshStandardMaterial({
      roughness: 1,
      metalness: 0,
      color: 0xffffff,
    });
    const moon = new THREE.Mesh(geometry, material);
    scene.add(moon);

    // --- Lighting ---
    const sun = new THREE.DirectionalLight(0xfff4e6, 2.2);
    sun.position.set(5, 1.5, 3);
    scene.add(sun);

    const ambient = new THREE.AmbientLight(0x445066, 0.22);
    scene.add(ambient);

    // --- Controls ---
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.6;
    controls.enableRotate = interactive;
    // Auto-rotation is decoupled from drag interaction so the Moon also turns
    // on non-interactive screens (e.g. the loading overlay). Reduced motion is
    // always respected.
    controls.autoRotate = !REDUCED_MOTION;
    controls.autoRotateSpeed = autoRotateSpeed;
    controls.minPolarAngle = 0.2;
    controls.maxPolarAngle = Math.PI - 0.2;

    // Pause auto-rotation while the user drags; resume shortly after release.
    let resumeTimer = 0;
    const onStart = () => {
      controls.autoRotate = false;
      if (resumeTimer) clearTimeout(resumeTimer);
    };
    const onEnd = () => {
      if (!interactive || REDUCED_MOTION) return;
      resumeTimer = setTimeout(() => {
        controls.autoRotate = true;
      }, 1800);
    };
    controls.addEventListener("start", onStart);
    controls.addEventListener("end", onEnd);

    // --- Size handling ---
    const resize = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      const verticalHalfFov = THREE.MathUtils.degToRad(camera.fov / 2);
      const horizontalHalfFov = Math.atan(
        Math.tan(verticalHalfFov) * camera.aspect,
      );
      const limitingHalfFov = Math.min(verticalHalfFov, horizontalHalfFov);
      camera.position.z = 1 / Math.sin(limitingHalfFov * 0.85);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // --- Texture loading (async) + bump derivation ---
    const loader = new THREE.TextureLoader();
    let disposed = false;
    let raf = 0;
    let bumpTex = null;

    const renderStatic = () => {
      controls.update();
      renderer.render(scene, camera);
    };

    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (REDUCED_MOTION) {
        renderStatic();
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    loader.load(
      COLOR_TEX_URL,
      (colorTex) => {
        if (disposed) {
          colorTex.dispose();
          return;
        }
        colorTex.colorSpace = THREE.SRGBColorSpace;
        colorTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
        material.map = colorTex;
        bumpTex = makeBumpTexture(colorTex);
        if (bumpTex) {
          material.bumpMap = bumpTex;
          material.bumpScale = 0.018;
        }
        material.needsUpdate = true;
        startLoop();
      },
      undefined,
      () => {
        // Fallback: render without a texture if the image fails to load.
        if (!disposed) startLoop();
      },
    );

    // --- Cleanup ---
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      if (resumeTimer) clearTimeout(resumeTimer);
      ro.disconnect();
      controls.removeEventListener("start", onStart);
      controls.removeEventListener("end", onEnd);
      controls.dispose();
      geometry.dispose();
      material.dispose();
      if (material.map) material.map.dispose();
      if (bumpTex) bumpTex.dispose();
      renderer.dispose();
    };
  }, [autoRotateSpeed, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ touchAction: interactive ? "none" : "auto", display: "block" }}
      aria-hidden="true"
    />
  );
}
