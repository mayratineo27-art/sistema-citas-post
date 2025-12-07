import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    User,
    Lock,
    CalendarPlus,
    FileClock,
    FileText,
    Menu,
    X,
    LogOut,
    Bell
} from 'lucide-react';

interface PatientLayoutProps {
    children: React.ReactNode;
}

export const PatientLayout: React.FC<PatientLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const menuItems = [
        { label: 'Visualizar Perfil', icon: <User size={20} />, path: '/patient/profile' },
        { label: 'Cambiar Contraseña', icon: <Lock size={20} />, path: '/patient/security' },
        { label: 'Sacar Cita', icon: <CalendarPlus size={20} />, path: '/patient/book-appointment' },
        { label: 'Historial', icon: <FileClock size={20} />, path: '/patient/history' },
        { label: 'Examen de Análisis', icon: <FileText size={20} />, path: '/patient/exams' },
    ];

    const handleLogout = () => {
        // Implement logout logic here
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
            {/* Mobile Header */}
            <div className="md:hidden bg-white shadow-sm p-4 flex justify-between items-center z-20 relative">
                <h1 className="font-bold text-primary-700 text-lg">Posta CitaMed</h1>
                <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-gray-600">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
        fixed md:static inset-y-0 left-0 z-10 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col
      `}>
                <div className="p-6 border-b border-gray-100 flex items-center justify-center flex-col">
                    <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-3xl mb-3">
                        MG
                    </div>
                    <h2 className="font-bold text-gray-800 text-lg">Maria Gomez</h2>
                    <p className="text-xs text-gray-500 bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1">Paciente Activo</p>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`
                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200
                ${location.pathname === item.path
                                    ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm border border-primary-100'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 px-4 py-3 rounded-xl w-full text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 z-0 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto h-[calc(100vh-64px)] md:h-screen">
                <header className="flex justify-between items-center mb-8 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 hidden md:block">Panel del Paciente</h1>
                        <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('es-PE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-400 hover:text-primary-600 transition-colors">
                            <Bell size={24} />
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="animate-fadeIn">
                    {children}
                </div>
            </main>
        </div>
    );
};
