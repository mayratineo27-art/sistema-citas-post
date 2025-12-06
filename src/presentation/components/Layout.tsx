import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, LogOut, Stethoscope } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-800 text-white flex flex-col shadow-xl z-20">
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-tight">CitaMedica</h1>
                    <p className="text-primary-200 text-xs">Gestión Integral</p>
                </div>
                <nav className="flex-1 px-4 space-y-2 py-4">
                    <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-sm">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/patients" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-white/10 hover:text-white transition">
                        <Users size={20} />
                        <span>Pacientes</span>
                    </Link>
                    <Link to="/doctors" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-white/10 hover:text-white transition">
                        <Stethoscope size={20} />
                        <span>Médicos</span>
                    </Link>
                    <Link to="/appointments" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-white/10 hover:text-white transition">
                        <Calendar size={20} />
                        <span>Agenda</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-primary-100 hover:bg-white/10 hover:text-white transition">
                        <Settings size={20} />
                        <span>Configuración</span>
                    </Link>
                </nav>
                <div className="p-4 bg-primary-900/50">
                    <Link to="/login" className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:text-red-200 text-gray-300 transition">
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative">
                <header className="bg-white h-16 shadow-sm flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="text-lg font-medium text-gray-700">Bienvenido</h2>
                    <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">A</div>
                </header>
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
