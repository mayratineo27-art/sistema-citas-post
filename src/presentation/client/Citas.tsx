import React, { useEffect, useState } from 'react';
import { supabaseClient } from '../../infrastructure/db/client';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { Calendar, Clock, User, XCircle, PlusCircle, MapPin } from 'lucide-react';
import { AppointmentStatus } from '../../domain/entities/Appointment';

// --- Definición de Interfaces ---
interface AppointmentView {
    id: string;
    date_time: string;
    status: AppointmentStatus;
    reason: string;
    doctorName?: string;
    specialty?: string;
}

// --- Datos de Ejemplo (Mock Data) para garantizar visualización ---
const MOCK_APPOINTMENTS: AppointmentView[] = [
    {
        id: '1',
        date_time: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Mañana
        status: AppointmentStatus.SCHEDULED,
        reason: 'Chequeo General Mensual',
        doctorName: 'Dr. Juan Pérez',
        specialty: 'Medicina General'
    },
    {
        id: '2',
        date_time: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(), // Hace 2 días
        status: AppointmentStatus.COMPLETED,
        reason: 'Dolor de garganta y fiebre',
        doctorName: 'Dra. Ana López',
        specialty: 'Otorrinolaringología'
    },
    {
        id: '3',
        date_time: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(), // En 5 días
        status: AppointmentStatus.SCHEDULED,
        reason: 'Revisión de Análisis de Sangre',
        doctorName: 'Dr. Carlos Ruiz',
        specialty: 'Cardiología'
    }
];

