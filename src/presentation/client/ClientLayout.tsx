
import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, Calendar, User, Search, Bell, LogOut, Menu, X, Users, Check, Baby, UserCircle, ChevronRight, Stethoscope } from 'lucide-react';

export const ClientLayout: React.FC = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileSelectorOpen, setIsProfileSelectorOpen] = useState(false);

    // Logic for Active Patient (localStorage)
    const [activeDni, setActiveDni] = useState(localStorage.getItem('activePatientDni') || '12345678');
    const [patientName, setPatientName] = useState(activeDni === '12345678' ? 'Usuario Principal' : 'Hijo/a'); // Dynamic name
    const [childrenProfiles, setChildrenProfiles] = useState<any[]>([]);

    useEffect(() => {
        const fetchChildren = async () => {
            // Fetch parent (Test Patient)
            const { data: parent } = await import('../../infrastructure/db/client').then(m => m.supabaseClient.from('patients').select('id').eq('dni', '12345678').single());
            if (parent) {
                const { data } = await import('../../infrastructure/db/client').then(m => m.supabaseClient.from('patients').select('*').eq('parent_id', parent.id));
                if (data) setChildrenProfiles(data);

                // Update active name if it's a child
                if (activeDni !== '12345678') {
                    const activeChild = data?.find((c: any) => c.dni === activeDni);
                    if (activeChild) setPatientName(`${activeChild.first_name} (Hijo/a)`);
                }
            }
        };
        fetchChildren();
    }, [activeDni]);

    const navItems = [
        { label: 'Inicio', icon: <Home size={20} />, path: '/cliente/home' },
        { label: 'Médicos', icon: <Search size={20} />, path: '/cliente/medicos' },
        { label: 'Visitas y Citas', icon: <Calendar size={20} />, path: '/cliente/citas' },
        { label: 'Mi Perfil', icon: <User size={20} />, path: '/cliente/perfil' },
        { label: 'Notificaciones', icon: <Bell size={20} />, path: '/cliente/notificaciones' },
    ];

    const switchProfile = (dni: string, name: string) => {
        localStorage.setItem('activePatientDni', dni);
        setActiveDni(dni);
        setPatientName(name);
        setIsProfileSelectorOpen(false);
        // Force reload to update all components
        window.location.reload();
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
            {/* Sidebar Desktop - LIGHT PREMIUM THEME */}
            <aside className="hidden md:flex flex-col w-72 bg-white border-r border-slate-200 fixed h-full z-10 transition-all duration-300 shadow-xl shadow-slate-200/50">

                {/* Brand Header */}
                <div className="p-8 relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-inner">
                            <span className="text-white font-black text-2xl">+</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-wide text-shadow-sm">CITAMEDIC</h1>
                            <p className="text-[10px] text-teal-100 uppercase tracking-wider font-bold opacity-80">Huamanga</p>
                        </div>
                    </div>
                </div>

                {/* Profile Selector - Light Mode Integration */}
                <div className="px-6 mb-6 mt-6">
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileSelectorOpen(!isProfileSelectorOpen)}
                            className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-teal-200 rounded-2xl p-4 transition-all group shadow-sm hover:shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${activeDni === '12345678' ? 'border-indigo-100 bg-indigo-50 text-indigo-600' : 'border-pink-100 bg-pink-50 text-pink-500'}`}>
                                    {activeDni === '12345678' ? <User size={18} /> : <Baby size={18} />}
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase group-hover:text-teal-600 transition-colors">Perfil Activo</div>
                                    <div className="text-xs font-bold text-slate-700 truncate w-28">{patientName}</div>
                                </div>
                            </div>
                            <ChevronRight size={16} className="text-slate-400 group-hover:text-teal-600 transition-colors" />
                        </button>

                        {isProfileSelectorOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => switchProfile('12345678', 'Usuario Principal')}
                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${activeDni === '12345678' ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                        <UserCircle size={16} /> Usuario Principal
                                        {activeDni === '12345678' && <Check size={14} className="ml-auto" />}
                                    </button>
                                    {childrenProfiles.map(child => (
                                        <button
                                            key={child.id}
                                            onClick={() => switchProfile(child.dni, `${child.first_name}`)}
                                            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${activeDni === child.dni ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-50 text-slate-600'}`}
                                        >
                                            <Baby size={16} /> {child.first_name}
                                            {activeDni === child.dni && <Check size={14} className="ml-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto px-4 space-y-2">
                    <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Menu Principal</p>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center space-x-3 px-4 py-4 rounded-xl text-sm font-bold transition-all group relative overflow-hidden
                                ${location.pathname === item.path
                                    ? 'bg-teal-50 text-teal-800 shadow-sm ring-1 ring-teal-100 border-r-4 border-teal-500'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}
                            `}
                        >

                            <span className={`${location.pathname === item.path ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-slate-100">
                    <Link to="/login" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black text-lg">+</div>
                    CITAMEDIC
                </span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 mt-14 md:mt-0 transition-all duration-300 bg-slate-50/50">
                <div className="max-w-5xl mx-auto">
                    {/* Active Profile Banner for Mobile/Overview */}
                    <div className="mb-6 md:hidden">
                        <div className="bg-white border boundary-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm" onClick={() => setIsProfileSelectorOpen(!isProfileSelectorOpen)}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activeDni === '12345678' ? 'bg-indigo-100 text-indigo-600' : 'bg-pink-100 text-pink-600'}`}>
                                    {activeDni === '12345678' ? <User size={16} /> : <Baby size={16} />}
                                </div>
                                <div className="text-left">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase">Perfil Activo</div>
                                    <div className="text-xs font-bold text-slate-700">{patientName}</div>
                                </div>
                            </div>
                            <span className="text-xs text-teal-600 font-bold">Cambiar</span>
                        </div>
                        {isProfileSelectorOpen && (
                            <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                <div className="p-2 space-y-1">
                                    <button
                                        onClick={() => switchProfile('12345678', 'Usuario Principal')}
                                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-slate-50 border-b border-slate-50"
                                    >
                                        <UserCircle size={16} /> Usuario Principal
                                        {activeDni === '12345678' && <Check size={14} className="ml-auto text-green-500" />}
                                    </button>
                                    {childrenProfiles.map(child => (
                                        <button
                                            key={child.id}
                                            onClick={() => switchProfile(child.dni, child.first_name)}
                                            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-slate-50"
                                        >
                                            <Baby size={16} /> {child.first_name}
                                            {activeDni === child.dni && <Check size={14} className="ml-auto text-green-500" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <Outlet />
                </div>
            </main>

            {/* Mobile Menu Overlay - Updated to Dark Theme */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl p-6 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-8">
                            <span className="font-black text-xl text-teal-800">Menú</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-black"><X size={24} /></button>
                        </div>
                        <nav className="space-y-3 flex-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl font-bold ${location.pathname === item.path ? 'bg-teal-50 text-teal-700' : 'text-slate-500 hover:bg-slate-50'}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto pt-4 border-t border-slate-100">
                            <Link to="/login" className="flex items-center space-x-3 px-4 py-3 text-red-500 font-bold">
                                <LogOut size={20} />
                                <span onClick={() => setIsMobileMenuOpen(false)}>Cerrar Sesión</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
