import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Calendar, Clock, Brain, CheckCircle, ArrowRight, Play, Zap, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- COLORES & ESTILO ---
const THEME = {
  primary: "#6366f1", // Indigo
  accent: "#10b981", // Emerald
  dark: "#0f172a",   // Slate 900
  light: "#f8fafc",  // Slate 50
  glass: "rgba(255, 255, 255, 0.1)"
};

// --- COMPONENTES 3D ---

// 1. Cubos de Tareas (Time Blocks)
const FloatingTaskCube = ({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: number }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  
  // Posición original para volver a ella
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const randomOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    
    // Movimiento flotante independiente
    mesh.current.position.y = initialPos.y + Math.sin(t + randomOffset) * 0.2;
    mesh.current.rotation.x = rotation[0] + t * 0.2;
    mesh.current.rotation.y = rotation[1] + t * 0.1;

    // Efecto al hacer hover
    const targetScale = hovered ? scale * 1.2 : scale;
    const currentScale = mesh.current.scale.x;
    const nextScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    mesh.current.scale.set(nextScale, nextScale, nextScale);
  });

  return (
    <mesh 
      ref={mesh} 
      position={position} 
      rotation={rotation}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; setHover(true); }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; setHover(false); }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial 
        color={hovered ? THEME.accent : THEME.primary}
        roughness={0.2}
        metalness={0.8}
        transmission={0.5} // Efecto cristal
        thickness={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

// 2. El Núcleo de IA (AI Core)
const AICore = () => {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    // Pulsación
    const scale = 1 + Math.sin(t * 3) * 0.05;
    mesh.current.scale.set(scale, scale, scale);
    // Rotación compleja
    mesh.current.rotation.x -= 0.01;
    mesh.current.rotation.y += 0.01;
  });

  return (
    <group>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshStandardMaterial 
          color="#ffffff" 
          emissive={THEME.primary}
          emissiveIntensity={2}
          wireframe
        />
      </mesh>
      {/* Luz interna */}
      <pointLight distance={10} intensity={5} color={THEME.primary} />
    </group>
  );
};

// 3. Escena Principal Gestionada
const SceneContent = () => {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 6;

  useFrame(() => {
    if (!group.current) return;
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = scrollY / maxScroll;

    // Coreografía basada en scroll
    // Rotación de todo el sistema
    group.current.rotation.y = progress * Math.PI * 2;
    
    // Movimiento lateral
    const targetX = isMobile ? 0 : 3; 
    // Al bajar, se mueve ligeramente
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX - (progress * 2), 0.05);
  });

  // Generamos cubos aleatorios alrededor del núcleo
  const cubes = useMemo(() => {
    return Array.from({ length: 8 }).map((_, i) => {
      const angle = (i / 8) * Math.PI * 2;
      const radius = 3.5;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 4;
      return {
        pos: [x, y, z] as [number, number, number],
        rot: [Math.random() * Math.PI, Math.random() * Math.PI, 0] as [number, number, number],
        scale: 0.5 + Math.random() * 0.5
      };
    });
  }, []);

  return (
    <group ref={group} position={[isMobile ? 0 : 3, 0, 0]}>
      <AICore />
      {cubes.map((data, i) => (
        <FloatingTaskCube 
          key={i} 
          position={data.pos} 
          rotation={data.rot} 
          scale={data.scale} 
        />
      ))}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
         {/* Partículas decorativas simples */}
         <points>
           <sphereGeometry args={[6, 32, 32]} />
           <pointsMaterial size={0.05} color={THEME.accent} transparent opacity={0.4} />
         </points>
      </Float>
    </group>
  );
};

// --- COMPONENTES UI (HTML) ---

const Navbar = () => (
  <nav className="fixed w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-slate-900/50 border-b border-white/10">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
        <LayoutDashboard className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-white tracking-tight">StudyFlow</span>
    </div>
    
    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
      <a href="#features" className="hover:text-indigo-400 transition-colors">Cómo funciona</a>
      <a href="#pricing" className="hover:text-indigo-400 transition-colors">Planes</a>
      <Link to="/login" className="hover:text-indigo-400 transition-colors">Iniciar Sesión</Link>
    </div>

    <Link to="/app" className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors">
      Empezar Gratis
    </Link>
  </nav>
);

const Hero = () => (
  <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
          <Zap className="w-3 h-3" />
          <span>IA GENERATIVA V2.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6">
          Tu rutina es un caos. <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
            Nosotros la ordenamos.
          </span>
        </h1>
        
        <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
          Introduce tus horarios y fechas de examen. Nuestra IA diseña el calendario de estudio perfecto para que apruebes sin sacrificar tu vida social.
        </p>
        
        <div className="flex flex-wrap gap-4">
          <Link to="/app" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/25 group">
            Generar mi Horario
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-8 py-4 rounded-xl font-bold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2">
            <Play className="w-4 h-4 fill-current" />
            Ver Demo
          </button>
        </div>

        <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900" />
            ))}
          </div>
          <p>Usado por +10,000 estudiantes</p>
        </div>
      </div>
      {/* El espacio derecho está reservado para el 3D */}
    </div>
  </section>
);

