import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AlertProps {
    type?: 'error' | 'success' | 'info';
    message: string;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', message }) => {
    const styles = {
        error: "bg-red-50 border-red-200 text-red-700",
        success: "bg-green-50 border-green-200 text-green-700",
        info: "bg-blue-50 border-blue-200 text-blue-700"
    };

    const icons = {
        error: <AlertCircle size={20} className="mr-2" />,
        success: <CheckCircle size={20} className="mr-2" />,
        info: <Info size={20} className="mr-2" />
    };

    return (
        <div className={`flex items-center p-4 rounded-lg border ${styles[type]} mb-4 animate-fadeIn`}>
            {icons[type]}
            <span className="text-sm font-medium">{message}</span>
        </div>
    );
};
