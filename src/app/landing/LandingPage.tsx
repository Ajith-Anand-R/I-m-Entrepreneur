import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Zap, BookOpen, MessageSquare,
  Award, Download, CheckCircle2, ChevronRight,
  TrendingUp, Wallet, Layers
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import * as THREE from 'three';

// ── CUSTOM SHADER FOR THE 3D BOOK COVER (LIQUID GLASS AESTHETIC) ──
const WavyShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uTime;
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Procedural wavy deformation
      float wave = sin(pos.x * 2.0 + uTime * 0.8) * 0.05 + cos(pos.y * 2.0 + uTime * 0.6) * 0.05;
      pos.z += wave;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      vViewPosition = -mvPosition.xyz;
      vNormal = normalMatrix * normal;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    uniform float uTime;
    uniform vec3 uBaseColor;
    uniform vec3 uAccentColor;
    
    void main() {
      // Normal for fresnel
      vec3 normal = normalize(vNormal);
      vec3 viewDir = normalize(vViewPosition);
      
      // Iridescent light calc
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);
      
      // Morphing wave pattern
      float pattern = 0.5 + 0.5 * sin(uTime + vUv.x * 8.0 + vUv.y * 6.0);
      
      // Color mixing with metallic gloss
      vec3 mixedColor = mix(uBaseColor, uAccentColor, pattern * 0.6);
      vec3 finalColor = mixedColor + (vec3(1.0) * fresnel * 0.8);
      
      // Translucent liquid glass feel
      gl_FragColor = vec4(finalColor, 0.85);
    }
  `
};

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  
  // PWA States
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);
  
  // WebGL Compatibility State
  const [webglSupported, setWebglSupported] = useState(true);
  
  // Interactive UI States
  const [activeTab, setActiveTab] = useState<'journey' | 'mentors' | 'academy' | 'funding'>('journey');
  const [activePhase, setActivePhase] = useState(0);

  // ── PWA INITIALIZATION ──
  useEffect(() => {
    // Check if app is installed
    if (window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallSuccess(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const triggerPWAInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      // Check if iOS Safari
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
      if (isIOS) {
        setShowIOSHint(true);
      } else {
        alert("To install LAARISH FounderOS PWA:\n\n1. Look for the install option in your browser address bar (Google Chrome / Microsoft Edge).\n2. If not found, your browser might not support automatic install prompts, or the app is already installed.");
      }
    }
  };

  // ── THREE.JS 3D CANVAS LOOP ──
  useEffect(() => {
    // Check WebGL availability
    const checkWebGL = () => {
      try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
      } catch (e) {
        return false;
      }
    };

    if (!checkWebGL()) {
      setWebglSupported(false);
      return;
    }

    if (!canvasContainerRef.current) return;
    const container = canvasContainerRef.current;
    
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 500;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.5);
    
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0xa16207, 4.0, 15);
    pointLight1.position.set(4, 3, 3);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x6c47ff, 3.0, 15);
    pointLight2.position.set(-4, -3, 2);
    scene.add(pointLight2);
    
    // 3D Morphing Book Mesh (Liquid Glass Material)
    const bookGeometry = new THREE.BoxGeometry(1.6, 2.4, 0.2, 32, 32, 4);
    
    const bookMaterial = new THREE.ShaderMaterial({
      vertexShader: WavyShader.vertexShader,
      fragmentShader: WavyShader.fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uBaseColor: { value: new THREE.Color('#1C1917') }, // Premium Dark Charcoal
        uAccentColor: { value: new THREE.Color('#A16207') } // Gold Highlight
      },
      transparent: true,
      depthWrite: true,
      side: THREE.DoubleSide
    });
    
    const bookGroup = new THREE.Group();
    const bookMesh = new THREE.Mesh(bookGeometry, bookMaterial);
    bookGroup.add(bookMesh);
    
    // Elegant Gold Wireframe Overlay
    const wireframeGeom = new THREE.BoxGeometry(1.62, 2.42, 0.22, 10, 10, 1);
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xdfba73,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const wireframeMesh = new THREE.Mesh(wireframeGeom, wireframeMat);
    bookGroup.add(wireframeMesh);
    
    scene.add(bookGroup);
    
    // Glowing Dust Particles System
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randomScales = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Orbit placements
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.4 + Math.random() * 1.8;
      positions[i] = Math.cos(angle) * radius;
      positions[i + 1] = (Math.random() - 0.5) * 3;
      positions[i + 2] = (Math.random() - 0.5) * 1.5;
      
      randomScales[i / 3] = Math.random();
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    // Custom soft point texture using Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
      grad.addColorStop(0, 'rgba(223, 186, 115, 1)');
      grad.addColorStop(1, 'rgba(223, 186, 115, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 16, 16);
    }
    
    const particleTexture = new THREE.CanvasTexture(canvas);
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.12,
      map: particleTexture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Mouse Interactive Tilt variables
    let targetX = 0;
    let targetY = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentWidth = rect.width || 300;
      const currentHeight = rect.height || 500;
      const x = ((e.clientX - rect.left) / currentWidth) * 2 - 1;
      const y = -((e.clientY - rect.top) / currentHeight) * 2 + 1;
      
      targetX = x * 0.5;
      targetY = y * 0.4;
    };
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Animation Loop
    const clock = new THREE.Clock();
    let animFrameId: number;
    
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      
      // Update shader uniforms
      bookMaterial.uniforms.uTime.value = elapsedTime;
      
      // Smooth interpolation for book tilt
      bookGroup.rotation.y += (targetX - bookGroup.rotation.y) * 0.05;
      bookGroup.rotation.x += (targetY - bookGroup.rotation.x) * 0.05;
      
      // Ambient floating animations
      bookGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.12;
      bookGroup.rotation.z = Math.cos(elapsedTime * 0.6) * 0.05;
      
      // Rotate particles orbits slowly
      particles.rotation.y = elapsedTime * 0.08;
      particles.rotation.z = elapsedTime * 0.03;
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 500;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      
      renderer.setSize(w, h);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animFrameId);
      
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      bookGeometry.dispose();
      bookMaterial.dispose();
      wireframeGeom.dispose();
      wireframeMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  // ── CONTENT DATA ──
  const journeyPhases = [
    { title: "Mindset", desc: "Why entrepreneurship? Habit trackers, life goals, strengths mapping." },
    { title: "Idea Discovery", desc: "Problems around me, frustrations, industry trends & brainstorming frameworks." },
    { title: "Validation", desc: "Customer interviews, survey structures, pain-point analytics." },
    { title: "Market Research", desc: "TAM, SAM, SOM calculations, customer personas & competitor grids." },
    { title: "Solution Design", desc: "Design Thinking sprints, value propositions, and core wireframes." },
    { title: "Business Model", desc: "Lean Canvas setup, pricing mechanics & unit economics calculators." },
    { title: "Brand Identity", desc: "Logo vectors, core company values, and brand style sheets." },
    { title: "MVP Blueprint", desc: "Prioritized feature maps, user story mapping & testing protocols." },
    { title: "Financials", desc: "Start costs, revenue forecasts, break-even graphs, cash runway." },
    { title: "Legal/GST", desc: "GST, intellectual property registry, founder covenants, DPIIT checklists." },
    { title: "Funding Prep", desc: "Bootstrapping matrix, Karnataka ELEVATE/BIRAC rules & investor mapping." },
    { title: "Pitch Ready", desc: "Storytelling outlines, demo frameworks & mock Q&A scripts." },
    { title: "Launch Deck", desc: "Social media calendar, acquisition channels, and Go-to-market milestones." },
    { title: "Scale Matrix", desc: "Hiring boards, leadership principles, operations & expansion." },
    { title: "Reflection", desc: "Weekly & monthly retro logs, metrics tracking & next level plans." }
  ];

  const mentors = [
    { name: "Idea Validation Mentor", role: "Framing & Stress Testing", spec: "Lean startup strategies" },
    { name: "Market Research Mentor", role: "TAM/SAM/SOM Auditor", spec: "Ecosystem competitive scraping" },
    { name: "Design Thinking Mentor", role: "Customer Journey Mapping", spec: "UX & user flows" },
    { name: "Finance & Legal Mentor", role: "Runway & DPIIT Specialist", spec: "Units economics & compliance" },
    { name: "Startup India & Grants Coach", role: "Karnataka ELEVATE / BIRAC Guide", spec: "Govt proposals audits" },
    { name: "Pitch Deck Auditor", role: "Storytelling & VC Readiness", spec: "Investor presentations" }
  ];

  const academyPaths = [
    { label: "Student Founders", items: ["College Sandbox", "IP Protection", "Campus Accelerators"] },
    { label: "First-Time Entrepreneurs", items: ["Zero to One Guide", "Unit Economics 101", "GTM Execution"] },
    { label: "MSMEs & Women Founders", items: ["Digital Expansion", "SIDBI Financial Grants", "E-commerce scale"] },
    { label: "Deep-tech / Researchers", items: ["DST Grants", "Lab to Market", "Patent filing blueprints"] }
  ];

  return (
    <div className="min-h-screen text-stone-900 luxury-gradient-bg font-luxury-sans overflow-x-hidden selection:bg-[#A16207]/25 selection:text-white relative">
      
      {/* BACKGROUND DECORATIVE ANIMATIONS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#A16207]/5 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#6C47FF]/5 blur-[120px]" />
      </div>

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 w-full bg-[#0C0A09]/75 backdrop-blur-md border-b border-[#A16207]/15">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-[#FAFAF9]"
              style={{
                background: 'linear-gradient(135deg, #DFBA73 0%, #A16207 100%)',
                boxShadow: '0 4px 20px rgba(161, 98, 7, 0.4)'
              }}>
              LF
            </div>
            <span className="font-luxury-serif text-lg font-bold text-white tracking-widest uppercase group-hover:text-[#DFBA73] transition-colors">
              LAARISH <span className="text-xs font-luxury-sans tracking-widest text-[#DFBA73] block mt-[-3px] font-black">FounderOS</span>
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-[13px] font-bold uppercase tracking-wider text-stone-400">
            <a href="#ecosystem" className="hover:text-white transition-colors">The Ecosystem</a>
            <a href="#three-usp" className="hover:text-white transition-colors">Phygital Book</a>
            <a href="#mentors" className="hover:text-white transition-colors">AI Mentors</a>
            <a href="#academy" className="hover:text-white transition-colors">Academy</a>
            <a href="#download" className="hover:text-white transition-colors">PWA App</a>
          </nav>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA73] to-[#A16207] text-[#0C0A09] hover:brightness-110 transition shadow-[0_4px_20px_rgba(161,98,7,0.35)] cursor-pointer">
                Enter Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block text-xs font-bold uppercase tracking-wider text-stone-400 hover:text-white transition cursor-pointer">
                  Sign In
                </Link>
                <Link to="/signup" className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#DFBA73] to-[#A16207] text-[#0C0A09] hover:brightness-110 transition shadow-[0_4px_20px_rgba(161,98,7,0.35)] cursor-pointer">
                  Launch OS
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── HERO SECTION WITH 3D CANVAS ── */}
      <section className="relative max-w-7xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        <div className="lg:col-span-7 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A16207]/15 border border-[#A16207]/30 text-[#DFBA73] text-[11px] font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-[#DFBA73]" />
            The Ultimate Startup Launchpad
          </div>
          
          <h1 className="text-4xl sm:text-6xl font-luxury-serif font-black text-white leading-[1.08]">
            From <span className="text-luxury-gold italic">Idea</span> to <span className="text-luxury-gold">Impact</span>
          </h1>
          
          <p className="text-stone-300 text-base sm:text-lg leading-relaxed max-w-xl">
            Laarish FounderOS is a complete, phygital startup workspace. Combining a physical, structured **Founder Development Book** with an **AI-powered command center**, it guides you step-by-step from zero to launch, funding, and scale.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 max-w-lg border-y border-[#A16207]/20 py-6">
            <div>
              <p className="text-2xl sm:text-3xl font-luxury-serif font-bold text-white">15</p>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Structured Phases</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-luxury-serif font-bold text-[#DFBA73]">14+</p>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">AI Mentors</p>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-luxury-serif font-bold text-white">100%</p>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mt-1">Phygital Sync</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Link to={user ? "/dashboard" : "/signup"} className="px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center bg-gradient-to-r from-[#DFBA73] to-[#A16207] text-[#0C0A09] hover:brightness-110 transition shadow-[0_8px_32px_rgba(161,98,7,0.3)]">
              Build My Startup
            </Link>
            <a href="#download" className="px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest text-center border border-[#A16207]/40 text-[#DFBA73] bg-[#0C0A09]/60 hover:bg-[#A16207]/10 transition">
              Download App
            </a>
          </div>
        </div>

        {/* 3D CANVAS WEBGL WRAPPER */}
        <div className="lg:col-span-5 h-[380px] sm:h-[500px] relative luxury-glass rounded-[40px] flex items-center justify-center p-6 border border-[#A16207]/20 shadow-inner group">
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0C0A09]/80 via-transparent to-transparent z-10 rounded-[40px]" />
          
          {/* Three.js canvas target or fallback */}
          {webglSupported ? (
            <div ref={canvasContainerRef} className="absolute inset-0 z-0" />
          ) : (
            <div className="absolute inset-0 z-0 flex items-center justify-center p-6">
              <img
                src="/founder_book_cover.png"
                alt="LAARISH Founder Book Cover"
                className="max-h-[85%] rounded-2xl border border-[#A16207]/30 shadow-2xl object-cover"
              />
            </div>
          )}
          
          <div className="absolute bottom-8 left-8 right-8 z-20 bg-stone-950/80 backdrop-blur-md p-5 rounded-2xl border border-stone-800 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#A16207]/20 border border-[#A16207]/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-[#DFBA73]" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest">3D Book Interactive Model</p>
              <p className="text-[10px] text-stone-400 mt-0.5">Move your cursor or swipe to tilt the digital twin</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE PROBLEM VS THE SOLUTION ── */}
      <section id="ecosystem" className="max-w-7xl mx-auto px-6 py-20 border-t border-stone-900">
        <div className="text-center space-y-4 max-w-2xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-[#DFBA73]">Fragmented Ecosystem</h2>
          <h3 className="text-3xl sm:text-4xl font-luxury-serif font-black text-white">Why Founders Fail Today</h3>
          <p className="text-stone-400 text-sm">
            Information is scattered. Aspiring founders bounce between YouTube, LinkedIn, ChatGPT, government portals, and local incubators. Laarish brings it all into one interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Problem Block */}
          <div className="bg-[#0C0A09]/60 border border-stone-900 p-8 rounded-3xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl" />
            <h4 className="font-luxury-serif text-xl font-bold text-stone-400">The Problem: Scattered Tools</h4>
            <ul className="space-y-4 text-xs font-medium text-stone-500">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                <span>Learning concepts on YouTube with no structured guidance.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                <span>Using ChatGPT for raw feedback that lacks local Indian startup context.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                <span>Applying for Karnataka ELEVATE or DST grants on confusing, isolated portals.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5" />
                <span>Filing NDAs, partnership agreements & Lean Canvases in plain Google Docs.</span>
              </li>
            </ul>
          </div>

          {/* Solution Block */}
          <div className="luxury-glass p-8 rounded-3xl space-y-6 relative overflow-hidden border border-[#A16207]/20">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#A16207]/10 rounded-full blur-2xl" />
            <h4 className="font-luxury-serif text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#DFBA73]" />
              The Solution: One Unified OS
            </h4>
            <ul className="space-y-4 text-xs font-semibold text-stone-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBA73] mt-1.5" />
                <span>Structured **15-Phase Journey Map** aligned with top international incubators.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBA73] mt-1.5" />
                <span>**14+ specialized AI Mentors** configured specifically for Indian legal, grant, and scale steps.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBA73] mt-1.5" />
                <span>**One-Click Document Generation** for legal contracts, SWOT summaries, and pitch briefs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DFBA73] mt-1.5" />
                <span>**Phygital Book Syncing**: Write in your book, scan, and let AI build your workspace.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── THE PHYGITAL USP (BOOK MOCKUP DISPLAY) ── */}
      <section id="three-usp" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="bg-[#0C0A09]/75 border border-[#A16207]/20 rounded-[48px] p-8 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
          <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] rounded-full bg-[#A16207]/5 blur-[160px]" />
          
          <div className="lg:col-span-5 flex justify-center">
            {/* Displaying AI Cover mock */}
            <div className="relative group max-w-[280px]">
              <div className="absolute inset-0 bg-[#A16207]/30 blur-2xl group-hover:scale-105 transition-transform duration-500 rounded-[30px]" />
              <img
                src="/founder_book_cover.png"
                alt="LAARISH Founder Book Cover"
                className="relative rounded-2xl border border-[#A16207]/40 shadow-2xl z-10 object-cover w-full group-hover:-translate-y-2 transition-transform duration-500"
              />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DFBA73]">Physically Anchored, AI Powered</span>
            <h3 className="text-3xl sm:text-4xl font-luxury-serif font-black text-white">The Phygital Founder Book</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              This is not a regular blank notebook. It is a professionally formatted Founder Development Workbook. Each page matches one of our **15 startup execution phases** and contains a unique, high-security QR key.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-stone-300">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <CheckCircle2 className="w-5 h-5 text-[#DFBA73]" />
                Handwriting To Digital Text
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <CheckCircle2 className="w-5 h-5 text-[#DFBA73]" />
                Auto Diagram Parsing
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <CheckCircle2 className="w-5 h-5 text-[#DFBA73]" />
                Progress Tracker Sync
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-stone-900/60 border border-stone-800">
                <CheckCircle2 className="w-5 h-5 text-[#DFBA73]" />
                Dynamic Linking of Pages
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── INTERACTIVE TAB EXPLORER (JOURNEY, MENTORS, ACADEMY, FUNDING) ── */}
      <section className="max-w-7xl mx-auto px-6 py-12 z-10 relative">
        <div className="flex flex-wrap justify-center gap-3 border-b border-stone-900 pb-4 mb-12">
          {[
            { id: 'journey', label: '15 Journeys', icon: BookOpen },
            { id: 'mentors', label: 'AI Mentors Room', icon: MessageSquare },
            { id: 'academy', label: 'Founder Academy', icon: Award },
            { id: 'funding', label: 'Funding Hub', icon: Wallet }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 border transition ${
                  active
                    ? 'border-[#A16207] bg-[#A16207]/10 text-white shadow-md'
                    : 'border-transparent text-stone-400 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-[#DFBA73]' : 'text-stone-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Panels */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'journey' && (
              <motion.div
                key="journey-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
              >
                {/* Phases List */}
                <div className="lg:col-span-4 max-h-[480px] overflow-y-auto space-y-2 pr-3 scrollbar-thin">
                  {journeyPhases.map((phase, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePhase(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                        activePhase === idx
                          ? 'border-[#A16207]/40 bg-[#A16207]/10 text-white'
                          : 'border-transparent text-stone-400 hover:bg-stone-900/50 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-md ${
                          activePhase === idx ? 'bg-[#A16207] text-[#FAFAF9]' : 'bg-stone-800 text-stone-400'
                        }`}>
                          P{idx + 1}
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wide">{phase.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ))}
                </div>

                {/* Selected Phase Detail Display */}
                <div className="lg:col-span-8 luxury-glass p-8 rounded-3xl border border-[#A16207]/20 relative overflow-hidden h-[340px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#A16207]/5 rounded-full blur-3xl" />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-widest text-[#DFBA73] uppercase">
                        Book Progression Phase {activePhase + 1}
                      </span>
                      <Sparkles className="w-4 h-4 text-[#DFBA73] animate-pulse" />
                    </div>
                    
                    <h4 className="font-luxury-serif text-3xl font-bold text-white">
                      {journeyPhases[activePhase].title}
                    </h4>
                    
                    <p className="text-stone-300 text-sm leading-relaxed max-w-xl">
                      {journeyPhases[activePhase].desc}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-6 text-[11px] font-bold text-stone-500 uppercase tracking-widest border-t border-stone-800 pt-6">
                    <span>Includes dynamic worksheets</span>
                    <span>•</span>
                    <span>AI auto-evaluation active</span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'mentors' && (
              <motion.div
                key="mentors-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {mentors.map((m, idx) => (
                  <div key={idx} className="bg-[#0C0A09]/60 border border-stone-900 p-6 rounded-2xl hover:border-[#A16207]/30 transition group flex flex-col justify-between h-[200px]">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="w-2 h-2 rounded-full bg-[#DFBA73]" />
                        <span className="text-[9px] font-bold font-mono tracking-widest text-[#DFBA73] uppercase">MENTOR ROOM</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#DFBA73] transition-colors">{m.name}</h4>
                      <p className="text-stone-400 text-xs">{m.role}</p>
                    </div>
                    <div className="text-[10px] text-stone-500 border-t border-stone-800/80 pt-3 mt-4">
                      Specialty: <span className="font-bold text-stone-400">{m.spec}</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'academy' && (
              <motion.div
                key="academy-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-8"
              >
                {academyPaths.map((path, idx) => (
                  <div key={idx} className="luxury-glass p-8 rounded-3xl border border-stone-800">
                    <h4 className="font-luxury-serif text-xl font-bold text-[#DFBA73] mb-4">{path.label}</h4>
                    <div className="space-y-3">
                      {path.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex items-center gap-3 text-xs font-semibold text-stone-300">
                          <CheckCircle2 className="w-4.5 h-4.5 text-[#DFBA73]" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'funding' && (
              <motion.div
                key="funding-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-7 space-y-6">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DFBA73]">Funding Matching Hub</span>
                  <h4 className="font-luxury-serif text-2xl sm:text-3xl font-bold text-white">Centralized Seed Capital Opportunities</h4>
                  <p className="text-stone-400 text-sm leading-relaxed">
                    Our database integrates major state and central venture schemes directly: Startup India programs, Karnataka ELEVATE seed grants, BIRAC biotechnology funds, and DST incubation budgets.
                  </p>
                  <p className="text-[#DFBA73] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5" />
                    AI analyzes your profile parameters to matching rates instantly.
                  </p>
                </div>
                <div className="lg:col-span-5 bg-[#0C0A09]/60 border border-stone-900 p-6 rounded-2xl space-y-4">
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">Karnataka ELEVATE</p>
                      <p className="text-[10px] text-[#DFBA73] mt-0.5">Up to ₹50 Lakhs Grant</p>
                    </div>
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Open</span>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">BIRAC BIG Scheme</p>
                      <p className="text-[10px] text-[#DFBA73] mt-0.5">Up to ₹50 Lakhs Biotechnology Grant</p>
                    </div>
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Open</span>
                  </div>
                  <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                    <div>
                      <p className="text-xs font-bold text-white">Startup India Seed Fund</p>
                      <p className="text-[10px] text-[#DFBA73] mt-0.5">Up to ₹20 Lakhs Debt / Equity Match</p>
                    </div>
                    <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-[#A16207]/20 text-[#DFBA73]">Active</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── THE TOOLKIT GENERATOR PREVIEW ── */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#DFBA73]">One-Click Deliverables</span>
            <h3 className="text-3xl sm:text-4xl font-luxury-serif font-black text-white">The Startup Toolkit</h3>
            <p className="text-stone-400 text-sm leading-relaxed">
              Don't waste weeks drafting documents from templates. The FounderOS AI reads your handwriting logs and compiles professional, investor-ready documents instantly.
            </p>
            <div className="space-y-3">
              {[
                "Business Model Canvases (BMC)",
                "Full Detailed Project Reports (DPR)",
                "Pro Forma Financial Models",
                "Founder Covenants & Non-Disclosure Agreements (NDA)"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-semibold text-stone-300">
                  <CheckCircle2 className="w-5 h-5 text-[#DFBA73]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="luxury-glass p-8 rounded-3xl border border-[#A16207]/20 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-[10px] font-bold font-mono text-stone-500 uppercase tracking-widest">AI GENERATOR INTERFACE</span>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5 text-[#DFBA73]" />
                  <div>
                    <p className="text-xs font-bold text-white">Business Model Canvas</p>
                    <p className="text-[10px] text-stone-500">Based on Phase 6 Book Logs</p>
                  </div>
                </div>
                <button className="px-3.5 py-1.5 rounded-lg bg-[#A16207]/25 text-[#DFBA73] text-[10px] font-bold border border-[#A16207]/40 hover:bg-[#A16207]/50 transition cursor-pointer">
                  Generate
                </button>
              </div>

              <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-[#DFBA73]" />
                  <div>
                    <p className="text-xs font-bold text-white">3-Year Pro Forma Financials</p>
                    <p className="text-[10px] text-stone-500">Based on Phase 9 Budget Sheets</p>
                  </div>
                </div>
                <button className="px-3.5 py-1.5 rounded-lg bg-[#A16207]/25 text-[#DFBA73] text-[10px] font-bold border border-[#A16207]/40 hover:bg-[#A16207]/50 transition cursor-pointer">
                  Generate
                </button>
              </div>

              <div className="p-4 rounded-xl bg-[#A16207]/10 border border-[#A16207]/30 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-[#DFBA73]" />
                  <div>
                    <p className="text-xs font-bold text-white">Pitch Deck (10 Slide Deck)</p>
                    <p className="text-[10px] text-stone-300">Based on Phase 12 Audited Logs</p>
                  </div>
                </div>
                <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PWA DOWNLOAD AND APP CENTER (THE CTA) ── */}
      <section id="download" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-stone-900">
        <div className="luxury-glass p-8 lg:p-16 rounded-[48px] border border-[#A16207]/25 relative overflow-hidden text-center max-w-4xl mx-auto">
          {/* Glowing orbs inside CTA */}
          <div className="absolute top-[-50%] left-[-50%] w-[100%] h-[100%] rounded-full bg-[#A16207]/5 blur-[120px]" />
          
          <div className="max-w-2xl mx-auto space-y-8 relative z-10">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#DFBA73] block">
              INSTANT PW ACCESS
            </span>
            
            <h2 className="text-3xl sm:text-5xl font-luxury-serif font-black text-white leading-tight">
              Get the FounderOS PWA
            </h2>
            
            <p className="text-stone-300 text-sm leading-relaxed">
              Launch FounderOS directly from your home screen. Our Progressive Web App operates offline, caches critical startup canvas templates, and coordinates real-time push notes from your AI mentors.
            </p>

            {/* Install Box UI */}
            <div className="bg-stone-950/80 border border-stone-800 p-6 rounded-3xl max-w-md mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-[10px] font-bold text-stone-500 font-mono uppercase tracking-widest">
                  APP INSTALLATION STATUS
                </span>
                {isInstalled ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold">Installed</span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[9px] font-bold">Installable</span>
                )}
              </div>

              {installSuccess && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-bold flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  App Installed Successfully!
                </div>
              )}

              <button
                onClick={triggerPWAInstall}
                disabled={isInstalled}
                className={`w-full py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                  isInstalled
                    ? 'bg-stone-900 border border-stone-800 text-stone-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#DFBA73] to-[#A16207] text-[#0C0A09] hover:brightness-110 shadow-lg'
                }`}
              >
                <Download className="w-4 h-4" />
                {isInstalled ? 'Running Standalone' : 'Download Application (PWA)'}
              </button>
            </div>

            {/* iOS Helper Hint overlay */}
            {showIOSHint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-stone-900 border border-[#A16207]/30 text-stone-300 rounded-2xl text-xs text-left max-w-sm mx-auto space-y-3 relative"
              >
                <button
                  onClick={() => setShowIOSHint(false)}
                  className="absolute top-2 right-2 text-stone-500 hover:text-white"
                >
                  ✕
                </button>
                <p className="font-bold text-white flex items-center gap-2 text-xs">
                  <Sparkles className="w-4.5 h-4.5 text-[#DFBA73]" />
                  iOS Safari Installation Instructions:
                </p>
                <ol className="list-decimal pl-4 space-y-1 text-stone-400 text-[11px] leading-relaxed">
                  <li>Tap the browser's <strong>Share</strong> button (bottom navigation bar).</li>
                  <li>Scroll down and select <strong>Add to Home Screen</strong>.</li>
                  <li>Open FounderOS directly from your home screen.</li>
                </ol>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0C0A09] border-t border-stone-900 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[#FAFAF9]"
                style={{ background: 'linear-gradient(135deg, #DFBA73 0%, #A16207 100%)' }}>
                LF
              </div>
              <span className="font-luxury-serif text-sm font-bold text-white tracking-widest uppercase">
                LAARISH <span className="text-[10px] font-luxury-sans text-[#DFBA73] block mt-[-3px] font-black">FounderOS</span>
              </span>
            </div>
            <p className="text-stone-500 text-[11px] leading-relaxed font-semibold">
              The premium command center for aspiring entrepreneurs. Built with structured workbook execution and advanced startup reasoning logic.
            </p>
          </div>
          
          <div>
            <h5 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Ecosystem Modules</h5>
            <ul className="space-y-2 text-xs font-bold text-stone-500">
              <li>15 Journeys Progress</li>
              <li>14 Indian AI Mentors</li>
              <li>Seed Grants Tracker</li>
              <li>One-Click Document Engine</li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">India Startup Network</h5>
            <ul className="space-y-2 text-xs font-bold text-stone-500">
              <li>Karnataka Elevate Scheme</li>
              <li>BIRAC Biotechnology</li>
              <li>DST Grant Applications</li>
              <li>Startup India DPIIT</li>
            </ul>
          </div>

          <div>
            <h5 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Enterprise Legal</h5>
            <p className="text-stone-500 text-[11px] leading-relaxed mb-4">
              All tools comply with Startup India legal directives, GST registration checklists, and DPIIT recognition criteria.
            </p>
            <p className="text-stone-600 text-[10px] font-mono">
              © {new Date().getFullYear()} LAARISH. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
