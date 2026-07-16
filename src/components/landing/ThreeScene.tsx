import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ThreeSceneProps {
  className?: string;
}

const VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  
  void main() {
    vUv = uv;
    vec3 pos = position;
    float wave = sin(pos.x * 2.5 + uTime * 0.6) * 0.06
               + cos(pos.y * 2.0 + uTime * 0.5) * 0.06;
    pos.z += wave;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vViewPosition = -mvPosition.xyz;
    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const FRAGMENT_SHADER = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  
  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(vViewPosition);
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
    float pattern = 0.5 + 0.5 * sin(uTime * 0.4 + vUv.x * 7.0 + vUv.y * 5.0);
    vec3 col = mix(uColorA, uColorB, pattern * 0.7);
    col += vec3(1.0) * fresnel * 0.6;
    gl_FragColor = vec4(col, 0.75 + fresnel * 0.25);
  }
`;

const PARTICLE_VERTEX = `
  attribute float aSize;
  attribute float aOpacity;
  varying float vOpacity;
  uniform float uTime;
  
  void main() {
    vOpacity = aOpacity;
    vec3 pos = position;
    pos.y += sin(pos.x * 0.5 + uTime * 0.3) * 0.8;
    pos.x += cos(pos.z * 0.4 + uTime * 0.2) * 0.5;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const PARTICLE_FRAGMENT = `
  varying float vOpacity;
  uniform vec3 uColor;
  
  void main() {
    vec2 xy = gl_PointCoord * 2.0 - 1.0;
    float r = dot(xy, xy);
    if (r > 1.0) discard;
    float alpha = (1.0 - sqrt(r)) * vOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`;

export const ThreeScene: React.FC<ThreeSceneProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglOk, setWebglOk] = useState(true);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // WebGL check
    try {
      const testCanvas = document.createElement('canvas');
      const ctx = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!ctx) throw new Error('no webgl');
    } catch {
      setWebglOk(false);
      return;
    }

    // ── RENDERER ──
    const renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ──
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 8);

    // ── FLOATING GLASS SHAPES ──
    const shapes: Array<{ mesh: THREE.Mesh; speed: number; axis: THREE.Vector3 }> = [];
    const uniforms = {
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color('#6C47FF') },
      uColorB: { value: new THREE.Color('#F40076') },
    };

    const shapeConfigs = [
      { geo: new THREE.IcosahedronGeometry(1.1, 1), pos: [-3.5, 1.5, -2], speed: 0.18 },
      { geo: new THREE.OctahedronGeometry(0.8, 0), pos: [3.8, -1.2, -3], speed: 0.22 },
      { geo: new THREE.IcosahedronGeometry(0.6, 0), pos: [2.5, 2.5, -1.5], speed: 0.15 },
      { geo: new THREE.TetrahedronGeometry(0.7, 0), pos: [-3, -2, -2.5], speed: 0.28 },
      { geo: new THREE.IcosahedronGeometry(0.4, 1), pos: [0.5, -3, -1], speed: 0.2 },
    ];

    shapeConfigs.forEach(({ geo, pos, speed }) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: VERTEX_SHADER,
        fragmentShader: FRAGMENT_SHADER,
        uniforms: { ...uniforms },
        transparent: true,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...(pos as [number, number, number]));
      scene.add(mesh);
      shapes.push({ mesh, speed, axis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize() });
    });

    // ── PARTICLES ──
    const PARTICLE_COUNT = 600;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const opacities = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
      sizes[i]             = Math.random() * 3 + 1;
      opacities[i]         = Math.random() * 0.6 + 0.1;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    particleGeo.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

    // Two particle systems – purple and cyan
    const pMatPurple = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      uniforms: { uTime: uniforms.uTime, uColor: { value: new THREE.Color('#6C47FF') } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const pMatCyan = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      uniforms: { uTime: uniforms.uTime, uColor: { value: new THREE.Color('#00C2FF') } },
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });

    const particles1 = new THREE.Points(particleGeo, pMatPurple);
    const particles2 = new THREE.Points(particleGeo.clone(), pMatCyan);
    particles2.rotation.z = Math.PI;
    scene.add(particles1, particles2);

    // ── MOUSE REACTIVE ──
    const mouse = { x: 0, y: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // ── RESIZE ──
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ── ANIMATION LOOP ──
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      uniforms.uTime.value = elapsed;

      // Rotate shapes
      shapes.forEach(({ mesh, speed, axis }) => {
        mesh.rotateOnAxis(axis, speed * 0.005);
        // Gentle float
        mesh.position.y += Math.sin(elapsed * speed + mesh.position.x) * 0.001;
      });

      // Camera gentle drift following mouse
      camera.position.x += (mouse.x * 0.5 - camera.position.x) * 0.02;
      camera.position.y += (mouse.y * 0.3 - camera.position.y) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      shapes.forEach(({ mesh }) => {
        mesh.geometry.dispose();
        (mesh.material as THREE.Material).dispose();
      });
      particleGeo.dispose();
      pMatPurple.dispose();
      pMatCyan.dispose();
    };
  }, []);

  if (!webglOk) {
    return (
      <div className={`${className} bg-gradient-to-br from-[#0A0A0F] via-[#120A24] to-[#0A1230]`} />
    );
  }

  return <div ref={mountRef} className={className} />;
};
