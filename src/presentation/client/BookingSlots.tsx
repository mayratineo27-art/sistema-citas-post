import React, { useState } from 'react';
import { ChevronLeft, Calendar, Stethoscope, Activity, Heart, Cross } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const BookingSlots: React.FC = () => {
    const navigate = useNavigate();
    const { especialidad } = useParams();
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    // Mock Slots Data
    const morningSlots = ['08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM'];
    const afternoonSlots = ['02:00 PM', '02:30 PM', '03:00 PM', '04:00 PM'];

    const handleConfirm = () => {
        // Navigate to confirmation page with params
        const queryParams = new URLSearchParams({
            specialty: especialidad || '',
            date: new Date().toISOString().split('T')[0], // Dynamic Date (Today)
            time: selectedSlot || ''
        }).toString();

        navigate(`/cliente/reservar/confirmar?${queryParams}`);
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-right-8 duration-500 relative overflow-hidden">

            {/* Background Medical Symbols (Watermarks) */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.03]">
                <Stethoscope size={300} className="absolute -top-20 -right-20 text-slate-900" />
                <Activity size={200} className="absolute top-1/3 -left-20 text-slate-900" />
                <Heart size={150} className="absolute bottom-20 right-10 text-slate-900" />
                <Cross size={100} className="absolute top-20 left-1/4 text-slate-900 rotate-45" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-6 sticky top-0 z-20 pb-4 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent">
                <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-full transition-all shadow-sm hover:shadow-md border border-slate-200 text-slate-600 hover:text-teal-700">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 bg-white/90 backdrop-blur-md border border-teal-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-teal-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                    <h2 className="text-xl font-black text-slate-900 capitalize tracking-tight flex items-center gap-2 relative z-10">
                        {especialidad?.replace('-', ' ')}
                    </h2>
                    <p className="text-teal-600 text-xs font-bold uppercase tracking-wider relative z-10">Selecciona Horario</p>
                </div>
            </div>

            {/* Date Picker Mock */}
            <div className="relative z-10 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 flex items-center justify-between mx-1 mb-8 transform hover:scale-[1.01] transition-transform">
                <div className="flex items-center gap-5">
                    <div className="bg-teal-50 p-4 rounded-2xl text-teal-700 shadow-inner border border-teal-100">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <p className="font-black text-slate-900 text-xl tracking-tight capitalize">
                            Hoy, {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2.5 h-2.5 bg-teal-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wide">Turnos Disponibles</p>
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="hidden md:flex text-xs font-bold rounded-xl border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-200 transition-colors px-6 h-10">
                    Cambiar Fecha
                </Button>
            </div>

            {/* Slots Grid */}
            <div className="relative z-10 space-y-10 py-4 px-1 pb-32 flex-1 overflow-y-auto custom-scrollbar">
                <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 ml-1">
                        <span className="w-8 h-[3px] bg-teal-400 rounded-full"></span> Mañana
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {morningSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`
                                    py-4 px-2 rounded-2xl text-sm font-bold border-2 transition-all duration-300 relative overflow-hidden group
                                    ${selectedSlot === slot
                                        ? 'bg-teal-700 text-white border-transparent shadow-xl shadow-teal-900/20 scale-105 transform'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-teal-600 hover:text-teal-700 hover:shadow-lg hover:-translate-y-1'}
                                `}
                            >
                                <span className="relative z-10 font-black tracking-wide">{slot}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-3 ml-1">
                        <span className="w-8 h-[3px] bg-amber-400 rounded-full"></span> Tarde
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {afternoonSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`
                                    py-4 px-2 rounded-2xl text-sm font-bold border-2 transition-all duration-300 relative overflow-hidden group
                                    ${selectedSlot === slot
                                        ? 'bg-teal-700 text-white border-transparent shadow-xl shadow-teal-900/20 scale-105 transform'
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-teal-600 hover:text-teal-700 hover:shadow-lg hover:-translate-y-1'}
                                `}
                            >
                                <span className="relative z-10 font-black tracking-wide">{slot}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {/* Confirmation Footer - Floating Glass Light Theme */}
            <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-3xl md:mx-auto z-30">
                <div className="bg-white/90 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl shadow-teal-900/10 border border-teal-100 flex items-center justify-between gap-6 transition-all duration-500 transform translate-y-0">
                    <div className="pl-4">
                        <p className="text-[10px] text-teal-600 uppercase tracking-widest font-bold">Selección</p>
                        <p className="text-2xl font-black text-slate-800 tracking-tight">{selectedSlot || '--:--'}</p>
                    </div>
                    <Button
                        className={`
                            rounded-xl px-12 py-4 text-base font-bold tracking-wide transition-all shadow-xl h-14 flex items-center
                            ${!selectedSlot
                                ? 'bg-slate-300 text-slate-600 border border-slate-400 opacity-70 cursor-not-allowed'
                                : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-95'}
                        `}
                        disabled={!selectedSlot}
                        onClick={handleConfirm}
                    >
                        Confirmar
                    </Button>
                </div>
            </div>

            <div className="h-20 md:hidden"></div> {/* Spacer for fixed mobile footer */}
        </div>
    );
};
