import React from 'react';
import { Layout } from '../components/Layout';
import { Users, Calendar, Stethoscope, TrendingUp } from 'lucide-react';
import { Card } from '../components/ui/Card';

export const DashboardPage: React.FC = () => {
    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard General</h1>
                <p className="text-gray-500 mt-1">Resumen de la actividad de la posta médica</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stat 1 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition card-zoom">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Citas Hoy</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">12</h3>
                        <div className="flex items-center mt-2 text-green-600 text-sm font-medium">
                            <TrendingUp size={16} className="mr-1" />
                            <span>+4% vs ayer</span>
                        </div>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Calendar size={24} />
                    </div>
                </div>

                {/* Stat 2 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition card-zoom">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Pacientes</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">1,240</h3>
                        <div className="flex items-center mt-2 text-green-600 text-sm font-medium">
                            <TrendingUp size={16} className="mr-1" />
                            <span>+12 nuevos este mes</span>
                        </div>
                    </div>
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <Users size={24} />
                    </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between hover:shadow-md transition card-zoom">
                    <div>
                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Médicos Activos</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-2">5</h3>
                        <div className="flex items-center mt-2 text-gray-400 text-sm">
                            <span>Todos en turno</span>
                        </div>
                    </div>
                    <div className="p-3 bg-teal-50 text-teal-600 rounded-lg">
                        <Stethoscope size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Próximas Citas">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50/50">
                                <tr>
                                    <th className="px-4 py-3">Paciente</th>
                                    <th className="px-4 py-3">Doctor</th>
                                    <th className="px-4 py-3">Hora</th>
                                    <th className="px-4 py-3">Estado</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {[1, 2, 3].map((i) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition">
                                        <td className="px-4 py-3 font-medium text-gray-900">Juan Pérez</td>
                                        <td className="px-4 py-3 text-gray-600">Dr. Smith</td>
                                        <td className="px-4 py-3 text-gray-600">10:00 AM</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Confirmada
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <Card title="Actividad Reciente">
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                                <div>
                                    <p className="text-gray-800 text-sm font-medium">Nueva cita programada</p>
                                    <p className="text-gray-500 text-xs mt-0.5">Hace 15 minutos por Recepción</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </Layout>
    );
}
