
import React, { useState, useEffect } from 'react';
import { FileBarChart, CheckCircle, Clock, FileText, Download, AlertCircle, TestTube, Lock, Calendar, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabaseClient } from '../../infrastructure/db/client';
import { useNavigate } from 'react-router-dom';

export const Analisis: React.FC = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [bookingOrder, setBookingOrder] = useState<string | null>(null); // ID of order being booked
    const [patientName, setPatientName] = useState('');

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
        // Here we would normally open a time slot picker.
        // For prototype, we'll simulate a "Quick Book" or redirect to a specialized confirmation.
        // Let's do a "Quick Book" simulation for "Own Format"
    };

    const confirmBooking = async () => {
        if (!bookingOrder) return;

        // Update order status to 'PROCESSING' (Simulating "Sample Taken" or "Appointment Scheduled")
        // In real app, we would create an appointment in 'appointments' table linked to this order.
        alert("🗓️ ¡Cita para Toma de Muestra Agendada!\n\nTe esperamos mañana de 07:00 AM a 09:00 AM en ayunas.");

        // Optimistic update
        setOrders(orders.map(o => o.id === bookingOrder ? { ...o, status: 'PROCESSING' } : o));
        setBookingOrder(null);
    };

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* 1. New Header (Black Text, "Bonito" Light Design) */}
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
                                Gestiona tus órdenes médicas y agenda tu toma de muestra <span className="text-slate-900 font-bold">únicamente</span> si tienes una orden pendiente.
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

                    {/* SECTION 1: BOOKING & PENDING (The "Own Format" Logic) */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-8 w-1 bg-black rounded-full"></div>
                            <h2 className="text-2xl font-black text-slate-900">Órdenes Pendientes</h2>
                        </div>

                        {pendingOrders.length === 0 ? (
                            // LOCKED STATE
                            <Card className="p-8 md:p-12 border-2 border-dashed border-slate-200 bg-slate-50/50 text-center relative overflow-hidden">
                                <div className="relative z-10 max-w-lg mx-auto">
                                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto text-slate-300 shadow-sm mb-6">
                                        <Lock size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">Reserva Bloqueada</h3>
                                    <p className="text-slate-500 mb-8">
                                        No puedes agendar una cita de laboratorio sin una orden médica vigente.
                                        Por favor, acude primero a <b>Medicina General</b> para ser evaluado.
                                    </p>
                                    <Button
                                        onClick={() => navigate('/cliente/reservar')}
                                        variant="outline"
                                        className="h-12 px-8 rounded-xl border-slate-300 text-slate-600 hover:border-black hover:text-black font-bold transition-all"
                                    >
                                        Ir a Medicina General
                                    </Button>
                                </div>
                            </Card>
                        ) : (
                            // ACTIVE ORDERS LIST
                            <div className="grid gap-6">
                                {pendingOrders.map(order => (
                                    <Card key={order.id} className="border-0 shadow-lg shadow-slate-200/50 bg-white overflow-hidden ring-1 ring-slate-100">
                                        <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between gap-6">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                                        Requiere Agendar
                                                    </span>
                                                    <span className="text-slate-300 text-xs font-mono">#{order.id.slice(0, 6)}</span>
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 mb-2">{order.type}</h3>
                                                <p className="text-slate-500 font-medium">
                                                    Dr. {order.doctors?.firstname} {order.doctors?.lastname}
                                                </p>
                                            </div>

                                            {/* BOOKING ACTION AREA */}
                                            <div className="bg-slate-50 rounded-2xl p-4 md:min-w-[300px] border border-slate-100 flex flex-col justify-center">
                                                {bookingOrder === order.id ? (
                                                    <div className="space-y-3 animate-in fade-in zoom-in duration-300">
                                                        <div className="text-center">
                                                            <div className="text-sm font-bold text-slate-900 mb-1">Selecciona Horario (Mañana)</div>
                                                            <div className="text-xs text-slate-500">7:00 AM - 10:00 AM</div>
                                                        </div>
                                                        <div className="h-px bg-slate-200 w-full"></div>
                                                        <div className="flex gap-2">
                                                            <Button
                                                                onClick={() => setBookingOrder(null)}
                                                                variant="ghost"
                                                                size="sm"
                                                                className="flex-1 text-slate-400 hover:text-red-500"
                                                            >
                                                                Cancelar
                                                            </Button>
                                                            <Button
                                                                onClick={confirmBooking}
                                                                className="flex-1 bg-black text-white hover:bg-slate-800 font-bold shadow-lg"
                                                            >
                                                                Confirmar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <p className="text-xs text-slate-400 font-medium mb-4">
                                                            Tienes una orden lista para ser procesada.
                                                        </p>
                                                        <Button
                                                            onClick={() => handleBook(order.id)}
                                                            className="w-full bg-slate-900 hover:bg-black text-white font-bold h-12 rounded-xl shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Calendar size={18} />
                                                            Agendar Toma de Muestra
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* SECTION 2: HISTORY (Existing results) */}
                    {historyOrders.length > 0 && (
                        <div>
                            <div className="flex items-center gap-3 mb-6 opacity-60">
                                <div className="h-8 w-1 bg-slate-200 rounded-full"></div>
                                <h2 className="text-2xl font-black text-slate-400">Historial de Resultados</h2>
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
                                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-black gap-2">
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
