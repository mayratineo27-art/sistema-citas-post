import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { supabaseClient } from '../../infrastructure/db/client';

export const Historial: React.FC = () => {
    const [completedAppointments, setCompletedAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            // Fetch appointments that are COMPLETED, CANCELLED or NO_SHOW
            const { data, error } = await supabaseClient
                .from('appointments')
                .select(`
                    id,
                    date_time,
                    status,
                    reason,
                    doctors (
                        firstName,
                        lastName,
                        specialties (name)
                    )
                `)
                .in('status', ['COMPLETED', 'CANCELLED', 'NO_SHOW'])
                .order('date_time', { ascending: false })
                .limit(10);

            if (data) setCompletedAppointments(data);
        } catch (error) {
            console.error("Error fetching history", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'COMPLETED': return { color: 'text-emerald-600 bg-emerald-100', icon: <CheckCircle2 size={16} />, label: 'Atendido' };
            case 'CANCELLED': return { color: 'text-red-500 bg-red-100', icon: <XCircle size={16} />, label: 'Cancelado' };
            case 'NO_SHOW': return { color: 'text-amber-600 bg-amber-100', icon: <AlertCircle size={16} />, label: 'No Asistió' };
            default: return { color: 'text-slate-500 bg-slate-100', icon: <Clock size={16} />, label: status };
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-xl text-purple-600">
                    <Clock size={28} />
                </div>
                Historial de Citas
            </h1>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Cargando historial...</div>
            ) : completedAppointments.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <Clock size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No tienes citas pasadas registradas.</p>
                </div>
            ) : (
                <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 py-4">
                    {completedAppointments.map((apt) => {
                        const status = getStatusConfig(apt.status);
                        const date = new Date(apt.date_time);
                        return (
                            <div key={apt.id} className="relative pl-8 group">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[9px] top-6 w-4 h-4 rounded-full border-4 border-white shadow-sm ${status.color.replace('text-', 'bg-').split(' ')[1]}`}></div>

                                <Card className="p-5 border-0 shadow-sm hover:shadow-md transition-all group-hover:scale-[1.01]">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-slate-800">
                                                {apt.doctors?.specialties?.name || "Consulta General"}
                                            </h3>
                                            <p className="text-sm text-slate-500 font-medium">
                                                Dr. {apt.doctors?.firstName} {apt.doctors?.lastName}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}>
                                            {status.icon} {status.label}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-400" />
                                            <span className="font-semibold">{date.toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            <span className="font-semibold">{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                    </div>

                                    {apt.reason && (
                                        <p className="mt-3 text-xs text-slate-400 italic">
                                            Motivo: "{apt.reason}"
                                        </p>
                                    )}
                                </Card>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
