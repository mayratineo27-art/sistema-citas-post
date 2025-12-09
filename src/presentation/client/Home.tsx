import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, FileText, Clock, FileBarChart, Activity, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
    const menuItems = [
        {
            label: 'SACAR CITA',
            icon: <Calendar className="w-8 h-8 mb-2" />,
            path: '/cliente/reservar',
            color: 'bg-sky-100 text-sky-700 hover:bg-sky-200 border-sky-300'
        },
        {
            label: 'RECETAS',
            icon: <FileText className="w-8 h-8 mb-2" />,
            path: '/cliente/recetas',
            color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
        },
        {
            label: 'HISTORIAL',
            icon: <Clock className="w-8 h-8 mb-2" />,
            path: '/cliente/historial',
            color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
        },
        {
            label: 'EXAMEN DE ANÁLISIS',
            icon: <FileBarChart className="w-8 h-8 mb-2" />,
            path: '/cliente/analisis',
            color: 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300'
        },
        {
            label: 'MIS FAMILIARES',
            icon: <Activity className="w-8 h-8 mb-2" />, // Or Users icon
            path: '/cliente/familiares',
            color: 'bg-purple-100 text-purple-700 hover:bg-purple-200 border-purple-300'
        },
    ];

    const [patientName, setPatientName] = React.useState('Paciente');

    React.useEffect(() => {
        const fetchName = async () => {
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';
            // Simple fetch to show name (optional, but good for feedback)
            const { data } = await import('../../infrastructure/db/client').then(m => m.supabaseClient.from('patients').select('first_name').eq('dni', activeDni).single());
            if (data) setPatientName(data.first_name);
        };
        fetchName();
    }, []);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            {/* Header matches prototype 'PACIENTE' bar */}
            <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 mb-8 flex items-center justify-between shadow-sm border border-slate-200/60 sticky top-0 z-10">
                <span className="text-slate-600 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                    <div className="bg-sky-100 p-1 rounded-full text-sky-600">
                        <ChevronRight size={16} />
                    </div>
                    {patientName}
                </span>
                <span className="text-slate-400 text-xs font-medium bg-slate-100 px-3 py-1 rounded-full">Menú Principal</span>
            </div>

            {/* Main Grid Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto w-full flex-1 px-2">
                {menuItems.map((item) => (
                    <Link key={item.label} to={item.path} className="group relative">
                        <div className={`
                            ${item.color.replace('bg-', 'bg-gradient-to-br from-white to-').replace('border-', 'border-t-4 border-')} 
                            h-48 rounded-[2rem] flex flex-col items-center justify-center gap-4
                            shadow-md transition-all duration-500 transform 
                            group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:scale-[1.02]
                            relative overflow-hidden
                        `}>
                            <div className="absolute top-0 right-0 p-3 opacity-10 transform translate-x-1/2 -translate-y-1/2">
                                {React.cloneElement(item.icon, { className: 'w-32 h-32' })}
                            </div>

                            <div className="p-4 bg-white/60 rounded-full shadow-sm group-hover:shadow-md transition-shadow duration-300 backdrop-blur-sm z-10">
                                {React.cloneElement(item.icon, { className: 'w-8 h-8' })}
                            </div>

                            <span className="font-black text-lg tracking-widest uppercase z-10 group-hover:tracking-[0.15em] transition-all duration-500">
                                {item.label}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Heartbeat Footer */}
            <div className="mt-12 opacity-30 flex items-end justify-center h-24 overflow-hidden w-full">
                {/* CSS Graphic representation of heartbeat line */}
                <svg viewBox="0 0 500 150" className="w-full h-full text-slate-800 fill-none stroke-current stroke-2">
                    <path d="M0,75 L150,75 L160,40 L180,110 L200,20 L220,130 L240,75 L500,75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <p className="text-center text-xs text-slate-400 mt-2">Sistema de Gestión de Citas - "Los Licenciados"</p>
        </div>
    );
};
