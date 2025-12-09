
import React, { useState, useEffect } from 'react';
import { Search, Printer, Calendar, ChevronRight, FileText, Pill, Clock, AlertCircle } from 'lucide-react';
import { supabaseClient } from '../../infrastructure/db/client';

export const Recetas: React.FC = () => {
    const [recetas, setRecetas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [patientData, setPatientData] = useState<any>(null);
    const [selectedReceta, setSelectedReceta] = useState<any>(null);

    useEffect(() => {
        const fetchRecetas = async () => {
            try {
                const activeDni = localStorage.getItem('activePatientDni') || '12345678';
                const { data: pData } = await supabaseClient.from('patients').select('*').eq('dni', activeDni).single();

                if (pData) {
                    setPatientData(pData);

                    const { data, error } = await supabaseClient
                        .from('details')
                        .select(`
                            id, treatment, diagnosis, notes, created_at,
                            appointments!inner (
                                id, date_time, patient_id,
                                doctors ( firstname, lastname, specialties (name) )
                            )
                        `)
                        .eq('appointments.patient_id', pData.id)
                        .order('created_at', { ascending: false });

                    if (error) throw error;
                    if (data) {
                        setRecetas(data);
                        if (data.length > 0) setSelectedReceta(data[0]);
                    }
                }
            } catch (error) {
                console.error("Error fetching recipes", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecetas();
    }, []);

    const filteredRecetas = recetas.filter((r: any) => {
        const search = filter.toLowerCase();
        const doc = `${r.appointments?.doctors?.firstname} ${r.appointments?.doctors?.lastname}`.toLowerCase();
        // Handle optional treatment field safely
        const treat = r.treatment ? r.treatment.toLowerCase() : '';
        return doc.includes(search) || treat.includes(search);
    });

    const calculateEdad = (dob: string) => {
        if (!dob) return '--';
        const ageDifMs = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-6 animate-in fade-in duration-500">

            {/* LEFT SIDEBAR: LIST */}
            <div className="lg:w-1/3 glass-card rounded-2xl flex flex-col overflow-hidden h-full">
                {/* Header */}
                <div className="p-6 border-b border-slate-100/50 bg-white/40">
                    <h2 className="text-xl font-black text-teal-900 tracking-tight flex items-center gap-2">
                        <Pill className="text-teal-500" /> Recetas Médicas
                    </h2>
                    <p className="text-xs text-slate-500 font-medium mt-1 ml-8">Historial de prescripciones</p>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-slate-100/50 bg-white/20 backdrop-blur-sm">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-teal-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por doctor o medicamento..."
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 text-sm bg-white/50 border border-slate-200/60 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all placeholder:text-slate-400 font-medium text-slate-700"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-slate-50/30 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400 font-medium animate-pulse">Cargando recetas...</div>
                    ) : filteredRecetas.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 font-medium flex flex-col items-center gap-2">
                            <FileText size={32} opacity={0.5} />
                            No se encontraron recetas.
                        </div>
                    ) : (
                        filteredRecetas.map((receta) => (
                            <button
                                key={receta.id}
                                onClick={() => setSelectedReceta(receta)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group relative
                                    ${selectedReceta?.id === receta.id
                                        ? 'bg-white border-teal-500 shadow-md shadow-teal-500/10 ring-1 ring-teal-500/20 z-10'
                                        : 'bg-white/60 border-transparent hover:bg-white hover:border-teal-200 hover:shadow-sm'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${selectedReceta?.id === receta.id ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-500'}`}>
                                        {new Date(receta.created_at).toLocaleDateString()}
                                    </span>
                                    {selectedReceta?.id === receta.id && <ChevronRight size={16} className="text-teal-500" />}
                                </div>
                                <h3 className={`font-bold text-sm mb-1 ${selectedReceta?.id === receta.id ? 'text-teal-900' : 'text-slate-700'}`}>
                                    Dr. {receta.appointments?.doctors?.lastname}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-1 font-medium flex items-center gap-1">
                                    <AlertCircle size={10} />
                                    {receta.diagnosis || 'Consulta General'}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>


            {/* RIGHT MAIN PANEL: DOCUMENT PREVIEW */}
            <div className="lg:w-2/3 flex flex-col h-full glass-card rounded-2xl p-1 md:p-6 overflow-hidden relative bg-slate-100/50">
                {selectedReceta ? (
                    <div className="h-full overflow-y-auto pr-2 custom-scrollbar relative z-10">
                        <div className="bg-white text-slate-800 shadow-2xl shadow-slate-900/10 relative overflow-hidden flex flex-col min-h-[800px] w-full max-w-3xl mx-auto rounded-sm border border-slate-200" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>

                            {/* Medical Header */}
                            <div className="bg-gradient-to-r from-teal-500 to-teal-600 h-28 relative flex items-center justify-between px-8 shrink-0 overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                <div className="relative z-10 text-white">
                                    <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                                        CITAMEDIC <span className="text-teal-200 font-light">RX</span>
                                    </h1>
                                    <p className="text-xs font-medium text-teal-100 opacity-90 tracking-widest uppercase mt-1">Receta Médica Electrónica</p>
                                </div>

                                <div className="relative z-10 text-right text-white/90">
                                    <p className="font-bold text-sm">{selectedReceta.appointments?.doctors?.firstname} {selectedReceta.appointments?.doctors?.lastname}</p>
                                    <p className="text-xs opacity-80">{selectedReceta.appointments?.doctors?.specialties?.name || 'Medicina General'}</p>
                                    <p className="text-[10px] opacity-60 mt-1 uppercase tracking-widest">CMP: 00000</p>
                                </div>
                            </div>

                            {/* Patient Info Bar */}
                            <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 flex flex-wrap gap-x-8 gap-y-2 text-xs">
                                <div>
                                    <span className="text-slate-400 font-bold uppercase mr-2">Paciente:</span>
                                    <span className="font-bold text-slate-700 text-sm">{patientData?.first_name} {patientData?.last_name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold uppercase mr-2">DNI:</span>
                                    <span className="font-mono text-slate-600">{patientData?.dni}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 font-bold uppercase mr-2">Edad:</span>
                                    <span className="text-slate-600">{calculateEdad(patientData?.date_of_birth)} Años</span>
                                </div>
                                <div className="ml-auto">
                                    <span className="text-slate-400 font-bold uppercase mr-2">Fecha:</span>
                                    <span className="font-bold text-teal-700">{new Date(selectedReceta.created_at).toLocaleDateString()}</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-8 md:px-12 py-8 flex flex-col gap-8 relative bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]">

                                {/* Diagnosis Section */}
                                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl p-5 shadow-sm">
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <AlertCircle size={14} className="text-amber-500" /> Diagnóstico
                                    </h3>
                                    <p className="text-lg font-medium text-slate-800">{selectedReceta.diagnosis || 'No especificado'}</p>
                                </div>

                                {/* Rx Section */}
                                <div className="flex-1 bg-white border border-slate-100 rounded-xl p-6 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-5">
                                        <Pill size={120} />
                                    </div>
                                    <h3 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-6 border-b-2 border-teal-100 pb-2 inline-block">
                                        Indicaciones / Tratamiento
                                    </h3>

                                    <div className="space-y-6 text-slate-700 font-medium leading-relaxed font-mono text-sm md:text-base">
                                        {selectedReceta.treatment ? (
                                            selectedReceta.treatment.split('\n').map((line: string, i: number) => (
                                                <div key={i} className="pl-4 border-l-2 border-slate-100 hover:border-teal-300 transition-colors py-1">
                                                    {line}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 italic">Sin tratamiento detallado.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                {selectedReceta.notes && (
                                    <div className="text-xs text-slate-500 italic px-2">
                                        <span className="font-bold not-italic text-slate-400">Nota:</span> {selectedReceta.notes}
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="bg-slate-50 px-8 py-6 border-t border-slate-200 shrink-0">
                                <div className="flex justify-between items-end">
                                    {/* QR Placeholders */}
                                    <div className="w-16 h-16 bg-white border border-slate-200 rounded-lg flex items-center justify-center">
                                        <div className="bg-slate-800 w-10 h-10 opacity-10"></div>
                                    </div>

                                    <div className="text-center w-48">
                                        <div className="h-12 w-full border-b border-slate-400 mb-2 relative"></div>
                                        <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Firma del Médico</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400/60">
                        <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                            <FileText size={32} className="opacity-50 text-slate-400" />
                        </div>
                        <p className="font-medium text-slate-500">Selecciona una receta para ver el detalle</p>
                    </div>
                )}

                {selectedReceta && (
                    <div className="absolute top-8 right-8 z-30">
                        <button
                            onClick={() => window.print()}
                            className="bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-500/30 rounded-full p-3 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 font-bold text-sm px-5"
                        >
                            <Printer size={18} />
                            <span className="hidden md:inline">Imprimir</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
