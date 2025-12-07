import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Home, Calendar, User, Search, Bell, LogOut, Menu, X } from 'lucide-react';

export const ClientLayout: React.FC = () => {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { label: 'Inicio', icon: <Home size={20} />, path: '/cliente/home' },
        { label: 'Médicos', icon: <Search size={20} />, path: '/cliente/medicos' },
        { label: 'Visitas y Citas', icon: <Calendar size={20} />, path: '/cliente/citas' },
        { label: 'Mi Perfil', icon: <User size={20} />, path: '/cliente/perfil' },
        { label: 'Notificaciones', icon: <Bell size={20} />, path: '/cliente/notificaciones' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 fixed h-full z-10 transition-all duration-300 shadow-[2px_0_20px_rgba(0,0,0,0.02)]">
                <div className="p-6 border-b border-slate-50">
                    <div className="flex flex-col items-start px-2">
                        <span className="text-[10px] font-black text-sky-500 uppercase tracking-[0.2em] mb-1">Sistema Web</span>
                        <h1 className="text-xl font-bold text-slate-900 leading-tight">
                            Centro de Salud<br />
                            <span className="text-sky-600">"Los Licenciados"</span>
                        </h1>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                                flex items-center space-x-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all group relative overflow-hidden
                                ${location.pathname === item.path
                                    ? 'text-sky-700 bg-gradient-to-r from-sky-50 to-white shadow-sm ring-1 ring-sky-100'
                                    : 'text-slate-400 hover:text-sky-600 hover:bg-slate-50'}
                            `}
                        >
                            {location.pathname === item.path && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-full my-3"></div>
                            )}
                            <span className={`${location.pathname === item.path ? 'text-sky-600' : 'text-slate-300 group-hover:text-sky-500'} transition-colors`}>
                                {item.icon}
                            </span>
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-50">
                    <Link to="/login" className="flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                        <LogOut size={18} />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-slate-200 z-20 px-4 py-3 flex justify-between items-center shadow-sm">
                <span className="font-bold text-slate-800">C.S. Los Licenciados</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-4 md:p-8 mt-14 md:mt-0 transition-all duration-300">
                <div className="max-w-5xl mx-auto">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-xl p-4 flex flex-col" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-lg">Menú</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
                        </div>
                        <nav className="space-y-2 flex-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg ${location.pathname === item.path ? 'bg-sky-50 text-sky-700' : 'text-slate-600'}`}
                                >
                                    {item.icon}
                                    <span>{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                        <div className="mt-auto pt-4 border-t">
                            <Link to="/login" className="flex items-center space-x-3 px-4 py-3 text-red-600">
                                <LogOut size={20} />
                                <span>Salir</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
