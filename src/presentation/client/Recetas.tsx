import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Search, Download, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabaseClient } from '../../infrastructure/db/client';

export const Recetas: React.FC = () => {
    const [recetas, setRecetas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [patientName, setPatientName] = useState('');

    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                const id = await getPatientId();
                if (id) {
                    const { data: pData } = await supabaseClient.from('patients').select('first_name, last_name').eq('id', id).single();
                    if (pData) setPatientName(`${pData.first_name} ${pData.last_name}`);
                }

                // Fetch details linked to appointments for the hardcoded patient
                // We use !inner join to filter appointments by patient_id
                const { data, error } = await supabaseClient
                    .from('details')
                    .select(`
                        id,
                        treatment,
                        diagnosis,
                        notes,
                        created_at,
                        appointments!inner (
                            id,
                            date_time,
                            patient_id,
                            doctors (
                                firstname,
                                lastname,
                                specialties (name)
                            )
                        )
                    `)
                    // Filter where appointment belongs to our test patient
                    .eq('appointments.patient_id', (await getPatientId()))
                    .order('created_at', { ascending: false });

                if (error) throw error;
                if (data) setRecetas(data);

            } catch (error) {
                console.error("Error fetching recipes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecetas();
    }, []);

    // Helper to get patient ID (could be context)
    const getPatientId = async () => {
        const activeDni = localStorage.getItem('activePatientDni') || '12345678';
        const { data } = await supabaseClient.from('patients').select('id').eq('dni', activeDni).single();
        return data?.id;
    }

    const displayRecetas = recetas.filter((r: any) => {
        const search = filter.toLowerCase();
        // Check specialty
        const spec = r.appointments?.doctors?.specialties?.name?.toLowerCase() || '';
        // Check doctor
        const doc = `${r.appointments?.doctors?.firstname} ${r.appointments?.doctors?.lastname}`.toLowerCase();
        // Check meds
        const meds = r.treatment?.toLowerCase() || '';

        return spec.includes(search) || doc.includes(search) || meds.includes(search);
    });


    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl p-8 text-white shadow-xl shadow-emerald-200">
                <div className="flex items-center gap-4 mb-2">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                        <FileText size={32} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Mis Recetas</h1>
                        {patientName && (
                            <div className="text-emerald-100 text-sm font-bold flex items-center gap-1">
                                <User size={12} /> Paciente: {patientName}
                            </div>
                        )}
                    </div>
                </div>
                <p className="text-emerald-100 font-medium max-w-lg">
                    Accede a tu historial de medicamentos e indicaciones médicas.
                </p>

                {/* Search Bar Embedded in Header */}
                <div className="mt-8 relative max-w-xl group">
                    <Search className="absolute left-4 top-3.5 text-emerald-700/50 group-focus-within:text-emerald-600 transition-colors" size={20} />
                    <input
                        type="text"
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Buscar por medicamento, doctor o especialidad..."
                        className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none ring-4 ring-white/20 focus:ring-white/40 bg-white/95 text-emerald-900 font-medium placeholder:text-emerald-700/40 shadow-lg transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
            ) : displayRecetas.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <FileText size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700">Sin recetas registradas</h3>
                    <p className="text-slate-400">No se encontraron recetas médicas en tu historial.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {displayRecetas.map((receta: any) => {
                        const doctor = receta.appointments?.doctors;
                        const date = new Date(receta.created_at);

                        return (
                            <Card key={receta.id} className="p-0 overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group ring-1 ring-slate-100">
                                {/* Top Strip */}
                                <div className="h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 w-full" />

                                <div className="p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                                        <div className="flex gap-4 items-start">
                                            {/* Date Box */}
                                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex flex-col items-center min-w-[80px]">
                                                <span className="text-xs font-bold text-slate-400 uppercase">{date.toLocaleDateString(undefined, { month: 'short' })}</span>
                                                <span className="text-2xl font-black text-emerald-600">{date.getDate()}</span>
                                                <span className="text-xs font-medium text-slate-400">{date.getFullYear()}</span>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                        {doctor?.specialties?.name || "Medicina"}
                                                    </span>
                                                    {receta.diagnosis && (
                                                        <span className="text-slate-400 text-xs font-medium">• Diagnóstico: {receta.diagnosis}</span>
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                                                    Dr. {doctor?.firstname} {doctor?.lastname}
                                                </h3>
                                                <p className="text-slate-500 text-sm">Cita Médica General</p>
                                            </div>
                                        </div>

                                        <Button variant="outline" className="rounded-xl border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-all gap-2">
                                            <Download size={16} />
                                            <span className="hidden sm:inline">Descargar PDF</span>
                                        </Button>
                                    </div>

                                    {/* Content Checkered Background */}
                                    <div className="relative bg-teal-50/50 rounded-2xl p-6 border border-teal-100/50">
                                        {/* Paper holes decoration */}
                                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 flex flex-col gap-2">
                                            <div className="w-4 h-4 rounded-full bg-white border border-slate-100 shadow-inner"></div>
                                            <div className="w-4 h-4 rounded-full bg-white border border-slate-100 shadow-inner"></div>
                                            <div className="w-4 h-4 rounded-full bg-white border border-slate-100 shadow-inner"></div>
                                        </div>

                                        <h4 className="flex items-center gap-2 text-xs font-bold text-teal-800 uppercase tracking-wide mb-3 pl-2">
                                            <FileText size={14} /> Indicaciones Médicas
                                        </h4>
                                        <p className="text-slate-700 font-medium leading-relaxed whitespace-pre-wrap pl-2 font-mono text-sm">
                                            {receta.treatment}
                                        </p>

                                        {receta.notes && (
                                            <div className="mt-4 pt-4 border-t border-teal-200/30 pl-2">
                                                <p className="text-slate-500 text-sm italic">
                                                    <span className="font-bold not-italic text-teal-600 mr-1">Nota:</span>
                                                    {receta.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
