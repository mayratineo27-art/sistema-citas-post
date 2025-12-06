import React from 'react';
import { Layout } from '../components/Layout';
import { Plus, Search, MapPin, Stethoscope } from 'lucide-react';

interface DoctorData {
    id: string;
    name: string;
    specialty: string;
    status: 'Activo' | 'Inactivo';
}

export const DoctorListPage: React.FC = () => {
    const doctors: DoctorData[] = [
        { id: '1', name: 'Dr. Juan Perez', specialty: 'Medicina General', status: 'Activo' },
        { id: '2', name: 'Dra. Ana Silva', specialty: 'Pediatría', status: 'Inactivo' },
    ];

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Médicos</h1>
                    <p className="text-gray-500">Administre el personal médico y sus especialidades.</p>
                </div>
                <button className="flex items-center space-x-2 bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition shadow-md">
                    <Plus size={20} />
                    <span>Nuevo Médico</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.map((doc) => (
                    <div key={doc.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                                    {doc.name.charAt(4)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{doc.name}</h3>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <Stethoscope size={14} className="mr-1" />
                                        {doc.specialty}
                                    </div>
                                </div>
                            </div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${doc.status === 'Activo' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                {doc.status}
                            </span>
                        </div>
                        <div className="mt-6 flex space-x-2">
                            <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition">Ver Perfil</button>
                            <button className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100 transition">Horarios</button>
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
};
