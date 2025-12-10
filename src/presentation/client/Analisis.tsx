import React, { useState, useEffect } from 'react';
import { supabaseClient } from '../../infrastructure/db/client';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import { FileText, Download, Calendar, Clock, CheckCircle, AlertCircle, Microscope, Droplet, Activity, ChevronRight } from 'lucide-react';

// --- Interfaces ---
interface LabTest {
    id: string;
    test_name: string;
    test_date: string;
    status: 'PENDING' | 'READY' | 'EXPIRED';
    result_url?: string;
    notes?: string;
    doctor_name: string;
}

// --- Icons ---
const TicketIcon = ({ size = 20, className = "" }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
        <path d="M13 5v2" />
        <path d="M13 17v2" />
        <path d="M13 11v2" />
    </svg>
);

export const Analisis: React.FC = () => {
    const [labTests, setLabTests] = useState<LabTest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeFilter, setActiveFilter] = useState<'all' | 'ready' | 'pending'>('all');

    // --- Ticket State ---
    const [viewMode, setViewMode] = useState<'results' | 'ticket'>('results');
    const [selectedSpecialty, setSelectedSpecialty] = useState('');
    const [selectedExam, setSelectedExam] = useState('');
    const [ticketDate, setTicketDate] = useState('');
    const [generatedTicket, setGeneratedTicket] = useState<any>(null);

    // Mock constants for ticket system
    const DAILY_LIMIT = 30;
    const specialties = ['Medicina General', 'Pediatría', 'Ginecología', 'Cardiología', 'Endocrinología', 'Dermatología'];
    const examTypes = ['Hemograma Completo', 'Examen de Orina', 'Perfil Lipídico', 'Glucosa en Ayunas', 'Perfil Hepático', 'Cultivo'];

    useEffect(() => {
        fetchLabTests();
    }, []);

    const fetchLabTests = async () => {
        try {
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';

            const { data: patientData, error: patientError } = await supabaseClient
                .from('patients')
                .select('id')
                .eq('dni', activeDni)
                .single();

            if (patientError || !patientData) {
                // Mock data for demo
                setLabTests(getMockData());
                setLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabaseClient
                .from('lab_orders')
                .select(`
                    id,
                    test_name,
                    test_date,
                    status,
                    result_url,
                    notes,
                    doctor:doctors (firstname, lastname)
                `)
                .eq('patient_id', patientData.id)
                .order('test_date', { ascending: false });

            if (fetchError) throw fetchError;

            if (data && data.length > 0) {
                const formatted = data.map((item: any) => ({
                    id: item.id,
                    test_name: item.test_name,
                    test_date: item.test_date,
                    status: item.status,
                    result_url: item.result_url,
                    notes: item.notes,
                    doctor_name: item.doctor ? `Dr. ${item.doctor.firstname} ${item.doctor.lastname}` : 'No asignado'
                }));
                setLabTests(formatted);
            } else {
                setLabTests(getMockData());
            }
        } catch (err: any) {
            console.warn('Error fetching lab tests (using mock data):', err);
            // Don't block the UI with an error, fallback to mock data
            setError(null);
            setLabTests(getMockData());
        } finally {
            setLoading(false);
        }
    };

    const getMockData = (): LabTest[] => [
        {
            id: '1',
            test_name: 'Hemograma Completo',
            test_date: '2025-12-05',
            status: 'READY',
            doctor_name: 'Dr. Juan Pérez',
            notes: 'Valores dentro de rangos normales'
        },
        {
            id: '2',
            test_name: 'Perfil Lipídico',
            test_date: '2025-12-01',
            status: 'READY',
            doctor_name: 'Dr. Ana Gómez',
            notes: 'Colesterol ligeramente elevado'
        },
        {
            id: '3',
            test_name: 'Glucosa en Ayunas',
            test_date: '2025-12-10',
            status: 'PENDING',
            doctor_name: 'Dr. Carlos Ruiz'
        }
    ];

    const filteredTests = labTests.filter(test => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'ready') return test.status === 'READY';
        if (activeFilter === 'pending') return test.status === 'PENDING';
        return true;
    });

    const getStatusIcon = (status: LabTest['status']) => {
        switch (status) {
            case 'READY':
                return <CheckCircle size={20} className="text-emerald-500" />;
            case 'PENDING':
                return <Clock size={20} className="text-amber-500" />;
            case 'EXPIRED':
                return <AlertCircle size={20} className="text-red-500" />;
        }
    };

    const getStatusBadge = (status: LabTest['status']) => {
        switch (status) {
            case 'READY':
                return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'PENDING':
                return 'bg-amber-50 text-amber-700 border-amber-200';
            case 'EXPIRED':
                return 'bg-red-50 text-red-700 border-red-200';
        }
    };

    const getStatusText = (status: LabTest['status']) => {
        switch (status) {
            case 'READY':
                return 'Disponible';
            case 'PENDING':
                return 'Pendiente';
            case 'EXPIRED':
                return 'Vencido';
        }
    };

    const getTestIcon = (testName: string) => {
        if (testName.toLowerCase().includes('sangre') || testName.toLowerCase().includes('hemograma')) {
            return <Droplet size={24} className="text-red-400" />;
        }
        if (testName.toLowerCase().includes('glucosa') || testName.toLowerCase().includes('lipídico')) {
            return <Activity size={24} className="text-teal-400" />;
        }
        return <Microscope size={24} className="text-blue-400" />;
    };

    const handleGenerateTicket = (e: React.FormEvent) => {
        e.preventDefault();

        // Mock Ticket Generation
        const newTicket = {
            id: `LAB-${Math.floor(Math.random() * 10000)}`,
            specialty: selectedSpecialty,
            exam: selectedExam,
            date: ticketDate,
            time: '07:00 AM'
        };

        setGeneratedTicket(newTicket);

        // Add to list (optimistic update)
        const newLabTest: LabTest = {
            id: newTicket.id,
            test_name: selectedExam,
            test_date: ticketDate,
            status: 'PENDING',
            doctor_name: `Orden: ${selectedSpecialty}`,
            notes: 'Ticket generado exitosamente. Asistir temprano.'
        };

        setLabTests([newLabTest, ...labTests]);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Microscope size={32} className="text-white" />
                    </div>
                    <p className="text-slate-600 font-medium">Cargando resultados...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <Alert variant="error">{error}</Alert>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* 1. Header Section with Tabs */}
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">
                        Análisis de Laboratorio
                    </h1>
                    <p className="text-slate-600">Gestión de exámenes médicos y resultados</p>
                </div>

                <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-2xl flex w-fit border border-white/60 shadow-sm">
                    <button
                        onClick={() => setViewMode('results')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${viewMode === 'results' ? 'bg-white shadow text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Mis Resultados
                    </button>
                    <button
                        onClick={() => setViewMode('ticket')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'ticket' ? 'bg-white shadow text-teal-700' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <TicketIcon />
                        Sacar Ticket
                    </button>
                </div>
            </div>

            {viewMode === 'results' ? (
                // --- VIEW MODE: RESULTS ---
                <>
                    {/* Stats Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-card rounded-[2rem] p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                                    <CheckCircle size={28} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900">
                                        {labTests.filter(t => t.status === 'READY').length}
                                    </p>
                                    <p className="text-sm text-slate-600 font-medium">Disponibles</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-[2rem] p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center">
                                    <Clock size={28} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900">
                                        {labTests.filter(t => t.status === 'PENDING').length}
                                    </p>
                                    <p className="text-sm text-slate-600 font-medium">Pendientes</p>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card rounded-[2rem] p-6 border border-white/60 shadow-lg hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-600 rounded-2xl flex items-center justify-center">
                                    <Microscope size={28} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-3xl font-black text-slate-900">{labTests.length}</p>
                                    <p className="text-sm text-slate-600 font-medium">Total Exámenes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-3 flex-wrap">
                        {[
                            { key: 'all', label: 'Todos', count: labTests.length },
                            { key: 'ready', label: 'Disponibles', count: labTests.filter(t => t.status === 'READY').length },
                            { key: 'pending', label: 'Pendientes', count: labTests.filter(t => t.status === 'PENDING').length }
                        ].map(filter => (
                            <button
                                key={filter.key}
                                onClick={() => setActiveFilter(filter.key as any)}
                                className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all duration-300 ${activeFilter === filter.key
                                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                                    : 'bg-white/80 text-slate-700 hover:bg-white border border-slate-200'
                                    }`}
                            >
                                {filter.label} ({filter.count})
                            </button>
                        ))}
                    </div>

                    {/* Results Timeline */}
                    <div className="space-y-4">
                        {filteredTests.length === 0 ? (
                            <div className="glass-card rounded-[2.5rem] p-16 text-center border border-white/60">
                                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <FileText size={40} className="text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    No hay resultados
                                </h3>
                                <p className="text-slate-600">
                                    {activeFilter === 'all'
                                        ? 'Aún no tienes análisis de laboratorio registrados.'
                                        : `No tienes análisis ${activeFilter === 'ready' ? 'disponibles' : 'pendientes'}.`}
                                </p>
                            </div>
                        ) : (
                            filteredTests.map((test, index) => (
                                <div
                                    key={test.id}
                                    className="glass-card rounded-[2rem] p-6 border border-white/60 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-4"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                                        {/* Icon */}
                                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                                            {getTestIcon(test.test_name)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                                <h3 className="text-lg font-black text-slate-900">
                                                    {test.test_name}
                                                </h3>
                                                <div className={`px-4 py-1.5 rounded-full border text-xs font-bold inline-flex items-center gap-2 w-fit ${getStatusBadge(test.status)}`}>
                                                    {getStatusIcon(test.status)}
                                                    {getStatusText(test.status)}
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={16} className="text-teal-500" />
                                                    {new Date(test.test_date).toLocaleDateString('es-PE', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <FileText size={16} className="text-blue-500" />
                                                    {test.doctor_name}
                                                </div>
                                            </div>

                                            {test.notes && (
                                                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-3 border border-slate-100">
                                                    <strong className="text-slate-900">Notas:</strong> {test.notes}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action */}
                                        {test.status === 'READY' && (
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    // Generate Mock PDF
                                                    const content = `
                                                        RESULTADOS DE LABORATORIO - CITAMEDIC
                                                        =====================================
                                                        Paciente: ${localStorage.getItem('activePatientDni') || '12345678'}
                                                        Examen: ${test.test_name}
                                                        Fecha: ${test.test_date}
                                                        Doctor: ${test.doctor_name}
                                                        -------------------------------------
                                                        Estado: COMPLETADO
                                                        
                                                        Valores:
                                                        - Parametro 1: Normal
                                                        - Parametro 2: Normal
                                                        
                                                        Nota: Este es un documento simulado para demostración.
                                                    `;
                                                    const blob = new Blob([content], { type: 'text/plain' });
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `Resultado_${test.test_name.replace(/\s/g, '_')}.txt`; // Using .txt for simplicity without heavy libs
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    window.URL.revokeObjectURL(url);
                                                    document.body.removeChild(a);
                                                }}
                                                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/30"
                                            >
                                                <Download size={18} className="mr-2" />
                                                Descargar
                                                <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        )}
                                        {test.status === 'PENDING' && (
                                            <div className="text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-xl text-center">
                                                Acercarse 7:00 AM <br /> con Ticket
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </>
            ) : (
                // --- VIEW MODE: TICKET ---
                <div className="max-w-4xl mx-auto">
                    {!generatedTicket ? (
                        <div className="glass-card rounded-[2.5rem] p-8 md:p-12 border border-white/60 shadow-xl animate-in slide-in-from-right-8 duration-500">
                            <div className="text-center mb-10">
                                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <TicketIcon size={40} className="text-teal-600" />
                                </div>
                                <h2 className="text-3xl font-black text-slate-900 mb-3">Solicitar Análisis</h2>
                                <p className="text-slate-600 max-w-md mx-auto">
                                    Genera un ticket de atención para tus exámenes de laboratorio.
                                    <br /> <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-lg mt-2 inline-block">Atención diaria: 30 cupos</span>
                                </p>
                            </div>

                            <form onSubmit={handleGenerateTicket} className="space-y-8 max-w-lg mx-auto">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Tipo de Examen</label>
                                        <select
                                            required
                                            className="w-full h-14 rounded-2xl border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 font-medium"
                                            value={selectedExam}
                                            onChange={(e) => setSelectedExam(e.target.value)}
                                        >
                                            <option value="">Seleccionar examen...</option>
                                            {examTypes.map(e => <option key={e} value={e}>{e}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Especialidad (Ordenado por)</label>
                                        <select
                                            required
                                            className="w-full h-14 rounded-2xl border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 font-medium"
                                            value={selectedSpecialty}
                                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                                        >
                                            <option value="">Seleccionar especialidad...</option>
                                            {specialties.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2 pl-1">Fecha Preferida</label>
                                        <input
                                            type="date"
                                            required
                                            min={new Date().toISOString().split('T')[0]}
                                            className="w-full h-14 rounded-2xl border-slate-200 focus:border-teal-500 focus:ring-teal-500/20 font-medium"
                                            value={ticketDate}
                                            onChange={(e) => setTicketDate(e.target.value)}
                                        />
                                        <p className="text-xs text-slate-400 mt-2 pl-1 flex items-center gap-1">
                                            <Clock size={12} /> Horario de atención: 07:00 AM - 09:00 AM (Orden de llegada)
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full h-14 text-lg bg-slate-900 hover:bg-teal-600 shadow-xl shadow-slate-900/10 hover:shadow-teal-500/30 transition-all transform hover:scale-[1.02]"
                                >
                                    Generar Ticket
                                </Button>
                            </form>
                        </div>
                    ) : (
                        <div className="animate-in zoom-in-95 duration-500">
                            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border-4 border-teal-500/10 relative overflow-hidden text-center max-w-lg mx-auto">
                                {/* Decorator */}
                                <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-teal-400 via-emerald-500 to-teal-600"></div>
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl opacity-50"></div>

                                <CheckCircle size={60} className="text-teal-500 mx-auto mb-6 drop-shadow-lg" />

                                <h3 className="text-3xl font-black text-slate-900 mb-2">¡Ticket Generado!</h3>
                                <p className="text-slate-500 font-medium mb-8">Presenta este ticket en admisión</p>

                                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-8 text-left space-y-4 relative">
                                    <div className="absolute top-4 right-4 text-xs font-black text-slate-300 tracking-widest uppercase">TICKET DIGITAL</div>
                                    <div>
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Código</label>
                                        <p className="text-3xl font-black text-slate-900 tracking-tight font-mono">{generatedTicket.id}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</label>
                                            <p className="font-bold text-slate-800">{new Date(generatedTicket.date + 'T00:00:00').toLocaleDateString('es-PE', { weekday: 'short', day: '2-digit', month: 'short' })}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hora</label>
                                            <p className="font-bold text-teal-600">07:00 AM</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-slate-200">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Examen</label>
                                        <p className="font-bold text-slate-800">{generatedTicket.exam}</p>
                                        <p className="text-xs text-slate-500 mt-1">Orden: {generatedTicket.specialty}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Button
                                        variant="primary"
                                        className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                                        onClick={() => {
                                            setViewMode('results');
                                            setGeneratedTicket(null);
                                            setTicketDate('');
                                            setSelectedExam('');
                                            setSelectedSpecialty('');
                                        }}
                                    >
                                        Ver Mis Resultados
                                    </Button>
                                    <p className="text-xs text-slate-400 italic">Recuerda asistir en ayunas si tu examen lo requiere.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};


