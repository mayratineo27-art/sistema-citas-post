
import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, XCircle, AlertCircle, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { supabaseClient } from '../../infrastructure/db/client';

export const Historial: React.FC = () => {
    const [history, setHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            // Fetch appointments + details
            // We want everything that IS completed/cancelled
            const dni = localStorage.getItem('activePatientDni') || '12345678';
            const { data: patient } = await supabaseClient.from('patients').select('id').eq('dni', dni).single();

            if (!patient) return;

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
                    ),
                    medical_history (
                        diagnosis,
                        treatment,
                        notes
                    )
                `)
                .eq('patient_id', patient.id)
                .in('status', ['COMPLETED', 'CANCELLED', 'NO_SHOW'])
                .order('date_time', { ascending: false });

            if (data) setHistory(data);
        } catch (error) {
            console.error("Error fetching history", error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'COMPLETED': return { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', icon: <CheckCircle2 size={16} />, label: 'Atendido' };
            case 'CANCELLED': return { color: 'text-red-500 bg-red-50 border-red-100', icon: <XCircle size={16} />, label: 'Cancelado' };
            case 'NO_SHOW': return { color: 'text-amber-600 bg-amber-50 border-amber-100', icon: <AlertCircle size={16} />, label: 'No Asistió' };
            default: return { color: 'text-slate-500 bg-slate-50 border-slate-100', icon: <Clock size={16} />, label: status };
        }
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
                {/* Decorative Circles */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute right-20 bottom-0 w-24 h-24 bg-purple-500/30 rounded-full blur-xl"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <Clock size={32} className="text-white" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight">Historial Clínico</h1>
                    </div>
                    <p className="text-indigo-100 font-medium max-w-lg">
                        Consulta el registro detallado de tus atenciones pasadas y diagnósticos.
                    </p>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            ) : history.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <Activity size={48} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">Historial Vacío</h3>
                    <p className="text-slate-400">Aún no tienes atenciones médicas registradas.</p>
                </div>
            ) : (
                <div className="relative">
                    {/* Continuous Line */}
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-indigo-200 via-purple-200 to-transparent"></div>

                    <div className="space-y-8">
                        {history.map((apt, index) => {
                            const config = getStatusConfig(apt.status);
                            const date = new Date(apt.date_time);
                            const isExpanded = expandedId === apt.id;
                            const hasDetails = apt.details && apt.details.length > 0;

                            return (
                                <div key={apt.id} className="relative pl-16 group">
                                    {/* Timeline Node */}
                                    <div className={`absolute left-[13px] top-6 w-5 h-5 rounded-full border-4 border-white shadow-md z-10 transition-colors duration-300 ${isExpanded ? 'bg-purple-600 scale-125' : 'bg-indigo-300'}`}></div>

                                    <Card
                                        onClick={() => hasDetails && toggleExpand(apt.id)}
                                        className={`transition-all duration-300 border-0 shadow-sm hover:shadow-lg overflow-hidden cursor-pointer ${isExpanded ? 'ring-2 ring-purple-100 shadow-purple-100' : 'hover:-translate-y-1'}`}
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
                                                <div>
                                                    <div className="flex items-center gap-2 text-sm text-slate-400 font-bold uppercase mb-1">
                                                        <Calendar size={14} />
                                                        {date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                                        {apt.doctors?.specialties?.name || "Consulta General"}
                                                    </h3>
                                                    <p className="text-slate-500 font-medium">
                                                        Dr. {apt.doctors?.firstname} {apt.doctors?.lastname}
                                                    </p>
                                                </div>

                                                <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2 border ${config.color}`}>
                                                    {config.icon} {config.label}
                                                </span>
                                            </div>

                                            {/* Reason Preview */}
                                            {apt.reason && (
                                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100/50 inline-block">
                                                    <p className="text-xs text-slate-500 font-medium">Motivo: "{apt.reason}"</p>
                                                </div>
                                            )}

                                            {/* Expandable Details Section */}
                                            {hasDetails && (
                                                <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-6' : 'grid-rows-[0fr] opacity-0'}`}>
                                                    <div className="overflow-hidden">
                                                        <div className="bg-purple-50/50 rounded-2xl p-5 border border-purple-100">
                                                            <div className="flex items-start gap-3">
                                                                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 mt-1">
                                                                    <Activity size={18} />
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-sm font-bold text-purple-900 mb-1">Diagnóstico Médico</h4>
                                                                    <p className="text-slate-700 font-medium">{apt.details[0].diagnosis}</p>

                                                                    {apt.details[0].treatment && (
                                                                        <div className="mt-3 pt-3 border-t border-purple-200/50">
                                                                            <h4 className="text-xs font-bold text-purple-700 uppercase mb-1">Tratamiento Indicado</h4>
                                                                            <p className="text-slate-600 text-sm whitespace-pre-wrap">{apt.details[0].treatment}</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Expand Toggle Button */}
                                        {hasDetails && (
                                            <div className="bg-slate-50 p-2 flex justify-center border-t border-slate-100 group-hover:bg-purple-50/30 transition-colors">
                                                {isExpanded ? <ChevronUp size={20} className="text-purple-400" /> : <ChevronDown size={20} className="text-slate-300" />}
                                            </div>
                                        )}
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