const FeatureCard = ({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) => (
  <div className="bg-slate-800/50 backdrop-blur-sm border border-white/5 p-8 rounded-3xl hover:border-indigo-500/30 transition-all hover:-translate-y-1 group">
    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white text-indigo-400 transition-colors">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

const Features = () => (
  <section id="features" className="py-32 relative z-10 bg-slate-900">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-20">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">De Google Calendar a <span className="text-indigo-400">Super Plan</span></h2>
        <p className="text-slate-400 text-lg">Olvídate de organizar bloques de tiempo manualmente. StudyFlow lo hace en segundos.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Calendar} 
          title="Sincronización Total" 
          desc="Importamos tu rutina actual (clases, gimnasio, fiestas). Respetamos tu tiempo libre sagrado." 
        />
        <FeatureCard 
          icon={Brain} 
          title="Planificación Neuronal" 
          desc="Nuestra IA analiza la dificultad de tus exámenes y distribuye la carga de trabajo óptima." 
        />
        <FeatureCard 
          icon={Clock} 
          title="Ajuste Dinámico" 
          desc="¿Te saltaste una sesión de estudio? No pasa nada. El calendario se recalcula automáticamente." 
        />
      </div>
    </div>
  </section>
);

const MockupSection = () => (
  <section className="py-24 relative z-10 overflow-hidden">
    <div className="container mx-auto px-6">
      <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-[3rem] p-8 md:p-16 border border-white/10 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Visualiza tu éxito semana a semana</h2>
            <ul className="space-y-4">
              {['Vista de calendario intuitiva', 'Recordatorios inteligentes', 'Estadísticas de progreso'].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
            <button className="mt-8 bg-white text-indigo-900 px-6 py-3 rounded-lg font-bold hover:bg-slate-200 transition-colors">
              Probar Demo Interactiva
            </button>
          </div>
          
          {/* Mockup visual hecho con CSS/HTML */}
          <div className="relative">
            <div className="absolute -inset-4 bg-indigo-500/30 blur-3xl rounded-full"></div>
            <div className="relative bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl">
              {/* Header Mockup */}
              <div className="bg-slate-800 p-4 flex gap-2 items-center border-b border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"/>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"/>
                  <div className="w-3 h-3 rounded-full bg-green-500"/>
                </div>
                <div className="ml-4 h-4 w-32 bg-slate-700 rounded-full"/>
              </div>
              {/* Body Mockup */}
              <div className="p-4 grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-3">
                  <div className="h-20 bg-indigo-500/20 border border-indigo-500/40 rounded-lg p-2">
                    <div className="w-8 h-8 rounded bg-indigo-500 mb-2 flex items-center justify-center text-xs font-bold text-white">LUN</div>
                  </div>
                  <div className="h-20 bg-slate-800 rounded-lg p-2 opacity-50"></div>
                  <div className="h-20 bg-slate-800 rounded-lg p-2 opacity-50"></div>
                </div>
                <div className="col-span-2 space-y-3 pt-8">
                   <div className="h-8 w-3/4 bg-slate-700 rounded mb-2"></div>
                   <div className="h-4 w-1/2 bg-slate-800 rounded"></div>
                   <div className="h-32 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-emerald-400 font-bold text-sm">Estudiar Matemáticas</span>
                        <span className="text-xs text-slate-400">2h</span>
                      </div>
                      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-emerald-500"></div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/5 relative z-10">
    <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8 text-sm">
      <div className="col-span-1 md:col-span-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-indigo-500 rounded flex items-center justify-center">
            <LayoutDashboard className="w-3 h-3 text-white" />
          </div>
          <span className="text-lg font-bold text-white">StudyFlow</span>
        </div>
        <p className="max-w-xs">Tu compañero de estudio inteligente. Recupera el control de tu tiempo hoy mismo.</p>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Producto</h4>
        <ul className="space-y-2">
          <li className="hover:text-white cursor-pointer">Características</li>
          <li className="hover:text-white cursor-pointer">Integraciones</li>
          <li className="hover:text-white cursor-pointer">Precios Estudiante</li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-bold mb-4">Legal</h4>
        <ul className="space-y-2">
          <li className="hover:text-white cursor-pointer">Privacidad</li>
          <li className="hover:text-white cursor-pointer">Términos</li>
        </ul>
      </div>
    </div>
  </footer>
);

// --- COMPONENTE PRINCIPAL EXPORTADO ---

export const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      {/* 1. LAYER 3D (FONDO FIJO) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            {/* Iluminación dramática estilo Cyberpunk */}
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#818cf8" />
            <pointLight position={[-10, -5, -5]} intensity={2} color="#10b981" />
            
            {/* Environment para reflejos metálicos */}
            <Environment preset="city" />

            <SceneContent />
            
            <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={20} blur={2} far={4} color="#000000" />
          </Suspense>
        </Canvas>
      </div>

      {/* 2. LAYER CONTENIDO */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <MockupSection />
        </main>
        <Footer />
      </div>
      
    </div>
  );
}