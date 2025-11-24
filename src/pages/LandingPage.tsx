import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, BrainCircuit, Calendar, ShieldCheck, BarChart3, ChevronDown, ChevronUp, Star, Zap, LayoutDashboard, CheckSquare, Clock, MoreVertical } from 'lucide-react';
import { Link } from 'react-router-dom';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      {/* --- NAVBAR FLOTANTE --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-blue-200 shadow-lg">S</div>
            <span className="font-bold text-xl tracking-tight">StudyFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Características</a>
            <a href="#pricing" className="hover:text-blue-600 transition-colors">Precios</a>
            <a href="#faq" className="hover:text-blue-600 transition-colors">Dudas</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors hidden md:block">
              Entrar
            </Link>
            <Link 
              to="/app" 
              className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 hover:scale-105 active:scale-95"
            >
              Empezar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          
          {/* --- BADGE v1.0 --- */}
          <div className="inline-block mb-8">
             <div className="relative group cursor-default transition-all hover:scale-105 duration-300">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 shadow-sm flex items-center gap-2">
                   <span className="relative flex h-2 w-2">
                     <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                     <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                   </span>
                   <span className="text-sm font-bold text-slate-700">v1.0 Disponible: El primer planificador con IA real</span>
                </div>
             </div>
          </div>
          
          {/* --- TÍTULO --- */}
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-8 leading-[1.2]">
            Tu ingeniería tiene un plan. <br className="hidden md:block" />
            <span className="relative inline-block mt-4 group cursor-default perspective-500">
              <span className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 rounded-full"></span>
              <span className="relative z-10 inline-block px-8 py-1 rounded-full bg-white/10 backdrop-blur-2xl border border-white/60 shadow-[inset_0_0_20px_rgba(255,255,255,0.6),_0_15px_35px_-10px_rgba(59,130,246,0.4)] ring-1 ring-white/40 transition-all duration-500 ease-out group-hover:scale-105 group-hover:-rotate-1 transform-gpu">
                 <span className="absolute inset-x-4 top-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></span>
                 <span className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-full pointer-events-none"></span>
                 <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 drop-shadow-sm font-black tracking-tighter py-2 block">
                   Tú solo estudia.
                 </span>
              </span>
            </span>
          </h1>
          
          <p className="text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
            StudyFlow genera automáticamente tu calendario de estudio basándose en la dificultad de tus asignaturas y tu energía diaria.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link 
              to="/app" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-blue-200 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Generar mi Horario <ArrowRight size={20} />
            </Link>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">
                     U{i}
                   </div>
                ))}
              </div>
              <span className="ml-2">Usado por +100 estudiantes</span>
            </div>
          </div>

          {/* --- MOCKUP DE LA APP (UI REAL) --- */}
          <div className="relative mx-auto max-w-5xl perspective-1000 group">
             <div className="relative rounded-2xl border border-slate-200 bg-white/50 p-2 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:scale-[1.005] hover:-rotate-0.5">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                
                {/* CONTENEDOR DE LA INTERFAZ SIMULADA */}
                <div className="rounded-xl bg-slate-50 border border-slate-200 overflow-hidden aspect-[16/10] md:aspect-[16/9] relative flex shadow-inner">
                   
                   {/* 1. SIDEBAR FALSO */}
                   <div className="w-1/5 bg-white border-r border-slate-200 p-4 hidden md:flex flex-col gap-6">
                      <div className="flex items-center gap-2">
                         <div className="w-6 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white text-xs font-bold">S</div>
                         <span className="font-bold text-slate-800 text-xs">StudyFlow</span>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-2 px-2 py-2 bg-blue-50 text-blue-600 rounded-lg">
                            <LayoutDashboard size={14} />
                            <span className="text-[10px] font-semibold">Dashboard</span>
                         </div>
                         <div className="flex items-center gap-2 px-2 py-2 text-slate-400">
                            <CheckSquare size={14} />
                            <span className="text-[10px] font-medium">Mis Tareas</span>
                         </div>
                         <div className="flex items-center gap-2 px-2 py-2 text-slate-400">
                            <Calendar size={14} />
                            <span className="text-[10px] font-medium">Agenda</span>
                         </div>
                      </div>
                      <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-100">
                         <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                         <div className="flex-1">
                            <div className="h-2 w-12 bg-slate-200 rounded mb-1"></div>
                            <div className="h-1.5 w-8 bg-slate-100 rounded"></div>
                         </div>
                      </div>
                   </div>

                   {/* 2. MAIN CONTENT FALSO */}
                   <div className="flex-1 bg-slate-50/50 p-4 md:p-6 flex flex-col gap-4 overflow-hidden relative">
                      {/* Header */}
                      <div className="flex justify-between items-end mb-2">
                         <div>
                            <h3 className="text-lg font-bold text-slate-800">Hola, Ingeniero 👋</h3>
                            <p className="text-[10px] text-slate-400">Aquí tienes el resumen de tu día.</p>
                         </div>
                         <div className="h-8 w-8 bg-white rounded-full border border-slate-200 shadow-sm"></div>
                      </div>

                      {/* Stats Row */}
                      <div className="grid grid-cols-4 gap-3">
                         {[
                            { label: 'Tareas Hoy', val: '12', color: 'text-slate-700' },
                            { label: 'Completadas', val: '5', color: 'text-emerald-600' },
                            { label: 'Horas', val: '4.5h', color: 'text-blue-600' },
                            { label: 'Racha', val: '3 🔥', color: 'text-amber-500' }
                         ].map((stat, i) => (
                             <div key={i} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                 <div className="text-[8px] text-slate-400 uppercase font-bold mb-1">{stat.label}</div>
                                 <div className={`text-lg font-bold ${stat.color}`}>{stat.val}</div>
                             </div>
                         ))}
                      </div>

                      <div className="flex gap-4 flex-1 min-h-0">
                          {/* Task List */}
                          <div className="flex-[2] flex flex-col gap-3">
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-700">Plan Sugerido (WEDF)</span>
                             </div>
                             {[
                                { title: 'Repasar Cálculo II', tag: 'Matemáticas', time: '45m', border: 'border-l-4 border-l-blue-500' },
                                { title: 'Entrega Práctica Redes', tag: 'Informática', time: '90m', border: 'border-l-4 border-l-rose-500' },
                                { title: 'Leer Apuntes Historia', tag: 'Optativa', time: '30m', border: 'border-l-4 border-l-emerald-500' }
                             ].map((task, i) => (
                                <div key={i} className={`bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center justify-between ${task.border}`}>
                                     <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                           <Clock size={12} />
                                        </div>
                                        <div>
                                           <div className="text-[10px] font-bold text-slate-700">{task.title}</div>
                                           <div className="flex items-center gap-1 mt-0.5">
                                              <span className="text-[8px] bg-slate-100 px-1 rounded text-slate-500">{task.tag}</span>
                                           </div>
                                        </div>
                                     </div>
                                     <div className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{task.time}</div>
                                </div>
                             ))}
                          </div>

                          {/* Right Panel */}
                          <div className="flex-1 flex flex-col gap-3">
                               <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-4 text-white shadow-lg shadow-blue-200 relative overflow-hidden">
                                   <div className="relative z-10">
                                      <div className="h-6 w-6 bg-white/20 rounded mb-2 flex items-center justify-center backdrop-blur-sm">
                                         <Zap size={12} />
                                      </div>
                                      <div className="text-[10px] font-medium opacity-80 mb-1">Modo Focus</div>
                                      <div className="text-xs font-bold">Activar IA</div>
                                   </div>
                                   <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/10 rounded-full blur-lg"></div>
                               </div>
                               <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex-1 relative overflow-hidden">
                                   <div className="text-[8px] font-bold text-slate-400 uppercase mb-2">Próximo Examen</div>
                                   <div className="flex gap-2 relative z-10">
                                      <div className="w-0.5 h-full bg-rose-500 rounded-full absolute left-0 top-0 bottom-0"></div>
                                      <div className="pl-2">
                                         <div className="text-[10px] font-bold text-slate-700">Física I</div>
                                         <div className="text-[8px] text-rose-500 font-medium">En 3 días</div>
                                      </div>
                                   </div>
                               </div>
                          </div>
                      </div>
                   </div>
                   
                   {/* --- BADGE FLOTANTE SOBRE EL MOCKUP (POPUP) --- */}
                   <div className="absolute bottom-6 right-6 z-20 animate-bounce-slow">
                        <div className="p-[1px] rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 shadow-2xl backdrop-blur-md">
                           <div className="bg-slate-900/90 text-white p-3 rounded-xl backdrop-blur-md border border-white/10 flex items-center gap-3 pr-5">
                              <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/30">
                                 <CheckCircle2 size={16} className="text-white" />
                              </div>
                              <div>
                                 <p className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider mb-0.5">IA ACTIVA</p>
                                 <p className="text-xs font-bold text-white leading-none">Plan Generado</p>
                              </div>
                           </div>
                        </div>
                   </div>

                </div>
             </div>
             
             <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl opacity-20 blur-2xl -z-10"></div>
          </div>

        </div>
      </header>

      {/* --- SOCIAL PROOF (LOGOS) --- */}
      <section className="py-10 border-y border-slate-100 bg-slate-50/50">
         <div className="max-w-6xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 items-center opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {['UNIVERSIDAD POLITÉCNICA', 'CAMPUS 42', 'IRONHACK', 'COURSERA', 'UDEMY'].map((logo) => (
               <span key={logo} className="text-lg font-bold font-mono text-slate-900">{logo}</span>
            ))}
         </div>
      </section>

      {/* --- FEATURES (BENTO GRID) --- */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Todo lo que necesitas para aprobar</h2>
            <p className="text-slate-500 max-w-2xl mx-auto text-lg">Olvídate de Excel y agendas de papel. StudyFlow centraliza tu vida académica.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Card Grande 1 */}
            <div className="md:col-span-2 bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100 relative overflow-hidden group hover:border-blue-200 transition-colors">
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                     <BrainCircuit size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Algoritmo WEDF Inteligente</h3>
                  <p className="text-slate-500 max-w-md">Nuestro motor prioriza tus tareas basándose en la fecha de entrega y el peso de la asignatura. Nunca más estudiarás lo que no toca.</p>
               </div>
               <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-to-br from-blue-200 to-transparent opacity-20 rounded-full blur-3xl group-hover:opacity-40 transition-opacity"></div>
            </div>

            {/* Card Pequeña 2 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
               <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <Calendar size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Rutina Flexible</h3>
               <p className="text-slate-500 text-sm">Bloquea tus horas de sueño y clases. El algoritmo encuentra los huecos libres por ti.</p>
            </div>

            {/* Card Pequeña 3 */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all">
               <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-6">
                  <BarChart3 size={24} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 mb-2">Analíticas Pro</h3>
               <p className="text-slate-500 text-sm">Visualiza tu racha de estudio y detecta qué asignaturas estás descuidando.</p>
            </div>

            {/* Card Grande 4 */}
            <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 relative overflow-hidden text-white group">
               <div className="relative z-10">
                  <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-blue-400 mb-6">
                     <Zap size={24} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Modo Enfoque (Próximamente)</h3>
                  <p className="text-slate-400 max-w-md">Integraremos Pomodoro directamente en tus tareas para maximizar la retención de información.</p>
               </div>
               <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600 rounded-full blur-[80px] opacity-50 group-hover:opacity-70 transition-opacity"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING --- */}
      <section id="pricing" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Inversión en tu Futuro</h2>
            <p className="text-slate-500">Menos de lo que cuesta un café, mucho más valioso que repetir asignatura.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan Free */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 hover:border-slate-300 transition-colors relative">
               <h3 className="text-xl font-bold text-slate-900">Estudiante</h3>
               <div className="my-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">0€</span>
                  <span className="text-slate-500">/mes</span>
               </div>
               <p className="text-slate-500 mb-8 text-sm">Perfecto para probar el sistema.</p>
               <ul className="space-y-4 mb-8">
                  <FeatureItem text="Hasta 50 tareas activas" />
                  <FeatureItem text="Tablero Kanban Básico" />
                  <FeatureItem text="Rutina Manual" />
                  <FeatureItem text="Soporte Básico" />
               </ul>
               <Link to="/app" className="block w-full py-3 px-6 text-center font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
                  Empezar Gratis
               </Link>
            </div>

            {/* Plan Pro */}
            <div className="bg-white p-8 rounded-3xl border-2 border-blue-600 shadow-2xl shadow-blue-200/50 relative overflow-hidden">
               {/* --- BADGE POPULAR --- */}
               <div className="absolute top-0 right-0">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl shadow-lg backdrop-blur-sm border-l border-b border-white/20">
                     POPULAR
                  </div>
               </div>
               
               <h3 className="text-xl font-bold text-slate-900">Ingeniero</h3>
               <div className="my-4 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">4.99€</span>
                  <span className="text-slate-500">/mes</span>
               </div>
               <p className="text-blue-600 font-medium mb-8 text-sm">Para quien va a por el 10.</p>
               <ul className="space-y-4 mb-8">
                  <FeatureItem text="Tareas Ilimitadas" highlight />
                  <FeatureItem text="Algoritmo IA Completo" highlight />
                  <FeatureItem text="Analíticas Avanzadas" highlight />
                  <FeatureItem text="Sincronización Calendar" highlight />
               </ul>
               <Link to="/app" className="block w-full py-3 px-6 text-center font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-lg shadow-blue-200">
                  Prueba 14 días gratis
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ (ACORDEÓN) --- */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Preguntas Frecuentes</h2>
          <div className="space-y-4">
            <FaqItem 
               question="¿Funciona para cualquier carrera?" 
               answer="Sí, aunque está optimizado para ingenierías por la carga de trabajo, funciona para cualquier estudiante que necesite estructura." 
            />
            <FaqItem 
               question="¿Puedo sincronizarlo con Google Calendar?" 
               answer="La integración bidireccional con Google Calendar está disponible en el plan Ingeniero (Premium)." 
            />
            <FaqItem 
               question="¿Qué pasa si no cumplo el plan un día?" 
               answer="¡No pasa nada! El algoritmo detectará el retraso y replanificará automáticamente tu semana la mañana siguiente." 
            />
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-white border-t border-slate-200 py-12 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs">S</div>
             <span className="font-bold text-slate-900">StudyFlow</span>
          </div>
          <div className="text-slate-500 text-sm">
             Hecho con ❤️ por un estudiante para estudiantes.
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-600">
             <a href="#" className="hover:text-blue-600">Twitter</a>
             <a href="#" className="hover:text-blue-600">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- COMPONENTES AUXILIARES ---

const FeatureItem = ({ text, highlight = false }: { text: string, highlight?: boolean }) => (
  <li className="flex items-center gap-3 text-sm">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${highlight ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
       <CheckCircle2 size={12} />
    </div>
    <span className={highlight ? 'text-slate-900 font-medium' : 'text-slate-500'}>{text}</span>
  </li>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <div className="border border-slate-200 rounded-xl overflow-hidden">
         <button 
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
         >
            <span className="font-medium text-slate-900">{question}</span>
            {isOpen ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
         </button>
         {isOpen && (
            <div className="p-4 bg-white text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-in slide-in-from-top-2">
               {answer}
            </div>
         )}
      </div>
   )
};