import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, FileText, Clock, FileBarChart, Activity, ChevronRight, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
    const menuItems = [
        {
            label: 'SACAR CITA',
            icon: <Calendar className="w-8 h-8 mb-2" />,
            path: '/cliente/reservar',
            color: 'bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/30' // Primary Action - Strong Green
        },
        {
            label: 'RECETAS',
            icon: <FileText className="w-8 h-8 mb-2" />,
            path: '/cliente/recetas',
            color: 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-100' // Secondary
        },
        {
            label: 'HISTORIAL',
            icon: <Clock className="w-8 h-8 mb-2" />,
            path: '/cliente/historial',
            color: 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-100' // Secondary
        },
        {
            label: 'ANÁLISIS DE LAB',
            icon: <FileBarChart className="w-8 h-8 mb-2" />,
            path: '/cliente/analisis',
            color: 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-100' // Secondary
        },
        {
            label: 'MIS FAMILIARES',
            icon: <Activity className="w-8 h-8 mb-2" />,
            path: '/cliente/familiares',
            color: 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-2 border-indigo-100' // Distinctive
        },
    ];

    const [patientName, setPatientName] = React.useState('Paciente');

    React.useEffect(() => {
        const fetchName = async () => {
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';
            const { data } = await import('../../infrastructure/db/client').then(m => m.supabaseClient.from('patients').select('first_name').eq('dni', activeDni).single());
            if (data) setPatientName(data.first_name);
        };
        fetchName();
    }, []);

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
            {/* Background Texture */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]">
                <Stethoscope size={400} className="absolute -top-20 -right-20 rotate-12" />
            </div>

            {/* Header matches prototype 'PACIENTE' bar */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 mb-8 flex items-center justify-between shadow-lg shadow-slate-200/50 border border-white/50 sticky top-0 z-10">
                <span className="text-slate-800 font-bold uppercase tracking-widest text-sm flex items-center gap-3">
                    <div className="bg-teal-50 p-2 rounded-full text-teal-600">
                        <ChevronRight size={18} />
                    </div>
                    <div>
                        <div className="text-[10px] text-slate-400">Bienvenido/a,</div>
                        <div className="text-lg text-slate-900 font-black">{patientName}</div>
                    </div>
                </span>
                <span className="text-teal-700 text-[10px] font-black uppercase tracking-widest bg-teal-50 border border-teal-100 px-4 py-2 rounded-full">Portal del Paciente</span>
            </div>

            {/* Main Grid Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full flex-1 px-4">
                {/* Main Action - Large Card */}
                <Link to="/cliente/reservar" className="md:col-span-2 group relative">
                    <div className="h-full min-h-[220px] bg-gradient-to-br from-teal-500 to-teal-700 rounded-[2.5rem] p-8 flex flex-col justify-between shadow-xl shadow-teal-900/20 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-1/4 -translate-y-1/4">
                            <Calendar size={200} className="text-white" />
                        </div>

                        <div className="relative z-10">
                            <div className="bg-white/20 backdrop-blur-md w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white shadow-inner">
                                <Calendar size={28} />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight mb-2">SACAR NUEVA CITA</h2>
                            <p className="text-teal-100 font-medium max-w-sm">Programa tu atención médica en Medicina General, Odontología y más especialidades.</p>
                        </div>

                        <div className="relative z-10 self-start mt-6 bg-white text-teal-700 px-6 py-3 rounded-xl font-bold text-sm hover:bg-teal-50 transition-colors shadow-lg shadow-teal-900/10 flex items-center gap-2">
                            Reservar Ahora <ChevronRight size={16} />
                        </div>
                    </div>
                </Link>

                {/* Secondary Cards */}
                {menuItems.slice(1).map((item) => (
                    <Link key={item.label} to={item.path} className="group relative">
                        <div className={`
                            ${item.color}
                            h-full min-h-[220px] rounded-[2.5rem] p-8 flex flex-col items-start justify-between
                            shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1
                            relative overflow-hidden
                        `}>
                            <div className="absolute -bottom-4 -right-4 opacity-10 transform rotate-12 scale-150 transition-transform group-hover:scale-125 duration-500">
                                {React.cloneElement(item.icon, { className: 'w-32 h-32' })}
                            </div>

                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-700 mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
                                {React.cloneElement(item.icon, { className: 'w-6 h-6' })}
                            </div>

                            <span className="font-black text-xl tracking-wide uppercase z-10 text-slate-800 group-hover:text-black">
                                {item.label}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Heartbeat Footer */}
            <div className="mt-12 opacity-20 flex items-end justify-center h-24 overflow-hidden w-full pointer-events-none">
                <svg viewBox="0 0 500 150" className="w-full h-full text-slate-900 fill-none stroke-current stroke-2">
                    <path d="M0,75 L150,75 L160,40 L180,110 L200,20 L220,130 L240,75 L500,75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
            <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2 mb-8">
                Sistema de Gestión de Citas - "Los Licenciados"
            </p>
        </div>
    );
};
