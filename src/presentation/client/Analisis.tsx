
import React, { useState, useEffect } from 'react';
import { CheckCircle, Download, TestTube, Calendar } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabaseClient } from '../../infrastructure/db/client';
import { useNavigate } from 'react-router-dom';

export const Analisis: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingOrder, setBookingOrder] = useState<string | null>(null);
    const [patientName, setPatientName] = useState('');

    // --- NEW STATE: Catalog & Booking ---
    const [availableExams] = useState({
        "Hematología": [
            { id: 'HEM-001', name: 'Hemograma Completo', desc: 'Recuento de células sanguíneas' },
            { id: 'HEM-002', name: 'Grupo Sanguíneo y Factor Rh', desc: 'Tipificación de sangre' },
            { id: 'HEM-003', name: 'Velocidad de Sedimentación', desc: 'Marcador de inflamación' }
        ],
        "Bioquímica": [
            { id: 'BIO-001', name: 'Glucosa en Ayunas', desc: 'Descarte de diabetes' },
            { id: 'BIO-002', name: 'Perfil Lipídico', desc: 'Colesterol, HDL, LDL, Triglicéridos' },
            { id: 'BIO-003', name: 'Urea y Creatinina', desc: 'Función renal' },
            { id: 'BIO-004', name: 'Perfil Hepático', desc: 'Función del hígado' }
        ],
        "Inmunología": [
            { id: 'INM-001', name: 'Prueba Rápida VIH', desc: 'Descarte de VIH' },
            { id: 'INM-002', name: 'Prueba Rápida Sífilis (RPR)', desc: 'Descarte de sífilis' },
            { id: 'INM-003', name: 'Antígeno de Superficie (HBsAg)', desc: 'Hepatitis B' }
        ],
        "Microbiología": [
            { id: 'MIC-001', name: 'Examen Completo de Orina', desc: 'Infección urinaria' },
            { id: 'MIC-002', name: 'Parasitológico Seriado', desc: 'Heces (3 muestras)' }
        ]
    });

    const [selectedExam, setSelectedExam] = useState<any>(null);
    const [selectedDate, setSelectedDate] = useState('');
    const [quotaLeft, setQuotaLeft] = useState(28); // Mock quota

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';
            const { data: patient } = await supabaseClient.from('patients').select('id, first_name, last_name').eq('dni', activeDni).single();
            if (!patient) return;
            setPatientName(`${patient.first_name} ${patient.last_name}`);

            const { data } = await supabaseClient
                .from('lab_orders')
                .select(`*, doctors(firstname, lastname)`)
                .eq('patient_id', patient.id)
                .order('created_at', { ascending: false });

            if (data) setOrders(data);
        } catch (error) {
            console.error("Error fetching lab orders", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const pendingOrders = orders.filter(o => o.status === 'PENDING');
    const historyOrders = orders.filter(o => o.status !== 'PENDING');

    const handleBook = (orderId: string) => {
        setBookingOrder(orderId);
    };

    // Helper to get remaining quota (Mock)
    const checkQuota = (date: string) => {
        // Simple mock: weekends have 0, weekdays have random 15-30
        const d = new Date(date);
        const day = d.getDay(); // 0 = Sun, 6 = Sat
        if (day === 5 || day === 6) return 0; // Weekend closed/full
        return Math.floor(Math.random() * 15) + 15;
    };

    const handleDateSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        setQuotaLeft(checkQuota(e.target.value));
    };

    const confirmBooking = async () => {
        if (!selectedExam || !selectedDate) return;

        // In real app: Insert into 'lab_orders' or 'appointments'
        alert(`✅ TICKET GENERADO\n\nExamen: ${selectedExam.name}\nFecha: ${selectedDate}\n\nInstrucciones:\n- Acérquese de 07:00 AM a 10:00 AM.\n- Atención por orden de llegada.\n- Venga en ayunas.`);

        // Optimistic UI update: Add to 'pendingOrders' list
        const newOrder = {
            id: Math.random().toString(36).substr(2, 9),
            type: selectedExam.name,
            status: 'PENDING',
            created_at: new Date().toISOString(),
            scheduled_date: selectedDate, // Store selected date
            doctors: { firstname: 'Sistema', lastname: '(Autosolicitado)' }
        };

        setOrders([newOrder, ...orders]);
        setSelectedExam(null);
        setSelectedDate('');
    };

    const confirmExistingOrderBooking = async () => {
        if (!bookingOrder) return;
        alert("🗓️ ¡Cita para Toma de Muestra Agendada!\n\nTe esperamos mañana de 07:00 AM a 10:00 AM en ayunas.");
        setOrders(orders.map(o => o.id === bookingOrder ? { ...o, status: 'PROCESSING' } : o));
        setBookingOrder(null);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* 1. Header Logic */}
            <div className="relative bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-slate-200 overflow-hidden border border-slate-100">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-zinc-100 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-black text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                                    Laboratorio Clínico
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
                                Mis Análisis
                            </h1>
                            <p className="text-slate-600 font-medium text-lg max-w-md leading-relaxed">
                                Solicita tus exámenes de laboratorio y obtén tu ticket de atención rápida.
                                <span className="block mt-2 text-sm text-slate-500 bg-slate-100 inline-block px-2 py-1 rounded font-bold">
                                    Horario de Toma de Muestras: 07:00 AM - 10:00 AM
                                </span>
                            </p>
                            {patientName && (
                                <div className="mt-4 inline-flex items-center gap-2 bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                    Paciente: {patientName}
                                </div>
                            )}
                        </div>

                        {/* Stat Pill */}
                        <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center gap-4">
                            <div className="text-right">
                                <div className="text-2xl font-black text-slate-900 leading-none">{pendingOrders.length}</div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pendientes</div>
                            </div>
                            <div className="h-10 w-10 bg-black text-white rounded-full flex items-center justify-center">
                                <TestTube size={20} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900"></div>
                </div>
            ) : (
                <div className="space-y-12">

                    {/* SECTION 1: CATALOG & BOOKING (NEW LOGIC) */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-black rounded-full"></div>
                            <h2 className="text-2xl font-black text-slate-900">Solicitar Examen</h2>
                        </div>

                        {/* CATALOG GRID */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {Object.entries(availableExams).map(([category, exams]) => (
                                <Card key={category} className="p-6 border border-slate-100 bg-white/50 hover:bg-white transition-all shadow-sm">
                                    <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-black rounded-full"></div>
                                        {category}
                                    </h3>
                                    <div className="space-y-3">
                                        {exams.map((exam) => (
                                            <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                                                <div>
                                                    <div className="font-bold text-sm text-slate-700">{exam.name}</div>
                                                    <div className="text-xs text-slate-400">{exam.desc}</div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setSelectedExam(exam)}
                                                    className="opacity-0 group-hover:opacity-100 transition-opacity border-slate-200"
                                                >
                                                    Solicitar
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {/* BOOKING MODAL */}
                        {selectedExam && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                                <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
                                    <button
                                        onClick={() => { setSelectedExam(null); setSelectedDate(''); }}
                                        className="absolute top-4 right-4 text-slate-400 hover:text-black"
                                    >
                                        ✕
                                    </button>

                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-900">
                                            <TestTube size={32} />
                                        </div>
                                        <h3 className="text-xl font-black text-slate-900 mb-1">Confirmar Solicitud</h3>
                                        <p className="text-slate-500 text-sm">Estás solicitando: <b className="text-slate-800">{selectedExam.name}</b></p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Selecciona Fecha</label>
                                            <input
                                                type="date"
                                                className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-black/5 outline-none font-medium"
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={handleDateSelect}
                                            />
                                        </div>

                                        {selectedDate && (
                                            <div className={`p-4 rounded-xl border ${quotaLeft > 0 ? 'bg-green-50 border-green-100 text-green-800' : 'bg-red-50 border-red-100 text-red-800'}`}>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-sm">Disponibilidad</span>
                                                    <span className="font-black text-lg">{quotaLeft}/30</span>
                                                </div>
                                                <p className="text-xs opacity-80">
                                                    {quotaLeft > 0
                                                        ? "Hay cupos disponibles. Atención por orden de llegada (07:00 - 10:00 AM)."
                                                        : "No hay cupos para esta fecha. Selecciona otro día."}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <Button
                                        onClick={confirmBooking}
                                        disabled={!selectedDate || quotaLeft === 0}
                                        className="w-full bg-black text-white hover:bg-slate-800 h-12 rounded-xl font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Generar Ticket
                                    </Button>
                                    <p className="text-[10px] text-center text-slate-400 mt-4">
                                        Al confirmar, se generará una orden interna. Debes asistir puntualmente.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: PENDING ORDERS LIST */}
                    {pendingOrders.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-8 w-1 bg-yellow-400 rounded-full"></div>
                                <h2 className="text-2xl font-black text-slate-900">Tickets Generados / Pendientes</h2>
                            </div>
                            <div className="grid gap-4">
                                {pendingOrders.map(order => (
                                    <Card key={order.id} className="p-6 border-l-4 border-l-yellow-400 flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Pendiente</span>
                                                <span className="text-xs text-slate-400 font-mono">#{order.id.slice(0, 8)}</span>
                                            </div>
                                            <h4 className="font-bold text-slate-900 text-lg">{order.type}</h4>

                                            <p className="text-sm text-slate-500">Dr. {order.doctors?.lastname || 'Sistema'}</p>

                                            {/* SCHEDULED DATE DISPLAY */}
                                            {order.scheduled_date && (
                                                <div className="mt-2 inline-flex items-center gap-2 bg-slate-100 rounded-lg px-2 py-1">
                                                    <Calendar size={12} className="text-slate-500" />
                                                    <span className="text-xs font-bold text-slate-700">
                                                        {new Date(order.scheduled_date + 'T12:00:00').toLocaleDateString()}
                                                    </span>
                                                </div>
                                            )}

                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Acudir</div>
                                            <div className="font-black text-xl text-slate-900">07:00 AM</div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 3: HISTORY (Renamed to Exámenes Realizados) */}
                    {historyOrders.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6 opacity-60">
                                <div className="h-8 w-1 bg-slate-200 rounded-full"></div>
                                <h2 className="text-2xl font-black text-slate-400">Exámenes Realizados</h2>
                            </div>

                            <div className="grid gap-4 opacity-75 hover:opacity-100 transition-opacity">
                                {historyOrders.map(order => (
                                    <div key={order.id} className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="bg-green-50 p-3 rounded-full text-green-600">
                                                <CheckCircle size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{order.type}</h4>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {order.status === 'PROCESSING' ? (
                                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                                Procesando
                                            </span>
                                        ) : (
                                            <Button className="text-slate-400 hover:text-black gap-2 bg-transparent shadow-none border-0 p-0">
                                                <Download size={16} /> Descargar
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            )}
        </div>
    );
};
