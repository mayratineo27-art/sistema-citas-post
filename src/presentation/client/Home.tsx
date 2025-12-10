
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Calendar, FileText, Clock, FileBarChart, Activity, ChevronRight, Stethoscope, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
    const [patientName, setPatientName] = React.useState('Paciente');
    const [activeDni, setActiveDni] = React.useState(localStorage.getItem('activePatientDni') || '12345678');
    const [familyMembers, setFamilyMembers] = React.useState<any[]>([]);

    React.useEffect(() => {
        const fetchData = async () => {
            const active = localStorage.getItem('activePatientDni') || '12345678';
            setActiveDni(active);

            // Get Patient Name
            const { data: patient } = await import('../../infrastructure/db/client').then(m => m.supabaseClient.from('patients').select('first_name, last_name, id').eq('dni', active).single());
            if (patient) setPatientName(`${patient.first_name} ${patient.last_name}`);

            // Get Family for Widget (only if main user)
            if (active === '12345678' && patient) {
                const { data: kids } = await import('../../infrastructure/db/client').then(m => m.supabaseClient.from('patients').select('*').eq('parent_id', patient.id).limit(3));
                if (kids) setFamilyMembers(kids);
            }
        };
        fetchData();
    }, []);

    const quickActions = [
        { label: 'Reservar Cita', icon: <Calendar size={24} />, path: '/cliente/reservar', color: 'bg-teal-600 text-white', desc: 'Medicina, Odontología...' },
        { label: 'Resultados', icon: <FileBarChart size={24} />, path: '/cliente/analisis', color: 'bg-indigo-600 text-white', desc: 'Laboratorio e Imágenes' },
        { label: 'Mis Recetas', icon: <FileText size={24} />, path: '/cliente/recetas', color: 'bg-emerald-500 text-white', desc: 'Historial de Medicación' },
    ];

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-700 relative pb-10">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 -z-10 opacity-5 pointer-events-none">
                <Stethoscope size={500} className="text-teal-900 rotate-12 translate-x-32 -translate-y-20" />
            </div>

            {/* 1. HERO SECTION */}
            <header className="mb-10 pt-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-light text-slate-800 tracking-tight">
                            Hola, <span className="font-bold text-teal-700 capitalize">{patientName.toLowerCase()}</span>
                        </h1>
                        <p className="text-slate-500 font-medium mt-2 text-lg">¿Cómo te sientes hoy?</p>
                    </div>
                    <div className="hidden md:flex items-center gap-2 bg-white/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/50 shadow-sm text-sm font-bold text-teal-800">
                        <Activity size={18} className="animate-pulse text-teal-500" />
                        <span>Todo en orden</span>
                    </div>
                </div>
            </header>

            {/* 2. HEALTH WIDGETS GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">

                {/* A. Next Appointment (Hero Widget) */}
                <div className="lg:col-span-2 relative group overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-teal-600 to-teal-800 text-white p-8 shadow-xl shadow-teal-900/10">
                    <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4 transition-transform group-hover:scale-110 duration-700">
                        <Calendar size={250} />
                    </div>

                    <div className="relative z-10 h-full flex flex-col justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
                                <Clock size={12} /> Próxima Cita
                            </div>
                            <h2 className="text-3xl font-bold max-w-md leading-tight mb-2">No tienes citas programadas para hoy.</h2>
                            <p className="text-teal-100 font-medium opacity-90">Mantén tu salud al día programando tus chequeos preventivos.</p>
                        </div>

                        <Link to="/cliente/reservar" className="mt-8 bg-white text-teal-700 px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-teal-50 shadow-lg transition-all active:scale-95">
                            Agendar Ahora <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>

                {/* B. Family & Vitals Column */}
                <div className="space-y-6 flex flex-col">

                    {/* Family Quick View */}
                    <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-lg shadow-indigo-900/5 hover:shadow-indigo-900/10 transition-all">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-700 flex items-center gap-2">
                                <Users size={18} className="text-indigo-500" /> Mi Familia
                            </h3>
                            <Link to="/cliente/familiares" className="text-[10px] font-bold uppercase text-indigo-500 hover:text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">Ver Todos</Link>
                        </div>
                        <div className="flex items-center gap-2">
                            {familyMembers.length > 0 ? (
                                familyMembers.map(member => (
                                    <div key={member.id} className="w-12 h-12 rounded-full bg-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold text-lg" title={member.first_name}>
                                        {member.first_name[0]}
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs text-slate-400 italic py-2">Sin familiares registrados</p>
                            )}
                            <Link to="/cliente/familiares" className="w-12 h-12 rounded-full border-2 border-dashed border-indigo-200 flex items-center justify-center text-indigo-300 hover:text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                                <span className="text-xl font-light">+</span>
                            </Link>
                        </div>
                    </div>

                    {/* Vitals Mockup */}
                    <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 shadow-lg shadow-pink-900/5 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500">
                                <Activity size={24} />
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Último pulso</h3>
                                <div className="text-2xl font-black text-slate-800">72 <span className="text-sm font-medium text-slate-400">BPM</span></div>
                            </div>
                        </div>
                        <div className="text-green-500 bg-green-50 px-2 py-1 rounded-lg text-xs font-bold">Normal</div>
                    </div>
                </div>
            </div>

            {/* 3. QUICK ACTIONS */}
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 ml-2">Accesos Directos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {quickActions.map((action) => (
                    <Link key={action.label} to={action.path} className="group cursor-pointer">
                        <div className="bg-white/80 backdrop-blur-md rounded-[2rem] p-6 border border-white/60 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${action.color} shadow-lg`}>
                                {action.icon}
                            </div>
                            <h4 className="text-lg font-black text-slate-800 mb-1 group-hover:text-teal-700 transition-colors">{action.label}</h4>
                            <p className="text-xs font-medium text-slate-500">{action.desc}</p>

                            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                                <ChevronRight className="text-slate-300" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-auto pt-12 flex justify-center opacity-30">
                <p className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">Portal del Paciente - Los Licenciados</p>
            </div>
        </div>
    );
};
