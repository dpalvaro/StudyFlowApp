import { useState, useEffect } from 'react';
import { Menu, X, CalendarClock, BarChart3, Search, Database, Loader2, Plus, LogOut, Sparkles } from 'lucide-react';
import { db, auth } from './lib/firebase'; 
import { signOut } from 'firebase/auth'; 
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import { useAuth } from './context/AuthContext';

// Imports Componentes
// Imports Componentes
import type { Task, TaskStatus } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './features/dashboard/DashboardView';
import { KanbanBoard } from './features/tasks/KanbanBoard';
import { CreateTaskModal } from './features/tasks/CreateTaskModal';
import { PlanView } from './features/calendar/PlanView';
import { AnalyticsView } from './features/analytics/AnalyticsView';
import { PremiumGuard } from './components/ui/PremiumGuard';
import { OnboardingWizard } from './features/onboarding/OnboardingWizard'; // <--- IMPORTANTE

function App() {
  const { user, profile } = useAuth(); 
  const USER_ID = user?.uid || "unknown";

  const [activeTab, setActiveTab] = useState<'dashboard' | 'tasks' | 'calendar' | 'analytics'>('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); 

  // --- FIRESTORE: LECTURA ---
  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, 'users', USER_ID, 'tasks');
    const q = query(tasksRef, orderBy('dueDate', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedTasks = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dueDate: data.dueDate?.toDate ? data.dueDate.toDate().toISOString().split('T')[0] : data.dueDate
        } as Task;
      });
      setTasks(fetchedTasks);
      setLoading(false);
    }, (error) => {
      console.error("Error:", error);
      setLoading(false); 
    });
    return () => unsubscribe();
  }, [user]);

  // --- FIRESTORE: ESCRITURA (CRUD) ---
  // ... (Mantenemos las mismas funciones de siempre: handleStatusChange, etc.)
  
  const handleStatusChange = async (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    await updateDoc(doc(db, 'users', USER_ID, 'tasks', id), { status });
  };

  const handleCreateTask = async (newTaskData: any) => {
    try {
      const tasksRef = collection(db, 'users', USER_ID, 'tasks');
      await addDoc(tasksRef, {
        ...newTaskData,
        dueDate: Timestamp.fromDate(new Date(newTaskData.dueDate)),
        createdAt: Timestamp.now()
      });
    } catch (error) {
      console.error("Error creando tarea:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('¿Seguro que quieres borrar esta tarea?')) {
      try {
        await deleteDoc(doc(db, 'users', USER_ID, 'tasks', id));
      } catch (error) {
        console.error("Error borrando:", error);
      }
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // --- RENDER ---

  if (loading && tasks.length === 0) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex">
      
      {/* --- WIZARD DE BIENVENIDA --- */}
      {/* Si el perfil existe pero NO ha completado onboarding, mostramos el Wizard */}
      {profile && !profile.hasCompletedOnboarding && <OnboardingWizard />}

      <CreateTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateTask} 
      />

      {/* Sidebar */}
      <div className="relative hidden md:flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="absolute bottom-16 left-4 w-64 px-4 mb-2">
           <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
              <p className="text-xs text-slate-500 font-bold uppercase mb-1">Tu Plan</p>
              <div className="flex items-center justify-between">
                 <span className={`text-sm font-bold ${profile?.subscriptionStatus === 'PREMIUM' ? 'text-indigo-600' : 'text-slate-700'}`}>
                    {profile?.subscriptionStatus === 'PREMIUM' ? 'Ingeniero Pro ⚡' : 'Estudiante Free'}
                 </span>
              </div>
           </div>
        </div>
        <div className="absolute bottom-4 left-4 w-64 px-4">
           <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-lg w-full transition-colors text-sm font-medium">
              <LogOut size={18} /> Cerrar Sesión
           </button>
        </div>
      </div>

      <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-50 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">S</div><span className="font-bold text-lg text-slate-800">StudyFlow</span></div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">{isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
      </div>

      <main className="flex-1 md:ml-72 p-4 md:p-8 mt-16 md:mt-0 overflow-y-auto h-screen">
        <div className="max-w-6xl mx-auto">
          
          {/* Saludo Personalizado */}
          <div className="mb-8 animate-in fade-in">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {profile?.displayName ? `¡Hola, ${profile.displayName}! 👋` : '¡Hola! 👋'}
              </h1>
              <p className="text-slate-500">Vamos a por todas hoy.</p>
          </div>

          {/* --- VISTAS --- */}

          {activeTab === 'dashboard' && <DashboardView tasks={tasks} />}
          
          {activeTab === 'tasks' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Tablero de Tareas</h2>
                  <p className="text-slate-500">Gestiona tus entregas con el método Kanban.</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-md shadow-blue-200 transition-all"
                  >
                    <Plus size={18} /> Nueva Tarea
                  </button>
                </div>
              </div>
              
              <KanbanBoard 
                tasks={tasks} 
                onStatusChange={handleStatusChange} 
                onDelete={handleDeleteTask}
                onAddClick={() => setIsModalOpen(true)}
              />
            </div>
          )}

          {/* --- VISTAS PROTEGIDAS --- */}
          
          {activeTab === 'calendar' && (
            <PremiumGuard featureName="el Planificador IA">
               <PlanView tasks={tasks} /> 
            </PremiumGuard>
          )}

          {activeTab === 'analytics' && (
            <PremiumGuard featureName="las Analíticas Avanzadas">
               <AnalyticsView tasks={tasks} />
            </PremiumGuard>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;