export const Citas: React.FC = () => {
    // Estado inicial con datos mock para que SIEMPRE se vea algo al inicio
    const [appointments, setAppointments] = useState<AppointmentView[]>(MOCK_APPOINTMENTS);
    const [loading, setLoading] = useState(false); // Empezamos false para mostrar mock inmediato
    const [error, setError] = useState<string | null>(null);

    // Efecto para cargar datos reales (comentado o híbrido para demo)
    // Efecto para cargar datos reales
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            // 1. Get Patient ID for current user (Mock DNI)
            const patientDni = '12345678';
            console.log("Fetching appointments for DNI:", patientDni);
            const { data: patientData, error: patientError } = await supabaseClient
                .from('patients')
                .select('id')
                .eq('dni', patientDni)
                .single();

            console.log("Patient lookup result:", { patientData, patientError });

            if (patientError) {
                // If patient doesn't exist yet (no bookings), just show empty or mocks
                console.warn("Patient not found for DNI:", patientDni);
                setAppointments([]);
                return;
            }

            // 2. Fetch Appointments for this patient
            const { data, error } = await supabaseClient
                .from('appointments')
                .select(`
                    id,
                    date_time,
                    status,
                    reason,
                    doctors (
                        firstname,
                        lastname,
                        specialties (name)
                    )
                `)
                .eq('patient_id', patientData.id)
                .order('date_time', { ascending: false });

            if (error) throw error;

            if (data && data.length > 0) {
                const mapped = data.map((item: any) => ({
                    id: item.id,
                    date_time: item.date_time,
                    status: item.status as AppointmentStatus,
                    reason: item.reason,
                    // Handle joined data safely
                    doctorName: item.doctors ? `Dr. ${item.doctors.firstname} ${item.doctors.lastname}` : 'Dr. Asignado',
                    specialty: item.doctors?.specialties?.name || 'Medicina General'
                }));
                setAppointments(mapped);
            } else {
                setAppointments([]); // Clear mocks if no real data found
            }
        } catch (err: any) {
            console.error("Error loading appointments:", err);
            // Show actual error for debugging
            setError(`Error cargando citas: ${err.message || 'Desconocido'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (id: string) => {
        if (window.confirm('¿Desea cancelar esta cita? (Simulación)')) {
            setAppointments(prev => prev.map(a =>
                a.id === id ? { ...a, status: AppointmentStatus.CANCELLED } : a
            ));
        }
    };

    // --- Helpers de Estilo ---
    const getStatusStyles = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED:
                return 'bg-green-100 text-green-700 border-green-200';
            case AppointmentStatus.COMPLETED:
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case AppointmentStatus.CANCELLED:
                return 'bg-red-100 text-red-700 border-red-200';
            default:
                return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusLabel = (status: AppointmentStatus) => {
        switch (status) {
            case AppointmentStatus.SCHEDULED: return 'PROGRAMADA';
            case AppointmentStatus.COMPLETED: return 'COMPLETADA';
            case AppointmentStatus.CANCELLED: return 'CANCELADA';
            default: return status;
        }
    };

    return (
        // Contenedor Principal con fondo blanco y padding garantizado
        <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 max-w-5xl mx-auto my-6">

            {/* Cabecera */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mis Citas Médicas</h1>
                    <p className="text-gray-500 mt-1">Consulta tu historial y próximas atenciones.</p>
                </div>
                <Button variant="primary" className="shadow-md" onClick={() => window.location.href = '/cliente/reservar'}>
                    <PlusCircle size={20} className="mr-2" />
                    Programar Nueva Cita
                </Button>
            </div>

            {/* Mensajes de Error */}
            {error && <Alert type="error" message={error} />}

            {/* Contenido: Lista o Empty State */}
            {loading ? (
                <div className="py-12 text-center text-gray-400 animate-pulse">
                    Cargando citas...
                </div>
            ) : (
                <div className="space-y-4">
                    {appointments.length > 0 ? (
                        appointments.map((appt) => (
                            // Tarjeta de Cita Individual
                            <div key={appt.id} className="flex flex-col md:flex-row gap-4 p-5 rounded-lg border border-gray-200 hover:shadow-md transition-all bg-gray-50/50">
                                {/* Icono / Fecha */}
                                <div className="hidden md:flex flex-col items-center justify-center p-4 bg-white rounded-lg border border-gray-100 shadow-sm w-24 shrink-0">
                                    <span className="text-xs text-gray-500 uppercase font-bold">
                                        {new Date(appt.date_time).toLocaleDateString(undefined, { month: 'short' })}
                                    </span>
                                    <span className="text-2xl font-bold text-sky-600">
                                        {new Date(appt.date_time).getDate()}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(appt.date_time).getFullYear()}
                                    </span>
                                </div>

                                {/* Detalles */}
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2 py-0.5 text-xs font-bold rounded-md border ${getStatusStyles(appt.status)}`}>
                                            {getStatusLabel(appt.status)}
                                        </span>
                                        <span className="text-sm text-gray-400 flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(appt.date_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-800">
                                        {appt.specialty || 'Consulta General'}
                                    </h3>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <User size={16} />
                                        <span>{appt.doctorName || 'Dr. Asignado'}</span>
                                    </div>

                                    <p className="text-sm text-gray-500 italic border-l-2 border-gray-300 pl-2">
                                        "{appt.reason}"
                                    </p>
                                </div>

                                {/* Acciones */}
                                <div className="flex items-center md:justify-end">
                                    {appt.status === AppointmentStatus.SCHEDULED && (
                                        <Button
                                            variant="danger"
                                            className="w-full md:w-auto text-sm"
                                            onClick={() => handleCancel(appt.id)}
                                        >
                                            <XCircle size={16} className="mr-2" />
                                            Cancelar
                                        </Button>
                                    )}
                                    {appt.status !== AppointmentStatus.SCHEDULED && (
                                        <Button variant="outline" className="w-full md:w-auto text-sm opacity-50 cursor-not-allowed">
                                            Ver Detalles
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        // Empty State Visible
                        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800">No hay citas disponibles</h3>
                            <p className="text-gray-500 mb-6">No tienes historial ni citas pendientes.</p>
                            <Button variant="primary" onClick={() => window.location.href = '/cliente/reservar'}>
                                Programar Ahora
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
