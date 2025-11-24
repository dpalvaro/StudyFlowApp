import { LayoutDashboard, CheckSquare, CalendarClock, BarChart3, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: 'dashboard' | 'tasks' | 'calendar' | 'analytics') => void;
}

export const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard },
    { id: 'tasks', label: 'Mis Tareas', icon: CheckSquare },
    { id: 'calendar', label: 'Agenda', icon: CalendarClock },
    { id: 'analytics', label: 'Análisis', icon: BarChart3 },
  ];

  return (
    <aside className="hidden md:flex w-72 bg-white border-r border-slate-200 flex-col fixed h-full z-10">
      <div className="h-16 flex items-center px-6 border-b border-slate-100">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-200 mr-3">
          S
        </div>
        <span className="font-bold text-xl text-slate-800 tracking-tight">StudyFlow</span>
      </div>

      <div className="p-4 space-y-1 flex-1">
        <div className="mb-6">
          <p className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Menú</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={18} className={activeTab === item.id ? 'text-blue-600' : 'text-slate-400'} />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-slate-100">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg w-full transition-colors">
          <Settings size={18} />
          <span className="text-sm font-medium">Configuración</span>
        </button>
        <div className="flex items-center gap-3 mt-4 px-4 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-sm"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">Estudiante Ing.</p>
            <p className="text-xs text-slate-400 truncate">Plan Premium</p>
          </div>
        </div>
      </div>
    </aside>
  );
};