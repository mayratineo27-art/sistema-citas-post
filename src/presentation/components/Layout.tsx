import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Calendar,
    Settings,
    LogOut,
    Stethoscope,
    Menu,
    X
} from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
        { label: 'Pacientes', icon: <Users size={20} />, path: '/patients' },
        { label: 'Médicos', icon: <Stethoscope size={20} />, path: '/doctors' },
        { label: 'Agenda', icon: <Calendar size={20} />, path: '/appointments' },
        { label: 'Configuración', icon: <Settings size={20} />, path: '/settings' },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900">

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-gray-900 text-white z-30 flex items-center justify-between p-4 shadow-md">
                <h1 className="font-bold text-lg">CitaMedica</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 rounded-md hover:bg-gray-800">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-20 w-64 bg-gray-900 text-gray-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
        pt-16 md:pt-0
      `}>
                <div className="p-6 hidden md:block">
                    <h1 className="text-2xl font-bold text-white tracking-tight">CitaMedica</h1>
                    <p className="text-gray-500 text-xs mt-1 uppercase tracking-wider">Gestión Integral</p>
                </div>

                <nav className="flex-1 px-3 space-y-1 py-4 overflow-y-auto">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group
                ${location.pathname === item.path
                                    ? 'bg-gray-800 text-white shadow-md border-l-4 border-blue-500'
                                    : 'hover:bg-gray-800 hover:text-white'}
              `}
                        >
                            <div className={`${location.pathname === item.path ? 'text-blue-400' : 'text-gray-400 group-hover:text-white'}`}>
                                {item.icon}
                            </div>
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800 bg-gray-900">
                    <Link
                        to="/login"
                        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors w-full"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-10 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative pt-16 md:pt-0">
                <header className="bg-white h-16 border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 hidden md:flex">
                    <h2 className="text-lg font-semibold text-gray-700">Panel de Administración</h2>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full">
                            <span className="sr-only">Notificaciones</span>
                            <div className="relative">
                                <div className="w-2.5 h-2.5 bg-red-500 rounded-full absolute -top-1 -right-1 border-2 border-white"></div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                            </div>
                        </button>
                        <div className="h-9 w-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold border-2 border-white shadow-sm ring-1 ring-gray-100">
                            A
                        </div>
                    </div>
                </header>
                <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
                    {children}
                </div>
            </main>
        </div>
    );
};
