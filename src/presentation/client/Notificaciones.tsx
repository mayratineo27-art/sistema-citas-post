
import React from 'react';
import { Card } from '../components/ui/Card';
import { Bell, Calendar, Info, Clock, CheckCircle, X } from 'lucide-react';

export const Notificaciones: React.FC = () => {
    const alerts = [
        { id: 1, type: 'reminder', title: 'Recordatorio de Cita', message: 'Tienes una cita mañana a las 10:00 AM con Medicina General.', date: 'Hace 2 horas', priority: 'high' },
        { id: 2, type: 'info', title: 'Campaña de Vacunación', message: 'La próxima semana inicia la campaña contra la Influenza.', date: 'Hace 1 día', priority: 'medium' },
        { id: 3, type: 'success', title: 'Resultados Disponibles', message: 'Tus análisis de laboratorio ya están listos para descarga.', date: 'Hace 3 días', priority: 'medium' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex items-center gap-4 pt-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
                    <Bell size={24} />
                </div>
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight">
                        Centro de <span className="font-bold text-indigo-900">Notificaciones</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Mantente al día con tus citas y anuncios importantes.</p>
                </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div key={alert.id} className="group relative bg-white/60 backdrop-blur-xl border border-white/60 p-6 rounded-[1.5rem] shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300">
                        {/* Interactive "Read" overlay */}
                        <div className="absolute right-4 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 text-slate-300 hover:text-indigo-500 hover:bg-indigo-50 rounded-full transition-colors">
                                <CheckCircle size={18} />
                            </button>
                        </div>

                        <div className="flex items-start gap-5">
                            {/* Icon */}
                            <div className={`
                                shrink-0 p-4 rounded-2xl flex items-center justify-center shadow-sm
                                ${alert.type === 'reminder' ? 'bg-amber-50 text-amber-600 border border-amber-100' : ''}
                                ${alert.type === 'info' ? 'bg-blue-50 text-blue-600 border border-blue-100' : ''}
                                ${alert.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : ''}
                            `}>
                                {alert.type === 'reminder' && <Calendar size={24} strokeWidth={1.5} />}
                                {alert.type === 'info' && <Info size={24} strokeWidth={1.5} />}
                                {alert.type === 'success' && <CheckCircle size={24} strokeWidth={1.5} />}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pt-1">
                                <div className="flex items-center gap-3 mb-1">
                                    <h4 className="font-bold text-slate-800 text-lg">{alert.title}</h4>
                                    {alert.priority === 'high' && (
                                        <span className="bg-rose-50 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border border-rose-100">
                                            Importante
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-600 leading-relaxed max-w-2xl">{alert.message}</p>

                                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <Clock size={12} /> {alert.date}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State Mockup (hidden if alerts exist) */}
            {alerts.length === 0 && (
                <div className="text-center py-20 opacity-50">
                    <Bell size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-400 font-medium">No tienes notificaciones nuevas</p>
                </div>
            )}
        </div>
    );
};

