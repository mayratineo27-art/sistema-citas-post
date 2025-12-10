import React from 'react';
import { X, Calendar, Clock, MapPin, User, FileText, Activity, AlertCircle, Pill } from 'lucide-react';
import { AppointmentStatus } from '../../domain/entities/Appointment';

interface AppointmentDetailProps {
    isOpen: boolean;
    onClose: () => void;
    appointment: any; // Using any for flexibility with joined data, ideally define a strict interface
}

export const AppointmentDetailModal: React.FC<AppointmentDetailProps> = ({ isOpen, onClose, appointment }) => {
    if (!isOpen || !appointment) return null;

    const daDate = new Date(appointment.date_time);

    // Helper for Status Badge
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'COMPLETED': return { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', label: 'Atendido' };
            case 'CANCELLED': return { color: 'bg-pink-100 text-pink-700 border-pink-200', label: 'Cancelado' };
            case 'NO_SHOW': return { color: 'bg-amber-100 text-amber-700 border-amber-200', label: 'No Asistió' };
            case 'CONFIRMED': return { color: 'bg-blue-100 text-blue-700 border-blue-200', label: 'Confirmado' };
            default: return { color: 'bg-slate-100 text-slate-600 border-slate-200', label: 'Pendiente' };
        }
    };

    const statusConfig = getStatusConfig(appointment.status);

    // Extract details if they exist (array due to join)
    // Support both 'details' (legacy) and 'medical_history' (new)
    const medicalData = appointment.medical_history || appointment.details;
    const details = medicalData && medicalData[0];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Detalles de la Cita</h2>
                        <p className="text-xs text-slate-500 font-medium">ID: {appointment.id?.slice(0, 8)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-600"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">

                    {/* Status Banner */}
                    <div className={`flex items-center justify-between p-4 rounded-2xl border ${statusConfig.color}`}>
                        <span className="font-bold text-sm tracking-wide uppercase flex items-center gap-2">
                            <Activity size={16} /> Estado actual
                        </span>
                        <span className="font-black text-sm uppercase">{statusConfig.label}</span>
                    </div>

                    {/* Time & Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                <Calendar size={16} />
                                <span className="text-xs font-bold uppercase">Fecha</span>
                            </div>
                            <p className="font-bold text-slate-800">
                                {daDate.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <div className="flex items-center gap-2 text-slate-400 mb-2">
                                <Clock size={16} />
                                <span className="text-xs font-bold uppercase">Hora</span>
                            </div>
                            <p className="font-bold text-slate-800">
                                {daDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>

                    {/* Doctor Info */}
                    <div className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-white shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl shrink-0">
                            {appointment.doctors?.firstname?.[0]}
                        </div>
                        <div>
                            <p className="text-xs text-slate-400 font-bold uppercase mb-1">Profesional Médico</p>
                            <h3 className="font-bold text-slate-800 text-lg">Dr. {appointment.doctors?.firstname} {appointment.doctors?.lastname}</h3>
                            <p className="text-sm text-teal-600 font-medium">{appointment.doctors?.specialties?.name}</p>
                        </div>
                    </div>

                    {/* Reason */}
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                            <FileText size={16} className="text-slate-400" /> Motivo de Consulta
                        </h4>
                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-600 text-sm border border-slate-100">
                            {appointment.reason || "Sin especificar"}
                        </div>
                    </div>

                    {/* Medical Details (Diagnosis/Treatment) - Only if completed/details exist */}
                    {details && (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2">
                            <div className="h-px bg-slate-100"></div>

                            <div>
                                <h4 className="flex items-center gap-2 text-sm font-bold text-teal-800 mb-2">
                                    <AlertCircle size={16} className="text-teal-500" /> Diagnóstico Médico
                                </h4>
                                <div className="p-4 bg-teal-50/50 rounded-2xl text-teal-900 text-sm border border-teal-100 font-medium">
                                    {details.diagnosis}
                                </div>
                            </div>

                            {details.treatment && (
                                <div>
                                    <h4 className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-2">
                                        <Pill size={16} className="text-slate-400" /> Tratamiento Indicado
                                    </h4>
                                    <div className="p-4 bg-white rounded-2xl text-slate-600 text-sm border border-slate-200 shadow-sm font-mono whitespace-pre-wrap">
                                        {details.treatment}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
