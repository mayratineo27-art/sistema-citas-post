import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string, title?: string, subtitle?: string }> = ({
    children,
    className = '',
    title,
    subtitle
}) => {
    return (
        <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
            {(title || subtitle) && (
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                    {title && <h3 className="text-xl font-bold text-gray-900">{title}</h3>}
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
            )}
            <div className="p-6">
                {children}
            </div>
        </div>
    );
};
