import React from 'react';
import { Card } from '../../components/ui/Card';

export const PatientPlaceholderData: React.FC<{ title: string }> = ({ title }) => {
    return (
        <Card title={title}>
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Sección en Construcción</h3>
                <p className="text-gray-500 mt-2 max-w-sm">
                    Estamos trabajando para habilitar el módulo de <strong>{title}</strong> muy pronto.
                </p>
            </div>
        </Card>
    );
};
