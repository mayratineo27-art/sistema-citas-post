import React from 'react';
import { ChevronLeft, ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const BookingServices: React.FC = () => {
    const navigate = useNavigate();
    const { especialidad } = useParams();

    // Mock data based on prototype - In real app, fetch from DB
    const services = [
        { id: '1', name: 'ECOGRAFÍA' },
        { id: '2', name: 'PLANIFICACIÓN FAMILIAR' },
        { id: '3', name: 'CONTROL GESTANTES' },
        { id: '4', name: 'SALA DE PARTO' }
    ];

    const specialtyName = especialidad?.toUpperCase() || 'ESPECIALIDAD';

    return (
        <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header / Breadcrumb */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0">
                    <ChevronLeft size={24} className="text-slate-600" />
                </button>
                <div className="flex-1 bg-gradient-to-r from-slate-200 to-slate-300 rounded-lg p-3 shadow-inner flex justify-center items-center relative">
                    <span className="text-slate-800 font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                        <ChevronDown size={16} /> {specialtyName}
                    </span>
                </div>
            </div>

            {/* Services List - Scrollable */}
            <div className="flex-1 overflow-y-auto pb-8 space-y-6 px-2">
                {services.map((service) => (
                    <div key={service.id} className="flex items-center gap-4 group cursor-pointer">
                        <div className="text-slate-400 group-hover:text-sky-600 transition-colors">
                            <ArrowRight size={24} />
                        </div>
                        <Link
                            to={`/cliente/reservar/horarios/${especialidad}?servicio=${service.id}`}
                            className="flex-1 block"
                        >
                            <div className="bg-slate-200 hover:bg-sky-600 text-slate-800 hover:text-white rounded-full py-3 px-8 text-center shadow-sm hover:shadow-xl transition-all font-bold tracking-wide text-lg group-hover:scale-105 border border-slate-300 group-hover:border-transparent">
                                {service.name}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Heartbeat Footer (Fixed at bottom via Flex) */}
            <div className="mt-auto flex items-end justify-center h-24 w-full pointer-events-none opacity-40 pb-4">
                <svg viewBox="0 0 500 150" className="w-full text-slate-800 fill-none stroke-current stroke-2">
                    <path d="M0,75 L150,75 L160,40 L180,110 L200,20 L220,130 L240,75 L500,75" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
    );
};
