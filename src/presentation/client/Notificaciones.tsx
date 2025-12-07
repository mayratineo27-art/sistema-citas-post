import React from 'react';
import { Card } from '../components/ui/Card';
import { Bell, Calendar, Info } from 'lucide-react';

export const Notificaciones: React.FC = () => {
    const alerts = [
        { id: 1, type: 'reminder', title: 'Recordatorio de Cita', message: 'Tienes una cita mañana a las 10:00 AM con Medicina General.', date: 'Hace 2 horas' },
        { id: 2, type: 'info', title: 'Campaña de Vacunación', message: 'La próxima semana inicia la campaña contra la Influenza.', date: 'Hace 1 día' },
    ];

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Notificaciones</h1>
                <p className="text-gray-500">Avisos importantes sobre tus citas y salud.</p>
            </div>

            <div className="space-y-4">
                {alerts.map((alert) => (
                    <div key={alert.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start space-x-4">
                        <div className={`p-2 rounded-lg ${alert.type === 'reminder' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'}`}>
                            {alert.type === 'reminder' ? <Calendar size={20} /> : <Info size={20} />}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-gray-900 text-sm">{alert.title}</h4>
                                <span className="text-xs text-gray-400">{alert.date}</span>
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{alert.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
