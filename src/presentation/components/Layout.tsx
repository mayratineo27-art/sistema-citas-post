import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-primary-800 text-white flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold tracking-tight">MediSys Posta</h1>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg bg-primary-700 text-white">
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link to="/patients" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-700 text-gray-100 transition">
                        <Users size={20} />
                        <span>Pacientes</span>
                    </Link>
                    <Link to="/appointments" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-700 text-gray-100 transition">
                        <Calendar size={20} />
                        <span>Citas</span>
                    </Link>
                    <Link to="/settings" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-primary-700 text-gray-100 transition">
                        <Settings size={20} />
                        <span>Configuración</span>
                    </Link>
                </nav>
                <div className="p-4 border-t border-primary-700">
                    <button className="flex items-center space-x-3 px-4 py-2 w-full text-left hover:bg-primary-700 rounded-lg transition">
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800">Bienvenido, Dr. Admin</h2>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};
