import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        dni: '',
        birthDate: '',
        expiryDate: '', // DNI expiry
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        // Guardian fields
        guardianDni: '',
        guardianName: '',
        guardianRelation: ''
    });

    const [isMinor, setIsMinor] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check age logic
    useEffect(() => {
        if (formData.birthDate) {
            const today = new Date();
            const birth = new Date(formData.birthDate);
            let age = today.getFullYear() - birth.getFullYear();
            const m = today.getMonth() - birth.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
                age--;
            }
            setIsMinor(age < 18);
        }
    }, [formData.birthDate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Basic Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }
        if (formData.dni.length !== 8) {
            setError('El DNI debe tener 8 dígitos.');
            return;
        }

        if (isMinor && (!formData.guardianDni || !formData.guardianName)) {
            setError('Datos del apoderado son requeridos para menores de edad.');
            return;
        }

        // Simulate Registration
        console.log("Registering...", formData);
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 py-12">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Registro de Paciente</h1>
                    <p className="text-gray-500 mt-2">Complete sus datos para crear una historia clínica digital</p>
                </div>

                <Card>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && <Alert type="error" message={error} />}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="DNI"
                                name="dni"
                                value={formData.dni}
                                onChange={handleChange}
                                placeholder="8 dígitos"
                                maxLength={8}
                                required
                            />
                            <Input
                                label="Fecha de Emisión DNI"
                                name="expiryDate"
                                type="date"
                                value={formData.expiryDate}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Nombres"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Apellidos"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                            <Input
                                label="Fecha de Nacimiento"
                                name="birthDate"
                                type="date"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {isMinor && (
                            <div className="bg-orange-50 p-6 rounded-xl border border-orange-100 animate-fadeIn">
                                <h4 className="font-bold text-orange-800 mb-4 flex items-center">
                                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                                    Datos del Apoderado (Menor de Edad)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="DNI Apoderado"
                                        name="guardianDni"
                                        value={formData.guardianDni}
                                        onChange={handleChange}
                                        maxLength={8}
                                    />
                                    <Input
                                        label="Nombre Completo Apoderado"
                                        name="guardianName"
                                        value={formData.guardianName}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Relación / Parentesco"
                                        name="guardianRelation"
                                        value={formData.guardianRelation}
                                        onChange={handleChange}
                                        placeholder="Ej. Padre, Madre, Tío"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="border-t border-gray-100 pt-6">
                            <h4 className="font-medium text-gray-900 mb-4">Seguridad de la Cuenta</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Contraseña"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                                <Input
                                    label="Confirmar Contraseña"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex flex-col md:flex-row gap-4 items-center">
                            <Button type="submit">
                                Registrarme
                            </Button>
                            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-primary-600">
                                ¿Ya tiene cuenta? Inicie sesión
                            </Link>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};
