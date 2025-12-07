import React, { useState } from 'react';
import { ChevronLeft, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

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
            date: '2025-12-06', // Hardcoded for this demo, would be selected date
            time: selectedSlot || ''
        }).toString();

        navigate(`/cliente/reservar/confirmar?${queryParams}`);
    };

    return (
        <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-100px)] animate-in fade-in slide-in-from-right-8 duration-500">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pt-6 sticky top-0 z-20 pb-4 bg-gradient-to-b from-slate-50 to-transparent">
                <button onClick={() => navigate(-1)} className="p-3 hover:bg-white rounded-full transition-all shadow-sm hover:shadow-md border border-transparent hover:border-slate-200 text-slate-500 hover:text-sky-600">
                    <ChevronLeft size={24} />
                </button>
                <div className="flex-1 bg-white/80 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-sm">
                    <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight flex items-center gap-2">
                        {especialidad?.replace('-', ' ')}
                    </h2>
                    <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Selecciona Horario</p>
                </div>
            </div>

            {/* Date Picker Mock */}
            <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center justify-between mx-1">
                <div className="flex items-center gap-4">
                    <div className="bg-sky-50 p-3 rounded-2xl text-sky-600 shadow-inner">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800 text-lg">Hoy, 6 de Diciembre</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Turnos Disponibles</p>
                        </div>
                    </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs rounded-xl border-slate-200 hover:bg-slate-50 hover:border-sky-200 hover:text-sky-700 transition-colors">
                    Cambiar Fecha
                </Button>
            </div>

            {/* Slots Grid */}
            <div className="space-y-8 py-8 px-1 pb-32 flex-1 overflow-y-auto custom-scrollbar">
                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 ml-1">
                        <span className="w-8 h-[2px] bg-yellow-400 rounded-full"></span> Mañana
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {morningSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`
                                    py-4 px-2 rounded-2xl text-sm font-bold border transition-all duration-300 relative overflow-hidden group
                                    ${selectedSlot === slot
                                        ? 'bg-gradient-to-br from-sky-600 to-sky-500 text-white border-transparent shadow-lg shadow-sky-200 scale-105 ring-2 ring-offset-2 ring-sky-300'
                                        : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200 hover:shadow-md hover:-translate-y-1'}
                                `}
                            >
                                <span className="relative z-10">{slot}</span>
                                {selectedSlot === slot && (
                                    <div className="absolute inset-0 bg-white/20 blur-xl opacity-50"></div>
                                )}
                            </button>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-3 ml-1">
                        <span className="w-8 h-[2px] bg-orange-400 rounded-full"></span> Tarde
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {afternoonSlots.map((slot) => (
                            <button
                                key={slot}
                                onClick={() => setSelectedSlot(slot)}
                                className={`
                                    py-4 px-2 rounded-2xl text-sm font-bold border transition-all duration-300 relative overflow-hidden group
                                    ${selectedSlot === slot
                                        ? 'bg-gradient-to-br from-sky-600 to-sky-500 text-white border-transparent shadow-lg shadow-sky-200 scale-105 ring-2 ring-offset-2 ring-sky-300'
                                        : 'bg-white text-slate-600 border-slate-100 hover:border-sky-200 hover:shadow-md hover:-translate-y-1'}
                                `}
                            >
                                <span className="relative z-10">{slot}</span>
                            </button>
                        ))}
                    </div>
                </section>
            </div>

            {/* Confirmation Footer - Floating Glass */}
            <div className="fixed bottom-6 left-4 right-4 md:left-auto md:right-auto md:w-full md:max-w-3xl md:mx-auto z-30">
                <div className="bg-slate-900/90 backdrop-blur-xl p-4 rounded-[2rem] shadow-2xl border border-white/10 flex items-center justify-between gap-6 transition-all duration-500 transform translate-y-0 text-white">
                    <div className="pl-4">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Selección</p>
                        <p className="text-xl font-bold text-white tracking-tight">{selectedSlot || '--:--'}</p>
                    </div>
                    <Button
                        className={`
                            rounded-xl px-8 py-3 text-base font-bold tracking-wide transition-all shadow-lg
                            ${!selectedSlot
                                ? 'bg-slate-700 text-slate-500 cursor-not-allowed opacity-50'
                                : 'bg-white text-slate-900 hover:bg-sky-50 animate-pulse hover:animate-none hover:scale-105 shadow-sky-900/50'}
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
