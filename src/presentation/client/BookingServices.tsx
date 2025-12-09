
import React from 'react';
import { ChevronLeft, ChevronRight, Activity, Users, Baby, Home, Stethoscope, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export const BookingServices: React.FC = () => {
    const navigate = useNavigate();
    const { especialidad } = useParams();

    // Mock data based on prototype - In real app, fetch from DB
    const services = [
        { id: '1', name: 'Ecografía 4D/5D', icon: <Activity size={24} strokeWidth={1.5} />, description: 'Imágenes de alta resolución' },
        { id: '2', name: 'Planificación Familiar', icon: <Users size={24} strokeWidth={1.5} />, description: 'Consejería y métodos' },
        { id: '3', name: 'Control de Gestantes', icon: <Baby size={24} strokeWidth={1.5} />, description: 'Monitoreo prenatal mensual' },
        { id: '4', name: 'Sala de Parto', icon: <Home size={24} strokeWidth={1.5} />, description: 'Atención de parto normal' }
    ];

    const specialtyName = especialidad ? especialidad.replace('-', ' ').toUpperCase() : 'ESPECIALIDAD';

    return (
        <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-right-8 duration-700 px-6">

            {/* Elegant Header */}
            <div className="flex items-center gap-6 mb-10 pt-8 sticky top-0 z-20 pb-6">
                <button onClick={() => navigate(-1)} className="group p-3 bg-white/80 hover:bg-slate-800 rounded-full transition-all border border-slate-200 hover:border-slate-800 text-slate-400 hover:text-white backdrop-blur-sm">
                    <ChevronLeft size={24} strokeWidth={1.5} />
                </button>
                <div className="flex-1 border-b border-slate-200 pb-2">
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <span className="font-bold text-teal-700">{specialtyName}</span>
                        <span className="text-slate-300 text-2xl font-thin">/</span>
                        <span className="text-slate-500 text-lg">Servicios</span>
                    </h1>
                </div>
            </div>

            {/* Services List - Elegant Cards */}
            <div className="flex-1 overflow-y-auto pb-12 custom-scrollbar pl-1 pr-2">
                <div className="grid grid-cols-1 gap-4">
                    {services.map((service) => (
                        <Link
                            key={service.id}
                            to={`/cliente/reservar/horarios/${especialidad}?servicio=${service.id}`}
                            className="block group"
                        >
                            <div className="
                                bg-white/60 hover:bg-white backdrop-blur-md
                                border border-white/50 hover:border-teal-200
                                rounded-2xl p-6 transition-all duration-300
                                hover:shadow-lg hover:shadow-teal-900/5 hover:-translate-y-0.5
                                flex items-center gap-6 group-hover:scale-[1.005]
                            ">
                                {/* Icon Box */}
                                <div className="p-4 bg-white border border-slate-100 rounded-xl text-slate-400 group-hover:text-teal-600 group-hover:border-teal-100 transition-colors shadow-sm">
                                    {service.icon}
                                </div>

                                {/* Text Info */}
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-700 group-hover:text-teal-900 transition-colors tracking-tight">
                                        {service.name}
                                    </h3>
                                    <p className="text-sm text-slate-400 font-medium group-hover:text-slate-500 mt-0.5">
                                        {service.description}
                                    </p>
                                </div>

                                {/* Arrow Action */}
                                <div className="w-10 h-10 rounded-full bg-transparent group-hover:bg-teal-50 flex items-center justify-center transition-colors">
                                    <ArrowRight size={20} className="text-slate-300 group-hover:text-teal-600 transition-colors" strokeWidth={2} />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};
