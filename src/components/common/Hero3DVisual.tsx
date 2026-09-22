import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DVisual: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const width = mount.clientWidth || 480;
    const height = mount.clientHeight || 480;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 18);

    // Renderer
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4f8cff, 3, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8b5cf6, 3, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    const cyanLight = new THREE.PointLight(0x22d3ee, 2, 40);
    cyanLight.position.set(0, 8, -5);
    scene.add(cyanLight);

    // Group for entire rig
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Core Sphere (Glowing Inner Core)
    const innerGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0b1026,
      emissive: 0x4f8cff,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: false,
    });
    const innerSphere = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerSphere);

    // 2. Wireframe / Icosahedron Geodesic Cage
    const cageGeo = new THREE.IcosahedronGeometry(3.6, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // Outer faint aura
    const auraGeo = new THREE.SphereGeometry(4.2, 24, 24);
    const auraMat = new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const auraMesh = new THREE.Mesh(auraGeo, auraMat);
    coreGroup.add(auraMesh);

    // 3. Orbital Rings
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0x4f8cff,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide,
    });
    const ringGeo1 = new THREE.RingGeometry(5.2, 5.25, 64);
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    coreGroup.add(ring1);

    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x8b5cf6,
      transparent: true,
      opacity: 0.3,
      side: THREE.DoubleSide,
    });
    const ringGeo2 = new THREE.RingGeometry(6.6, 6.65, 64);
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    coreGroup.add(ring2);

    // 4. Orbiting Coding Tokens (<>, {}, C, PY, JS, AI)
    const tokens = [
      { text: '</>', color: '#4F8CFF', radius: 5.6, speed: 0.8, yOffset: 0 },
      { text: '{ }', color: '#8B5CF6', radius: 6.2, speed: -0.6, yOffset: 1.2 },
      { text: 'AI', color: '#22D3EE', radius: 5.0, speed: 0.9, yOffset: -1.0 },
      { text: 'C', color: '#A78BFA', radius: 6.8, speed: -0.7, yOffset: -0.5 },
      { text: 'PY', color: '#38BDF8', radius: 7.2, speed: 0.5, yOffset: 1.5 },
      { text: 'JS', color: '#FCD34D', radius: 5.8, speed: -0.85, yOffset: -1.3 },
    ];

    const tokenObjects: {
      sprite: THREE.Sprite;
      radius: number;
      speed: number;
      yOffset: number;
      angle: number;
    }[] = [];

    tokens.forEach((t, i) => {
      const tc = document.createElement('canvas');
      tc.width = 160;
      tc.height = 80;
      const tctx = tc.getContext('2d');
      if (tctx) {
        // Pill background
        tctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        tctx.strokeStyle = t.color;
        tctx.lineWidth = 4;
        tctx.beginPath();
        tctx.roundRect(10, 10, 140, 60, 20);
        tctx.fill();
        tctx.stroke();

        // Text
        tctx.font = 'bold 30px monospace';
        tctx.fillStyle = t.color;
        tctx.textAlign = 'center';
        tctx.textBaseline = 'middle';
        tctx.fillText(t.text, 80, 40);
      }

      const tex = new THREE.CanvasTexture(tc);
      const mat = new THREE.SpriteMaterial({
        map: tex,
        transparent: true,
        opacity: 0.95,
      });
      const sprite = new THREE.Sprite(mat);
      sprite.scale.set(1.8, 0.9, 1);
      coreGroup.add(sprite);

      tokenObjects.push({
        sprite,
        radius: t.radius,
        speed: t.speed,
        yOffset: t.yOffset,
        angle: (i * (Math.PI * 2)) / tokens.length,
      });
    });

    // Mouse Tracking for Parallax
    let targetRotX = 0;
    let targetRotY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = x * 0.8;
      targetRotX = y * 0.8;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!mount || !renderer) return;
      const nw = mount.clientWidth || 480;
      const nh = mount.clientHeight || 480;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth mouse interaction
      coreGroup.rotation.y += (targetRotY - coreGroup.rotation.y) * 0.05;
      coreGroup.rotation.x += (targetRotX - coreGroup.rotation.x) * 0.05;

      if (!prefersReducedMotion) {
        // Core animations
        innerSphere.rotation.y += delta * 0.3;
        cageMesh.rotation.y -= delta * 0.2;
        cageMesh.rotation.x += delta * 0.15;
        auraMesh.rotation.z += delta * 0.1;

        ring1.rotation.z += delta * 0.25;
        ring2.rotation.z -= delta * 0.2;

        // Subtle core pulse
        const pulse = 1 + Math.sin(elapsed * 2) * 0.03;
        innerSphere.scale.set(pulse, pulse, pulse);

        // Orbit tokens
        tokenObjects.forEach((tok) => {
          tok.angle += tok.speed * delta * 0.8;
          tok.sprite.position.x = Math.cos(tok.angle) * tok.radius;
          tok.sprite.position.z = Math.sin(tok.angle) * tok.radius;
          tok.sprite.position.y = tok.yOffset + Math.sin(elapsed * 1.5 + tok.angle) * 0.4;
        });
      }

      if (renderer) {
        renderer.render(scene, camera);
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(animate);
      }
    };

    if (prefersReducedMotion) {
      if (renderer) renderer.render(scene, camera);
    } else {
      animate();
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (animId) cancelAnimationFrame(animId);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
        }
      }

      innerGeo.dispose();
      innerMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      auraGeo.dispose();
      auraMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      tokenObjects.forEach((t) => {
        (t.sprite.material as THREE.SpriteMaterial).map?.dispose();
        t.sprite.material.dispose();
      });
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center">
      {/* Ambient background glow behind 3D core */}
      <div className="absolute h-72 w-72 rounded-full bg-gradient-to-tr from-[#4F8CFF]/25 via-[#8B5CF6]/30 to-[#22D3EE]/25 blur-3xl" />
      <div
        ref={mountRef}
        className="relative h-[380px] w-[380px] sm:h-[460px] sm:w-[460px] lg:h-[520px] lg:w-[520px] cursor-grab active:cursor-grabbing select-none"
        aria-label="3D Interactive CodeMate AI Core"
      />
    </div>
  );
};
