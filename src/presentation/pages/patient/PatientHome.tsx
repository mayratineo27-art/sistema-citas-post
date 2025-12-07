import React from 'react';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Calendar, Clock, MapPin, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const PatientHome: React.FC = () => {
    // Mock Data
    const nextAppointment = {
        date: '12 de Diciembre, 2025',
        time: '10:00 AM',
        doctor: 'Dr. Juan Perez',
        specialty: 'Medicina General',
        location: 'Consultorio 204'
    };

    return (
        <div className="space-y-6">
            <Alert type="info" message="Recuerde llegar 15 minutos antes de su cita programada." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Next Appointment Card - Highlighted */}
                <div className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-2xl p-6 text-white shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h3 className="text-primary-100 text-sm font-medium uppercase tracking-wider">Próxima Cita</h3>
                            <p className="text-2xl font-bold mt-1">Consulta Médica</p>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                            <Calendar size={24} className="text-white" />
                        </div>
                    </div>

                    <div className="space-y-3 mb-6">
                        <div className="flex items-center space-x-2 text-primary-50">
                            <Clock size={16} />
                            <span>{nextAppointment.date} - {nextAppointment.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-primary-50">
                            <MapPin size={16} />
                            <span>{nextAppointment.location}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">{nextAppointment.doctor}</p>
                            <p className="text-xs text-primary-200">{nextAppointment.specialty}</p>
                        </div>
                        <button className="bg-white text-primary-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 transition">
                            Ver Detalles
                        </button>
                    </div>
                </div>

                {/* Quick Actions Card */}
                <Card title="Acciones Rápidas">
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-full flex flex-col items-center justify-center p-4 space-y-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700">
                            <Calendar size={24} />
                            <span>Nueva Cita</span>
                        </Button>
                        <Button variant="outline" className="h-full flex flex-col items-center justify-center p-4 space-y-2 hover:bg-primary-50 hover:border-primary-200 hover:text-primary-700">
                            <Clock size={24} />
                            <span>Historial</span>
                        </Button>
                    </div>
                </Card>
            </div>

            {/* Recent Analysis or History Placeholder */}
            <Card title="Últimos Resultados" subtitle="Exámenes recientes disponibles para descarga">
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                    <FileText size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900">Hemograma Completo</h4>
                                    <p className="text-xs text-gray-500">10 Oct 2025 - Laboratorio Central</p>
                                </div>
                            </div>
                            <button className="text-primary-600 text-sm font-medium hover:underline">Descargar PDF</button>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};
