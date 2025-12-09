
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
        <div className="min-h-screen bg-medical-pattern flex font-sans text-slate-800">
            {/* Sidebar Desktop - REDESIGNED ELEGANT GLASS */}
            <aside className="hidden md:flex flex-col w-72 h-screen fixed left-0 top-0 z-20 transition-all duration-300 border-r border-white/40 bg-white/60 backdrop-blur-xl shadow-2xl shadow-teal-900/5">

                {/* 1. Brand Header */}
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20 text-white font-black text-xl transform group-hover:scale-110 transition-transform duration-300">
                            +
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-4">CITAMEDIC</h1>
                            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">Portal Salud</span>
                        </div>
                    </div>
                </div>

                {/* 2. Profile Selector (Compact & Floating) */}
                <div className="px-6 py-2">
                    <div className="relative group">
                        <button
                            onClick={() => setIsProfileSelectorOpen(!isProfileSelectorOpen)}
                            className="w-full flex items-center gap-3 bg-white/50 hover:bg-white border border-slate-200/50 hover:border-teal-200 rounded-2xl p-3 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${activeDni === '12345678' ? 'border-teal-100 bg-teal-50 text-teal-600' : 'border-pink-100 bg-pink-50 text-pink-500'}`}>
                                {activeDni === '12345678' ? <UserCircle size={20} strokeWidth={1.5} /> : <Baby size={20} strokeWidth={1.5} />}
                            </div>
                            <div className="flex-1 text-left overflow-hidden">
                                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Perfil Activo</div>
                                <div className="text-sm font-bold text-slate-700 truncate">{patientName}</div>
                            </div>
                            <div className="text-slate-300 group-hover:text-teal-500 transition-colors">
                                <ChevronRight size={16} />
                            </div>
                        </button>

                        {isProfileSelectorOpen && (
                            <div className="absolute top-[110%] left-0 w-full bg-white/90 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 p-2 space-y-1">
                                <button
                                    onClick={() => switchProfile('12345678', 'Usuario Principal')}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeDni === '12345678' ? 'bg-teal-50 text-teal-700' : 'hover:bg-slate-50 text-slate-500'}`}
                                >
                                    <UserCircle size={16} /> Usuario Principal
                                </button>
                                {childrenProfiles.map(child => (
                                    <button
                                        key={child.id}
                                        onClick={() => switchProfile(child.dni, child.first_name)}
                                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${activeDni === child.dni ? 'bg-pink-50 text-pink-700' : 'hover:bg-slate-50 text-slate-500'}`}
                                    >
                                        <Baby size={16} /> {child.first_name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. Navigation Links */}
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    <p className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest mb-3">Menú Principal</p>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group
                                    ${isActive
                                        ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30 translate-x-1'
                                        : 'text-slate-500 hover:text-teal-700 hover:bg-teal-50/50 hover:pl-6'}
                                `}
                            >
                                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-500'} transition-colors duration-300`}>
                                    {React.cloneElement(item.icon as any, { strokeWidth: isActive ? 2.5 : 2, size: 20 })}
                                </span>
                                <span className={`font-bold tracking-wide ${isActive ? 'text-white' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* 4. Footer */}
                <div className="p-6 border-t border-slate-100/50">
                    <Link to="/login" className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 group">
                        <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>

            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
                <span className="font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white font-black text-lg">+</div>
                    CITAMEDIC
                </span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-72 p-4 md:p-8 mt-14 md:mt-0 transition-all duration-300">
                <div className="max-w-6xl mx-auto">
                    {/* Active Profile Banner for Mobile/Overview */}
                    <div className="mb-6 md:hidden">
                        <div className="bg-white/80 backdrop-blur-sm border boundary-slate-200 rounded-xl p-3 flex items-center justify-between shadow-sm" onClick={() => setIsProfileSelectorOpen(!isProfileSelectorOpen)}>
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

            {/* Mobile Menu Overlay */}
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
                                    className={`flex items-center space-x-3 px-4 py-4 rounded-xl font-bold ${location.pathname === item.path ? 'bg-teal-600 text-white shadow-lg shadow-teal-500/30' : 'text-slate-500 hover:bg-slate-50'}`}
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
