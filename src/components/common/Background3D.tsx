import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Background3DProps {
  opacity?: number;
  className?: string;
  interactive?: boolean;
}

export const Background3D: React.FC<Background3DProps> = ({
  opacity = 0.85,
  className = '',
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050816, 0.002);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 250;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
    } catch {
      // WebGL not supported or disabled - gracefully degrade
      return;
    }

    // 1. NEURAL NODES & CONNECTING LINES
    const nodeCount = 45;
    const nodeCoords: THREE.Vector3[] = [];
    const nodeVelocities: THREE.Vector3[] = [];
    const spread = 240;

    for (let i = 0; i < nodeCount; i++) {
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * spread * 2,
        (Math.random() - 0.5) * spread * 1.5,
        (Math.random() - 0.5) * spread
      );
      nodeCoords.push(pos);
      nodeVelocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.12,
          (Math.random() - 0.5) * 0.08
        )
      );
    }

    // Node spheres
    const nodeGeo = new THREE.BufferGeometry();
    const nodePositions = new Float32Array(nodeCount * 3);
    const nodeColors = new Float32Array(nodeCount * 3);

    const colorBlue = new THREE.Color(0x4f8cff);
    const colorViolet = new THREE.Color(0x8b5cf6);
    const colorCyan = new THREE.Color(0x22d3ee);

    for (let i = 0; i < nodeCount; i++) {
      nodePositions[i * 3] = nodeCoords[i].x;
      nodePositions[i * 3 + 1] = nodeCoords[i].y;
      nodePositions[i * 3 + 2] = nodeCoords[i].z;

      const c = i % 3 === 0 ? colorBlue : i % 3 === 1 ? colorViolet : colorCyan;
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;
    }

    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));

    // Particle sprite texture (circular glow)
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(139, 92, 246, 0.8)');
      gradient.addColorStop(0.7, 'rgba(79, 140, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(5, 8, 22, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 64, 64);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const nodeMaterial = new THREE.PointsMaterial({
      size: 7,
      map: particleTexture,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMaterial);
    scene.add(nodePoints);

    // Neural connecting lines geometry
    const maxConnections = (nodeCount * (nodeCount - 1)) / 2;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineColors = new Float32Array(maxConnections * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const lineMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineMesh);

    // 2. BACKGROUND FLOATING PARTICLES (Dust / Stars)
    const dustCount = 120;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);

    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 600;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 400;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 400;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustMat = new THREE.PointsMaterial({
      size: 3.5,
      color: 0x4f8cff,
      transparent: true,
      opacity: 0.45,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);

    // 3. FLOATING CODE SYMBOLS (Canvas Sprites)
    const codeSymbols = ['</>', '{ }', '// AI', 'C', 'Py', 'JS', 'ptr*', 'main()', '0x2A', 'return 1;'];
    const symbolSprites: THREE.Sprite[] = [];

    codeSymbols.forEach((sym, idx) => {
      const sc = document.createElement('canvas');
      sc.width = 128;
      sc.height = 64;
      const sctx = sc.getContext('2d');
      if (sctx) {
        sctx.font = 'bold 24px monospace';
        sctx.fillStyle = idx % 2 === 0 ? 'rgba(79, 140, 255, 0.4)' : 'rgba(139, 92, 246, 0.4)';
        sctx.textAlign = 'center';
        sctx.textBaseline = 'middle';
        sctx.fillText(sym, 64, 32);
      }
      const symTex = new THREE.CanvasTexture(sc);
      const spriteMat = new THREE.SpriteMaterial({
        map: symTex,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.set(
        (Math.random() - 0.5) * 360,
        (Math.random() - 0.5) * 220,
        (Math.random() - 0.5) * 180
      );
      sprite.scale.set(32, 16, 1);
      scene.add(sprite);
      symbolSprites.push(sprite);
    });

    // 4. MOUSE PARALLAX
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 35;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 35;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container || !renderer) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // 5. ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      camera.position.x = mouseX;
      camera.position.y = -mouseY;
      camera.lookAt(scene.position);

      if (!prefersReducedMotion) {
        // Move neural nodes
        const posAttr = nodeGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < nodeCount; i++) {
          const pos = nodeCoords[i];
          const vel = nodeVelocities[i];

          pos.add(vel);

          // Boundary bouncing
          if (Math.abs(pos.x) > spread) vel.x *= -1;
          if (Math.abs(pos.y) > spread * 0.75) vel.y *= -1;
          if (Math.abs(pos.z) > spread * 0.5) vel.z *= -1;

          posAttr.setXYZ(i, pos.x, pos.y, pos.z);
        }
        posAttr.needsUpdate = true;

        // Update connecting lines
        let lineIdx = 0;
        const connectionDist = 65;

        for (let i = 0; i < nodeCount; i++) {
          for (let j = i + 1; j < nodeCount; j++) {
            const p1 = nodeCoords[i];
            const p2 = nodeCoords[j];
            const dist = p1.distanceTo(p2);

            if (dist < connectionDist) {
              const alpha = (1 - dist / connectionDist) * 0.5;

              linePositions[lineIdx * 6] = p1.x;
              linePositions[lineIdx * 6 + 1] = p1.y;
              linePositions[lineIdx * 6 + 2] = p1.z;
              linePositions[lineIdx * 6 + 3] = p2.x;
              linePositions[lineIdx * 6 + 4] = p2.y;
              linePositions[lineIdx * 6 + 5] = p2.z;

              // Color blend
              lineColors[lineIdx * 6] = 0.31 * alpha;
              lineColors[lineIdx * 6 + 1] = 0.55 * alpha;
              lineColors[lineIdx * 6 + 2] = 1.0 * alpha;
              lineColors[lineIdx * 6 + 3] = 0.55 * alpha;
              lineColors[lineIdx * 6 + 4] = 0.36 * alpha;
              lineColors[lineIdx * 6 + 5] = 0.96 * alpha;

              lineIdx++;
            }
          }
        }
        lineGeo.setDrawRange(0, lineIdx * 2);
        (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
        (lineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

        // Gentle rotate dust
        dustPoints.rotation.y = time * 0.02;
        dustPoints.rotation.x = time * 0.01;

        // Drift symbols
        symbolSprites.forEach((sp, i) => {
          sp.position.y += Math.sin(time * 0.5 + i) * 0.12;
          sp.position.x += Math.cos(time * 0.3 + i) * 0.08;
        });
      }

      if (renderer) {
        renderer.render(scene, camera);
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // Render initial frame
    if (prefersReducedMotion) {
      if (renderer) renderer.render(scene, camera);
    } else {
      animate();
    }

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      nodeGeo.dispose();
      nodeMaterial.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      dustGeo.dispose();
      dustMat.dispose();
      particleTexture.dispose();
      symbolSprites.forEach((s) => {
        (s.material as THREE.SpriteMaterial).map?.dispose();
        s.material.dispose();
      });
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{ opacity }}
      className={`pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#050816] transition-opacity duration-700 ${className}`}
    />
  );
};
