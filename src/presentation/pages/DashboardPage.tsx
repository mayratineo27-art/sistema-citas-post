import React from 'react';
import { Layout } from '../components/Layout';

export const DashboardPage: React.FC = () => {
    return (
        <Layout>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Citas Hoy</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">12</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Pacientes Registrados</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">1,240</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Médicos Activos</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
                </div>
            </div>
        </Layout>
    );
}
