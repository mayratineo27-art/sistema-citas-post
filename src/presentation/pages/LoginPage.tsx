import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export const LoginPage: React.FC = () => {
    const [dni, setDni] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        // Mock Login Logic for UI Demo
        setTimeout(() => {
            setIsLoading(false);
            if (dni === '88888888' && password === 'admin') {
                navigate('/');
            } else if (dni.length !== 8) {
                setError('El DNI debe tener 8 dígitos válidos.');
            } else {
                setError('Credenciales incorrectas. Intente nuevamente.');
            }
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center shadow-lg mb-4 text-white">
                        {/* Simple Logo Placeholder */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.28 3.6-1.28 5.14 0l.01.01c0 .32-.09.65-.25.95l-4.28 8.01c-.83 1.55-2.07 1-2.07 1s-4-1.55-4-5.38c0-2.12 1.91-3.66 3.94-3.56z" /><path d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" /></svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">CitaMedica Posta</h1>
                    <p className="text-gray-500 mt-2">Bienvenido al sistema de citas médicas</p>
                </div>

                <Card title="Iniciar Sesión">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && <Alert type="error" message={error} />}

                        <Input
                            label="DNI"
                            type="text"
                            placeholder="Ingrese su número de DNI"
                            maxLength={8}
                            value={dni}
                            onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
                        />

                        <Input
                            label="Contraseña"
                            type="password"
                            placeholder="Ingrese su contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button type="submit" isLoading={isLoading}>
                            Ingresar al Sistema
                        </Button>

                        <div className="text-center pt-2">
                            <span className="text-sm text-gray-600">¿No tiene una cuenta? </span>
                            <Link to="/register" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                                Regístrese aquí
                            </Link>
                        </div>
                    </form>
                </Card>

                <p className="text-center text-xs text-gray-400 mt-8">
                    © 2025 Posta Médica Local. Todos los derechos reservados.
                </p>
            </div>
        </div>
    );
};
