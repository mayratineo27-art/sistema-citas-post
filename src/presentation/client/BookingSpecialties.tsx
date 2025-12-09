
import React from 'react';
import { ChevronLeft, Stethoscope, Baby, Brain, Smile, Activity, Siren, GraduationCap, ChevronRight, HeartPulse } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const BookingSpecialties: React.FC = () => {
    const navigate = useNavigate();

    // Elegant, formal palette - mostly Teutonic/Medical Blues and Teals
    const specialties = [
        { id: 'medicina-general', name: 'Medicina General', icon: <Stethoscope size={28} strokeWidth={1.5} />, description: 'Atención integral primaria' },
        { id: 'obstetricia', name: 'Obstetricia', hasSubServices: true, icon: <Baby size={28} strokeWidth={1.5} />, description: 'Salud reproductiva y materna' },
        { id: 'psicologia', name: 'Psicología', icon: <Brain size={28} strokeWidth={1.5} />, description: 'Bienestar mental y emocional' },
        { id: 'dental', name: 'Odontología', icon: <Smile size={28} strokeWidth={1.5} />, description: 'Salud bucal integral' },
        { id: 'topico', name: 'Tópico / Enfermería', icon: <Activity size={28} strokeWidth={1.5} />, description: 'Curaciones y procedimientos' },
        { id: 'emergencia', name: 'Emergencia', icon: <Siren size={28} strokeWidth={1.5} />, description: 'Atención de urgencias 24h' },
        { id: 'cres', name: 'CRES (Crecimiento)', icon: <GraduationCap size={28} strokeWidth={1.5} />, description: 'Control de desarrollo infantil' }
    ];

    return (
        <div className="max-w-5xl mx-auto flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-right-8 duration-700 px-6">
            {/* Elegant Header */}
            <div className="flex items-center gap-6 mb-10 pt-8 sticky top-0 z-20 pb-6">
                <button onClick={() => navigate(-1)} className="group p-3 bg-white/80 hover:bg-slate-800 rounded-full transition-all border border-slate-200 hover:border-slate-800 text-slate-400 hover:text-white backdrop-blur-sm">
                    <ChevronLeft size={24} strokeWidth={1.5} />
                </button>
                <div className="flex-1 border-b border-slate-200 pb-2 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                            <span className="font-bold text-teal-700">Nueva Cita</span>
                            <span className="text-slate-300 text-2xl font-thin">/</span>
                            <span className="text-slate-500 text-lg">Especialidad</span>
                        </h1>
                    </div>
                    <span className="hidden md:flex items-center gap-2 text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em] bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                        <HeartPulse size={14} /> Seleccione Servicio
                    </span>
                </div>
            </div>

            {/* Specialties Grid - Formal Style */}
            <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {specialties.map((specialty) => (
                        <Link
                            key={specialty.id}
                            to={specialty.hasSubServices ? `/cliente/reservar/servicios/${specialty.id}` : `/cliente/reservar/horarios/${specialty.id}`}
                            className="block group"
                        >
                            <div className="
                                h-full bg-white/40 hover:bg-white backdrop-blur-sm
                                border border-slate-200 hover:border-teal-200
                                rounded-xl p-6 transition-all duration-300
                                hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1
                                flex flex-col gap-4 relative overflow-hidden
                            ">
                                {/* Subtle Decor */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-slate-50 to-teal-50/50 rounded-bl-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <div className="flex items-start justify-between relative z-10">
                                    <div className="p-3 bg-white border border-slate-100 rounded-lg text-slate-400 group-hover:text-teal-600 group-hover:border-teal-100 transition-all duration-300 shadow-sm">
                                        {specialty.icon}
                                    </div>
                                    <ChevronRight size={20} className="text-slate-300 group-hover:text-teal-500 transform -translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100 transition-all duration-300" strokeWidth={1.5} />
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-lg font-bold text-slate-700 group-hover:text-teal-900 transition-colors tracking-tight">
                                        {specialty.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 font-medium group-hover:text-slate-500 mt-1 leading-relaxed">
                                        {specialty.description}
                                    </p>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500/0 via-teal-500/50 to-teal-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
