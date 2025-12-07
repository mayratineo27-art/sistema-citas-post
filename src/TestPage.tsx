import React from 'react';

export const TestPage: React.FC = () => {
    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f0f0f0',
            padding: '40px',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                <h1 style={{
                    fontSize: '48px',
                    fontWeight: 'bold',
                    color: '#000',
                    marginBottom: '20px',
                    border: '4px solid red'
                }}>
                    ✅ SI VES ESTO FUNCIONA
                </h1>

                <div style={{
                    backgroundColor: '#0ea5e9',
                    padding: '30px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    border: '3px solid #0284c7'
                }}>
                    <h2 style={{
                        fontSize: '32px',
                        fontWeight: 'bold',
                        color: 'white',
                        marginBottom: '10px'
                    }}>
                        React está funcionando
                    </h2>
                    <p style={{
                        fontSize: '20px',
                        color: 'white'
                    }}>
                        Este texto está usando estilos inline (sin TailwindCSS)
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '20px', marginBottom: '30px' }}>
                    <div style={{
                        flex: 1,
                        backgroundColor: '#10b981',
                        padding: '30px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '3px solid #059669'
                    }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
                            Vite
                        </h3>
                        <p style={{ fontSize: '18px', color: 'white' }}>✓ Running</p>
                    </div>

                    <div style={{
                        flex: 1,
                        backgroundColor: '#3b82f6',
                        padding: '30px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '3px solid #2563eb'
                    }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
                            React
                        </h3>
                        <p style={{ fontSize: '18px', color: 'white' }}>✓ Mounted</p>
                    </div>

                    <div style={{
                        flex: 1,
                        backgroundColor: '#8b5cf6',
                        padding: '30px',
                        borderRadius: '8px',
                        textAlign: 'center',
                        border: '3px solid #7c3aed'
                    }}>
                        <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', marginBottom: '10px' }}>
                            Estilos
                        </h3>
                        <p style={{ fontSize: '18px', color: 'white' }}>✓ Inline CSS</p>
                    </div>
                </div>

                <button style={{
                    backgroundColor: '#ef4444',
                    color: 'white',
                    padding: '20px 40px',
                    fontSize: '24px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '100%',
                    border: '4px solid #dc2626'
                }}
                    onClick={() => alert('¡EL BOTÓN FUNCIONA!')}>
                    PRESIONA AQUÍ SI VES ESTE BOTÓN ROJO
                </button>

                <div style={{
                    marginTop: '30px',
                    backgroundColor: '#fef3c7',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '2px solid #f59e0b'
                }}>
                    <p style={{ fontSize: '18px', color: '#92400e', fontWeight: 'bold' }}>
                        ⚠️ IMPORTANTE: Si NO ves texto ni colores, presiona:
                    </p>
                    <ul style={{ fontSize: '16px', color: '#92400e', marginLeft: '20px', marginTop: '10px' }}>
                        <li style={{ marginBottom: '5px' }}>Windows: <strong>Ctrl + Shift + R</strong></li>
                        <li>Mac: <strong>Cmd + Shift + R</strong></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
