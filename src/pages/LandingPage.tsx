import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Calendar, Clock, Brain, CheckCircle, ArrowRight, Play, Zap, LayoutDashboard, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

// --- COLORES & ESTILO ---
const THEME = {
  primary: "#6366f1", // Indigo
  accent: "#10b981", // Emerald
  dark: "#0f172a",   // Slate 900
  light: "#f8fafc",  // Slate 50
  glass: "rgba(255, 255, 255, 0.1)"
};

// --- COMPONENTES 3D (Sin cambios) ---
const FloatingTaskCube = ({ position, rotation, scale }: { position: [number, number, number], rotation: [number, number, number], scale: number }) => {
  const mesh = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const initialPos = useMemo(() => new THREE.Vector3(...position), [position]);
  const randomOffset = useMemo(() => Math.random() * 100, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    mesh.current.position.y = initialPos.y + Math.sin(t + randomOffset) * 0.2;
    mesh.current.rotation.x = rotation[0] + t * 0.2;
    mesh.current.rotation.y = rotation[1] + t * 0.1;
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
        transmission={0.5} 
        thickness={2}
        transparent
        opacity={0.8}
      />
    </mesh>
  );
};

const AICore = () => {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.getElapsedTime();
    const scale = 1 + Math.sin(t * 3) * 0.05;
    mesh.current.scale.set(scale, scale, scale);
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
      <pointLight distance={10} intensity={5} color={THEME.primary} />
    </group>
  );
};

const SceneContent = () => {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 6;

  useFrame(() => {
    if (!group.current) return;
    const scrollY = window.scrollY;
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    const progress = scrollY / maxScroll;
    group.current.rotation.y = progress * Math.PI * 2;
    const targetX = isMobile ? 0 : 3; 
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, targetX - (progress * 2), 0.05);
  });

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
         <points>
           <sphereGeometry args={[6, 32, 32]} />
           <pointsMaterial size={0.05} color={THEME.accent} transparent opacity={0.4} />
         </points>
      </Float>
    </group>
  );
};

// --- COMPONENTES UI ---

const Navbar = () => (
  <nav className="fixed w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-slate-900/50 border-b border-white/10">
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
        <LayoutDashboard className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold text-white tracking-tight">StudyFlow</span>
    </div>
    
    <div className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
      <a href="#features" className="hover:text-indigo-400 transition-colors scroll-smooth">Cómo funciona</a>
      <a href="#pricing" className="hover:text-indigo-400 transition-colors scroll-smooth">Planes</a>
      <Link to="/login" className="hover:text-indigo-400 transition-colors">Iniciar Sesión</Link>
    </div>

    <Link to="/app" className="bg-white text-slate-900 px-5 py-2 rounded-full font-bold text-sm hover:bg-indigo-50 transition-colors">
      Empezar Gratis
    </Link>
  </nav>
);

