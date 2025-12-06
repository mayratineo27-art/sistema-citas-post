import React from 'react';
import { Layout } from '../components/Layout';
import { Plus, Search } from 'lucide-react';

export const PatientListPage: React.FC = () => {
    // Placeholder data
    const patients = [
        { id: '1', name: 'Juan Perez', dni: '12345678', phone: '999888777' },
        { id: '2', name: 'Maria Lopez', dni: '87654321', phone: '999111222' },
    ];

    return (
        <Layout>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Pacientes</h1>
                    <p className="text-gray-500">Gestión de historias clínicas y datos personales.</p>
                </div>
                <button className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-lg">
                    <Plus size={20} />
                    <span>Nuevo Paciente</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por DNI o Nombre..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        />
                    </div>
                </div>
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-medium">
                        <tr>
                            <th className="px-6 py-4">Nombre Completo</th>
                            <th className="px-6 py-4">DNI</th>
                            <th className="px-6 py-4">Teléfono</th>
                            <th className="px-6 py-4">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {patients.map((patient) => (
                            <tr key={patient.id} className="hover:bg-gray-50 transition">
                                <td className="px-6 py-4 font-medium text-gray-900">{patient.name}</td>
                                <td className="px-6 py-4">{patient.dni}</td>
                                <td className="px-6 py-4">{patient.phone}</td>
                                <td className="px-6 py-4">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                                    <button className="text-indigo-600 hover:text-indigo-900">Historial</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};
