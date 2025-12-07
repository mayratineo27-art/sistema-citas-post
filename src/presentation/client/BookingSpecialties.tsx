import React from 'react';
import { ChevronLeft, ChevronDown, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const BookingSpecialties: React.FC = () => {
    const navigate = useNavigate();

    const specialties = [
        { id: 'medicina-general', name: 'MEDICINA GENERAL' },
        { id: 'obstetricia', name: 'OBSTETRICIA', hasSubServices: true },
        { id: 'psicologia', name: 'PSICOLOGÍA' },
        { id: 'dental', name: 'DENTAL' },
        { id: 'topico', name: 'TÓPICO' },
        { id: 'emergencia', name: 'EMERGENCIA' },
        { id: 'cres', name: 'CRES (CRECIMIENTO)' }
    ];

    return (
        <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-right-8 duration-700">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4 mb-8 pt-6 sticky top-0 z-20 pb-4 bg-gradient-to-b from-slate-50 to-transparent">
                <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 text-slate-500 hover:text-sky-600">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm flex justify-center items-center relative group cursor-default">
                    <span className="text-slate-600 font-bold uppercase tracking-[0.2em] text-sm flex items-center gap-3 transition-colors group-hover:text-sky-600">
                        <div className="bg-sky-100 p-1.5 rounded-lg">
                            <ChevronDown size={14} className="text-sky-600" />
                        </div>
                        Sacar Cita
                    </span>
                </div>
            </div>

            <div className="text-center mb-8">
                <span className="px-8 py-2 bg-white border border-slate-200 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] shadow-sm">
                    Seleccione una Especialidad
                </span>
            </div>

            {/* Specialties Grid - Scrollable with padding for footer */}
            <div className="flex-1 overflow-y-auto pb-8 px-4 space-y-5 custom-scrollbar">
                {specialties.map((specialty) => (
                    <Link
                        key={specialty.id}
                        to={specialty.hasSubServices ? `/cliente/reservar/servicios/${specialty.id}` : `/cliente/reservar/horarios/${specialty.id}`}
                        className="block group"
                    >
                        <div className="
                            bg-white hover:bg-gradient-to-r hover:from-sky-600 hover:to-sky-500 
                            text-slate-600 hover:text-white 
                            rounded-2xl py-5 px-8 text-center 
                            shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(14,165,233,0.3)] 
                            transition-all duration-300 transform group-hover:scale-[1.02] group-hover:-translate-y-1
                            font-bold tracking-widest text-sm md:text-base border border-slate-100 group-hover:border-transparent
                            flex items-center justify-between group-hover:tracking-[0.15em]
                        ">
                            <span className="w-8"></span> {/* Spacer for centering */}
                            {specialty.name}
                            <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-8" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Heartbeat Footer (Fixed at bottom via Flex) */}
            <div className="mt-auto flex items-end justify-center h-24 w-full pointer-events-none opacity-20 pb-4 mix-blend-multiply">
                <svg viewBox="0 0 500 150" className="w-full text-sky-900 fill-none stroke-current stroke-2">
                    <path d="M0,75 L150,75 L160,40 L180,110 L200,20 L220,130 L240,75 L500,75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
};
