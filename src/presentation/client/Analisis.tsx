import React, { useState } from 'react';
import { FileBarChart, AlertTriangle, CheckCircle, Lock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabaseClient } from '../../infrastructure/db/client';
import { useNavigate } from 'react-router-dom';

export const Analisis: React.FC = () => {
    const navigate = useNavigate();
    const [checking, setChecking] = useState(false);
    const [hasOrder, setHasOrder] = useState<boolean | null>(null);

    // Mock logic to check for orders
    const checkOrders = async () => {
        setChecking(true);
        // Simulate API check
        setTimeout(async () => {
            // In real app, query 'orders' table
            // const { data } = await supabase.from('orders').select('*').eq('patient_id', ...).eq('type', 'LAB').single();

            // For prototype: Randomly fail or look for a specific keyword in previous appointment notes if possible
            // Let's assume user DO NOT have order by default to show the restriction
            const mockHasOrder = false; // Change to true to test success flow

            setHasOrder(mockHasOrder);
            setChecking(false);
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                    <FileBarChart size={200} />
                </div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
                        <FileBarChart className="text-blue-200" />
                        Exámenes de Análisis
                    </h1>
                    <p className="text-blue-100 text-lg max-w-lg">
                        Reserva tus exámenes de laboratorio, rayos X y otros procedimientos de diagnóstico.
                    </p>
                </div>
            </div>

            {/* Validation Section */}
            <div className="max-w-2xl mx-auto">
                {hasOrder === null ? (
                    <Card className="p-8 border-2 border-blue-100 shadow-lg text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto text-blue-500 animate-pulse">
                            <Lock size={40} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">Acceso Restringido</h2>
                            <p className="text-slate-500">
                                Para reservar un examen, el sistema debe validar que tienes una
                                <span className="font-bold text-slate-700"> orden médica vigente</span> emitida por Medicina General u Obstetricia.
                            </p>
                        </div>
                        <Button
                            onClick={checkOrders}
                            disabled={checking}
                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            {checking ? 'Validando Orden Médica...' : 'Validar Orden y Reservar'}
                        </Button>
                    </Card>
                ) : hasOrder === false ? (
                    <Card className="p-8 border-2 border-red-100 shadow-lg text-center space-y-6 bg-red-50/30">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-500">
                            <AlertTriangle size={40} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">No se encontró orden médica</h2>
                            <p className="text-slate-600 mb-4">
                                No tienes órdenes de laboratorio pendientes en tu expediente. Debes pasar consulta primero.
                            </p>
                            <div className="bg-white p-4 rounded-xl border border-slate-200 text-left text-sm text-slate-500">
                                <p className="font-semibold text-slate-700 mb-1">Pasos a seguir:</p>
                                <ol className="list-decimal list-inside space-y-1">
                                    <li>Reserva una cita en <b>Medicina General</b>.</li>
                                    <li>Solicita al médico tus exámenes.</li>
                                    <li>Vuelve a esta sección para programar tu toma de muestra.</li>
                                </ol>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <Button
                                variant="outline"
                                onClick={() => setHasOrder(null)}
                                className="flex-1 bg-white"
                            >
                                Volver
                            </Button>
                            <Button
                                onClick={() => navigate('/cliente/reservar')}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
                            >
                                Reservar Consulta Médica
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <Card className="p-8 border-2 border-green-100 shadow-lg text-center space-y-6 bg-green-50/30">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                            <CheckCircle size={40} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800 mb-2">¡Orden Validada!</h2>
                            <p className="text-slate-600">
                                Hemos encontrado una orden pendiente para <b>Hemograma Completo</b>.
                            </p>
                        </div>
                        <Button
                            onClick={() => navigate('/cliente/reservar?specialty=Laboratorio')}
                            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg hover:shadow-green-500/30 transition-all"
                        >
                            Agendar Toma de Muestra
                        </Button>
                    </Card>
                )}
            </div>
        </div>
    );
};
