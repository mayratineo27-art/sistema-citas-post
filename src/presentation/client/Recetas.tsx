import React, { useState, useEffect } from 'react';
import { Search, Printer, Calendar, ChevronRight, FileText, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { supabaseClient } from '../../infrastructure/db/client';

export const Recetas: React.FC = () => {
    const [recetas, setRecetas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
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
                        // Auto-select the first one
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
        const treat = r.treatment?.toLowerCase() || '';
        const matchesText = doc.includes(search) || treat.includes(search);

        let matchesDate = true;
        const rDate = new Date(r.created_at);
        if (startDate) {
            matchesDate = matchesDate && rDate >= new Date(startDate);
        }
        if (endDate) {
            // End of day
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchesDate = matchesDate && rDate <= end;
        }

        return matchesText && matchesDate;
    });

    // Helper to calculate age
    const calculateEdad = (dob: string) => {
        if (!dob) return '--';
        const ageDifMs = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(ageDifMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-100px)] gap-6 pb-6 animate-in fade-in duration-500 font-serif">

            {/* LEFT SIDEBAR: HISTORY & FILTERS */}
            <div className="lg:w-1/3 bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden h-full">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 font-sans mb-1">Historial Médico</h2>
                    <p className="text-xs text-slate-500 font-sans">Busca y filtra tus recetas antiguas.</p>
                </div>

                {/* Filters */}
                <div className="p-4 space-y-3 border-b border-slate-100 font-sans">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Buscar por doctor o medicamento..."
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none w-full"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Desde</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Hasta</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                                className="w-full text-sm border border-slate-200 rounded-lg px-2 py-1.5 focus:ring-2 focus:ring-primary/20 outline-none text-slate-600"
                            />
                        </div>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-slate-50/30">
                    {loading ? (
                        <div className="text-center py-10 text-slate-400 font-sans text-sm">Cargando...</div>
                    ) : filteredRecetas.length === 0 ? (
                        <div className="text-center py-10 text-slate-400 font-sans text-sm">No se encontraron recetas.</div>
                    ) : (
                        filteredRecetas.map((receta) => (
                            <button
                                key={receta.id}
                                onClick={() => setSelectedReceta(receta)}
                                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 group relative
                                    ${selectedReceta?.id === receta.id
                                        ? 'bg-white border-primary shadow-md ring-1 ring-primary/20'
                                        : 'bg-white border-slate-100 hover:border-primary/50 hover:shadow-sm'
                                    }
                                `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded-md">
                                        {new Date(receta.created_at).toLocaleDateString()}
                                    </span>
                                    {selectedReceta?.id === receta.id && <ChevronRight size={16} className="text-primary" />}
                                </div>
                                <h3 className={`font-bold text-sm mb-1 font-sans ${selectedReceta?.id === receta.id ? 'text-primary' : 'text-slate-800'}`}>
                                    Dr. {receta.appointments?.doctors?.lastname}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-1 font-sans">
                                    {receta.diagnosis || 'Consulta General'}
                                </p>
                            </button>
                        ))
                    )}
                </div>
            </div>


            {/* RIGHT MAIN PANEL: DOCUMENT PREVIEW */}
            <div className="lg:w-2/3 flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-100/50 p-2 md:p-6 overflow-hidden">
                {selectedReceta ? (
                    <div className="h-full overflow-y-auto pr-2 custom-scrollbar">
                        <div className="bg-white text-slate-800 shadow-xl relative overflow-hidden flex flex-col min-h-[900px] w-full max-w-3xl mx-auto" style={{ aspectRatio: '1/1.4' }}>

                            {/* Mint Green Header Band */}
                            <div className="bg-[#4FD1C5] h-32 relative flex items-center justify-between px-8 shrink-0">
                                <div className="bg-[#5EEAD4] w-24 h-32 absolute top-0 left-8 rounded-b-3xl shadow-lg flex items-center justify-center border-b-4 border-[#2C7A7B]/20">
                                    <div className="relative w-12 h-12">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3.5 h-full bg-white rounded-sm shadow-sm border border-slate-200"></div>
                                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-3.5 bg-white rounded-sm shadow-sm border border-slate-200"></div>
                                        <div className="absolute inset-0 border-2 border-slate-700 rounded-full opacity-10"></div>
                                    </div>
                                </div>

                                <div className="ml-32 flex-1 text-center md:text-left">
                                    <h1 className="text-3xl font-bold text-slate-800 tracking-widest uppercase" style={{ fontFamily: '"EB Garamond", serif' }}>CITAMEDIC</h1>
                                    <p className="text-sm tracking-[0.3em] text-slate-700 uppercase mt-1">www.citamedic.com</p>
                                </div>

                                <div className="hidden md:block text-right text-slate-800/80 text-xs tracking-wider border-l border-slate-800/10 pl-4">
                                    <p className="font-bold uppercase">{selectedReceta.appointments?.doctors?.firstname} {selectedReceta.appointments?.doctors?.lastname}</p>
                                    <p className="italic">Al servicio de Huamanga</p>
                                    <p>CMP: 00.000.000</p>
                                </div>
                            </div>

                            {/* Mint Stripes */}
                            <div className="mt-8 px-8 space-y-2 shrink-0">
                                <div className="h-2 bg-[#E6FFFA] w-1/3"></div>
                                <div className="h-2 bg-[#E6FFFA] w-1/4"></div>
                                <div className="h-2 bg-[#E6FFFA] w-1/6"></div>
                            </div>

                            {/* Patient Info */}
                            <div className="px-12 py-8 grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-medium border-b border-slate-100 mx-8 shrink-0">
                                <div className="border-b border-slate-200 pb-1 flex justify-between">
                                    <span className="text-slate-500 uppercase text-[10px] tracking-widest">Nombre del Paciente</span>
                                    <span className="font-bold">{patientData?.first_name} {patientData?.last_name}</span>
                                </div>
                                <div className="border-b border-slate-200 pb-1 flex justify-between">
                                    <span className="text-slate-500 uppercase text-[10px] tracking-widest">Dirección</span>
                                    <span>{patientData?.address || 'Huamanga, Ayacucho'}</span>
                                </div>
                                <div className="border-b border-slate-200 pb-1 flex justify-between">
                                    <span className="text-slate-500 uppercase text-[10px] tracking-widest">RUT (DNI)</span>
                                    <span className="font-mono">{patientData?.dni}</span>
                                </div>
                                <div className="border-b border-slate-200 pb-1 flex justify-between">
                                    <span className="text-slate-500 uppercase text-[10px] tracking-widest">Edad</span>
                                    <span>{calculateEdad(patientData?.date_of_birth)} Años</span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 px-12 py-6 flex flex-col gap-6 relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                                    <div className="relative w-64 h-64">
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-full bg-black rounded-sm"></div>
                                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-16 bg-black rounded-sm"></div>
                                    </div>
                                </div>

                                <div className="border-l-4 border-[#4FD1C5] pl-4 py-2 bg-[#F0FDFA]/50 rounded-r-lg">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Diagnóstico</span>
                                    <p className="text-lg text-slate-800 italic">{selectedReceta.diagnosis || 'Consulta General'}</p>
                                </div>

                                <div className="mt-4 flex-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-4 border-b border-[#4FD1C5] pb-2 w-24">Tratamiento</span>
                                    <div className="space-y-6">
                                        {selectedReceta.treatment ? (
                                            selectedReceta.treatment.split('\n').map((line: string, i: number) => (
                                                <div key={i} className="border-b border-slate-200 border-dotted pb-2 text-slate-800 text-lg leading-relaxed">
                                                    {line}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 italic">Sin prescripción detallada.</p>
                                        )}
                                        <div className="border-b border-slate-100 border-dotted h-8"></div>
                                        <div className="border-b border-slate-100 border-dotted h-8"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-12 pb-12 pt-4 shrink-0">
                                <div className="flex justify-between items-end">
                                    <div className="border border-slate-300 rounded-lg p-2 px-4">
                                        <span className="text-[10px] text-slate-400 uppercase block">Fecha</span>
                                        <span className="font-bold text-slate-700">{new Date(selectedReceta.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="text-center w-48">
                                        <div className="h-12 w-full border-b border-slate-800 mb-2 relative">
                                            <span className="absolute bottom-2 left-0 right-0 font-script text-2xl text-slate-800 opacity-60 transform -rotate-6" style={{ fontFamily: 'cursive' }}>
                                                Dr. {selectedReceta.appointments?.doctors?.lastname}
                                            </span>
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest text-slate-500">Firma</span>
                                    </div>
                                </div>
                                <div className="mt-8 bg-[#4FD1C5]/20 h-8 flex items-center justify-center text-[10px] text-teal-800 tracking-widest uppercase">
                                    Street 123, Huamanga • Phone: +51 000 000 000 • www.citamedic.com
                                </div>
                            </div>

                            {/* Print Button Overlay */}
                            <div className="absolute top-4 right-4 z-10">
                                <Button variant="outline" className="bg-white/80 backdrop-blur" onClick={() => window.print()}>
                                    <Printer size={16} />
                                </Button>
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400">
                        <FileText size={48} className="mb-4 opacity-50" />
                        <p className="font-sans">Selecciona una receta para ver el detalle.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
