import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../../infrastructure/db/client';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Calendar, Clock, User, XCircle, PlusCircle, MapPin, Activity, ChevronRight, Filter } from 'lucide-react';
import { AppointmentStatus } from '../../domain/entities/Appointment';
import { Link } from 'react-router-dom';

// --- Interfaces ---
interface AppointmentView {
    id: string;
    date_time: string;
    status: AppointmentStatus;
    reason: string;
    doctorName?: string;
    specialty?: string;
}

export const Citas: React.FC = () => {
    // State
    const [appointments, setAppointments] = useState<AppointmentView[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

    // Fetch Logic
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const patientDni = localStorage.getItem('activePatientDni') || '12345678';
            console.log("Fetching appointments for DNI:", patientDni);

            // 1. Get Patient ID
            const { data: patientData, error: patientError } = await supabaseClient
                .from('patients')
                .select('id')
                .eq('dni', patientDni)
                .single();

            if (patientError) throw new Error("Paciente no encontrado. Por favor reinicie sesión.");

            // 2. Fetch Appointments
            const { data, error } = await supabaseClient
                .from('appointments')
                .select(`
                    id, date_time, status, reason,
                    doctors ( firstname, lastname, specialties (name) )
                `)
                .eq('patient_id', patientData.id)
                .order('date_time', { ascending: false });

            if (error) throw error;

            if (data) {
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    date_time: item.date_time,
                    status: item.status as AppointmentStatus,
                    reason: item.reason,
                    doctorName: item.doctors ? `Dr. ${item.doctors.firstname} ${item.doctors.lastname}` : 'Por asignar',
                    specialty: item.doctors?.specialties?.name || 'Consulta General'
                }));
                setAppointments(mapped);
            }
        } catch (err: any) {
            console.error("Error loading appointments:", err);
            setError(err.message || 'No se pudo cargar el historial.');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id: string) => {
        if (!window.confirm('¿Está seguro de cancelar esta cita? Esta acción no se puede deshacer.')) return;

        try {
            const { error } = await supabaseClient
                .from('appointments')
                .update({ status: AppointmentStatus.CANCELLED })
                .eq('id', id);

            if (error) throw error;

            // Optimistic Update
            setAppointments(prev => prev.map(a =>
                a.id === id ? { ...a, status: AppointmentStatus.CANCELLED } : a
            ));
            alert("Cita cancelada correctamente.");
        } catch (err) {
            alert("Error al cancelar la cita.");
        }
    };

    // --- Helpers ---
    const getStatusStyles = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
            case AppointmentStatus.CONFIRMED: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case AppointmentStatus.COMPLETED: return 'bg-blue-100 text-blue-700 border-blue-200';
            case AppointmentStatus.CANCELLED: return 'bg-pink-100 text-pink-700 border-pink-200';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const upcomingAppointments = appointments.filter(a => new Date(a.date_time) > new Date() && a.status !== AppointmentStatus.CANCELLED);
    const historyAppointments = appointments.filter(a => new Date(a.date_time) <= new Date() || a.status === AppointmentStatus.CANCELLED);
    const displayedAppointments = activeTab === 'upcoming' ? upcomingAppointments : historyAppointments;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* 1. Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mis Visitas</h1>
                    <p className="text-slate-500 font-medium">Gestiona tus citas programadas y revisa tu historial.</p>
                </div>
                <Link to="/cliente/reservar" className="group">
                    <Button variant="primary" className="h-12 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/20 transition-all hover:scale-105 flex items-center gap-2">
                        <PlusCircle size={20} />
                        <span className="font-bold">Nueva Cita</span>
                    </Button>
                </Link>
            </div>

            {/* 2. Tabs & Filters */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/40 p-1.5 rounded-2xl flex w-fit shadow-sm">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'upcoming' ? 'bg-white text-teal-700 shadow-md shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                >
                    Próximas ({upcomingAppointments.length})
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-slate-700 shadow-md shadow-slate-200/50' : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'}`}
                >
                    Historial Completo
                </button>
            </div>

            {/* 3. Content Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-48 bg-white/50 rounded-3xl animate-pulse"></div>
                    ))}
                </div>
            ) : error ? (
                <Alert type="error" message={error} />
            ) : displayedAppointments.length === 0 ? (
                <div className="text-center py-20 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 border-dashed border-slate-300">
                    <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6 text-teal-200">
                        <Calendar size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No tienes citas en esta sección</h3>
                    <p className="text-slate-400 max-w-xs mx-auto mb-8">
                        {activeTab === 'upcoming'
                            ? "¡Estás al día! No tienes visitas médicas programadas próximamente."
                            : "Aún no tienes un historial de citas registrado."}
                    </p>
                    {activeTab === 'upcoming' && (
                        <Link to="/cliente/reservar">
                            <Button variant="outline" className="border-teal-200 text-teal-700 hover:bg-teal-50">
                                Programar una ahora
                            </Button>
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {displayedAppointments.map((appt) => (
                        <div key={appt.id} className="group relative bg-white/70 backdrop-blur-xl border border-white/60 hover:border-teal-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300">

                            {/* Status Badge */}
                            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase items-center gap-1.5 flex ${getStatusStyles(appt.status)}`}>
                                <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                                {appt.status}
                            </div>

                            <div className="flex items-start gap-6">
                                {/* Date Card */}
                                <div className="shrink-0 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 shadow-sm w-20 h-24 overflow-hidden group-hover:scale-105 transition-transform">
                                    <div className="bg-teal-600 w-full h-2"></div>
                                    <div className="flex-1 flex flex-col items-center justify-center">
                                        <span className="text-xs font-bold text-slate-400 uppercase">{new Date(appt.date_time).toLocaleDateString(undefined, { month: 'short' }).slice(0, 3)}</span>
                                        <span className="text-2xl font-black text-slate-800 leading-none">{new Date(appt.date_time).getDate()}</span>
                                        <span className="text-[10px] font-bold text-slate-300">{new Date(appt.date_time).getFullYear()}</span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1 min-w-0">
                                    <h3 className="text-lg font-bold text-slate-800 truncate mb-1 group-hover:text-teal-700 transition-colors">
                                        {appt.specialty}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                                        <User size={14} />
                                        <span className="truncate">{appt.doctorName}</span>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                        <div className="flex items-center gap-1.5 bg-slate-100 px-2 py-1 rounded-lg">
                                            <Clock size={12} />
                                            {new Date(appt.date_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={12} />
                                            Sede Central
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100/50 flex justify-between items-center">
                                <p className="text-xs text-slate-400 italic truncate max-w-[60%]">
                                    "{appt.reason}"
                                </p>

                                <div className="flex gap-2">
                                    {(appt.status === AppointmentStatus.PENDING || appt.status === AppointmentStatus.CONFIRMED) && (
                                        <button
                                            onClick={() => handleCancel(appt.id)}
                                            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                    <button className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-teal-600 transition-colors shadow-lg shadow-slate-900/10 hover:shadow-teal-500/20 flex items-center gap-2">
                                        Detalles <ChevronRight size={14} />
                                    </button>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