const Hero = () => (
  <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
    <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
      
      {/* Left Content */}
      <div className="z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
          <Zap className="w-3 h-3" />
          <span>IA GENERATIVA V2.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.1]">
          Tus estudios, <br className="hidden md:block" />
          <span className="relative inline-block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
            bajo control.
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-10 max-w-lg leading-relaxed font-light">
          Da igual lo que estudies. Introduce tus exámenes y entregas, y nuestra IA diseñará el calendario perfecto para aprobar sin sacrificar tu vida.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/app" className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-indigo-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 group w-full sm:w-auto">
            Generar mi Horario
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <a href="#pricing" className="px-8 py-4 rounded-xl font-bold text-white border border-white/10 hover:bg-white/5 transition-all flex items-center justify-center gap-2 w-full sm:w-auto">
            Ver Planes
          </a>
        </div>

        <div className="mt-12 flex items-center gap-4 text-sm text-slate-500">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-slate-300">
                {['A','M','J','L'][i-1]}
              </div>
            ))}
          </div>
          <p>Usado por estudiantes de todo el mundo</p>
        </div>
      </div>

      {/* Right Content: Mockup Interactivo */}
      <div className="hidden md:block relative perspective-1000 group">
         <div className="relative rounded-2xl border border-white/10 bg-slate-900/50 p-2 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1">
            
            {/* MOCKUP APP UI */}
            <div className="rounded-xl bg-slate-900 border border-slate-800 overflow-hidden aspect-[4/3] relative flex shadow-inner">
               
               {/* Sidebar Fake */}
               <div className="w-1/4 border-r border-slate-800 p-4 flex flex-col gap-4">
                  <div className="flex items-center gap-2 mb-4">
                     <div className="w-6 h-6 bg-indigo-600 rounded-md"></div>
                     <div className="h-3 w-20 bg-slate-800 rounded-full"></div>
                  </div>
                  <div className="space-y-2">
                     <div className="h-8 bg-slate-800/50 rounded-lg w-full"></div>
                     <div className="h-8 bg-slate-800/30 rounded-lg w-full"></div>
                     <div className="h-8 bg-slate-800/30 rounded-lg w-full"></div>
                  </div>
               </div>

               {/* Main Content Fake */}
               <div className="flex-1 p-6">
                  <div className="flex justify-between items-center mb-6">
                     <div>
                        <div className="h-4 w-32 bg-slate-800 rounded-full mb-2"></div>
                        <div className="h-3 w-48 bg-slate-800/50 rounded-full"></div>
                     </div>
                     <div className="w-8 h-8 rounded-full bg-slate-800"></div>
                  </div>

                  {/* Task Cards */}
                  <div className="space-y-3">
                     {[
                        { title: "Examen Historia", tag: "Humanidades", color: "bg-amber-500" },
                        { title: "Entrega Proyecto", tag: "Marketing", color: "bg-emerald-500" },
                        { title: "Prácticas Lab", tag: "Biología", color: "bg-blue-500" },
                     ].map((task, i) => (
                        <div key={i} className="bg-slate-800/40 p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                           <div className={`w-1 h-8 rounded-full ${task.color}`}></div>
                           <div className="flex-1">
                              <div className="text-xs font-bold text-slate-300">{task.title}</div>
                              <div className="text-[10px] text-slate-500 mt-1">{task.tag}</div>
                           </div>
                           <div className="w-4 h-4 rounded border border-slate-600"></div>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Floating Badge */}
               <div className="absolute bottom-4 right-4 bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-lg shadow-lg border border-white/10 flex items-center gap-2 animate-bounce">
                  <CheckCircle size={14} />
                  <span>Horario Generado</span>
               </div>
            </div>
         </div>
      </div>

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
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Del caos a la <span className="text-indigo-400">tranquilidad</span>
        </h2>
        <p className="text-slate-400 text-lg">
          Funciona para Universidad, FP, Bachillerato o Oposiciones. StudyFlow se adapta a tu ritmo.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={Calendar} 
          title="Sincronización Total" 
          desc="Importamos tu rutina (clases, deportes, ocio). Respetamos tu tiempo libre para que no te quemes." 
        />
        <FeatureCard 
          icon={Brain} 
          title="Planificación Inteligente" 
          desc="Nuestra IA analiza la dificultad de tus asignaturas y reparte la carga de trabajo de forma equilibrada." 
        />
        <FeatureCard 
          icon={Clock} 
          title="Flexible como tú" 
          desc="¿Te ha surgido un plan? No pasa nada. El calendario se recalcula automáticamente al día siguiente." 
        />
      </div>
    </div>
  </section>
);

// --- SECCIÓN DE PRECIOS UNIVERSAL ---
const PricingSection = () => (
  <section id="pricing" className="py-32 relative z-10 bg-slate-950 border-t border-white/5">
    <div className="container mx-auto px-6">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Invierte en tu futuro</h2>
        <p className="text-slate-400 text-lg">El precio de dos cafés para aprobar todo el curso.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Plan Básico */}
        <div className="bg-slate-900 p-8 rounded-3xl border border-white/10 hover:border-white/20 transition-colors relative flex flex-col">
           <h3 className="text-xl font-bold text-white">Básico</h3>
           <div className="my-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">0€</span>
              <span className="text-slate-500">/mes</span>
           </div>
           <p className="text-slate-400 mb-8 text-sm">Para probar la experiencia.</p>
           
           <ul className="space-y-4 mb-8 flex-1">
              <PricingItem text="Hasta 50 tareas activas" />
              <PricingItem text="Tablero Kanban" />
              <PricingItem text="Rutina Manual" />
              <PricingItem text="Sin publicidad" />
           </ul>
           
           <Link to="/app" className="block w-full py-3 px-6 text-center font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition-colors border border-indigo-500/20">
              Empezar Gratis
           </Link>
        </div>

        {/* Plan Pro */}
        <div className="bg-gradient-to-b from-indigo-900/50 to-slate-900 p-8 rounded-3xl border border-indigo-500/50 shadow-2xl shadow-indigo-500/20 relative flex flex-col">
           <div className="absolute top-0 right-0">
              <div className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl">
                 RECOMENDADO
              </div>
           </div>
           
           <h3 className="text-xl font-bold text-white">Estudiante Pro</h3>
           <div className="my-4 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">4.99€</span>
              <span className="text-slate-400">/mes</span>
           </div>
           <p className="text-indigo-300 font-medium mb-8 text-sm">Saca tu máximo potencial.</p>
           
           <ul className="space-y-4 mb-8 flex-1">
              <PricingItem text="Tareas Ilimitadas" highlight />
              <PricingItem text="IA Planificadora Completa" highlight />
              <PricingItem text="Estadísticas de Rendimiento" highlight />
              <PricingItem text="Sincronización Calendar" highlight />
           </ul>
           
           <Link to="/app" className="block w-full py-3 px-6 text-center font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-colors shadow-lg shadow-indigo-500/30">
              Prueba 14 días gratis
           </Link>
        </div>

      </div>
    </div>
  </section>
);

const PricingItem = ({ text, highlight = false }: { text: string, highlight?: boolean }) => (
  <li className="flex items-center gap-3 text-sm">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${highlight ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
       <Check size={12} />
    </div>
    <span className={highlight ? 'text-white font-medium' : 'text-slate-400'}>{text}</span>
  </li>
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
          <li className="hover:text-white cursor-pointer">Para Universidades</li>
          <li className="hover:text-white cursor-pointer">Precios</li>
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

export const LandingPage = () => {
  return (
    <div className="w-full min-h-screen bg-slate-900 text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows camera={{ position: [0, 0, 8], fov: 40 }} gl={{ antialias: true }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} intensity={2} color="#818cf8" />
            <pointLight position={[-10, -5, -5]} intensity={2} color="#10b981" />
            <Environment preset="city" />
            <SceneContent />
            <ContactShadows position={[0, -4, 0]} opacity={0.5} scale={20} blur={2} far={4} color="#000000" />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Features />
          <PricingSection />
        </main>
        <Footer />
      </div>
      
    </div>
  );
}