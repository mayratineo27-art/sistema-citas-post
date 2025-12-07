import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const PatientProfile: React.FC = () => {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <div className="md:col-span-1">
                    <Card className="text-center h-full">
                        <div className="w-32 h-32 bg-primary-100 rounded-full mx-auto flex items-center justify-center text-primary-600 font-bold text-4xl mb-4">
                            MG
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Maria Gomez</h3>
                        <p className="text-gray-500">DNI: 87654321</p>
                        <div className="mt-6 space-y-2">
                            <div className="bg-green-50 text-green-700 py-2 px-4 rounded-lg text-sm font-medium">Historia Clínica Activa</div>
                            <div className="bg-blue-50 text-blue-700 py-2 px-4 rounded-lg text-sm font-medium">SIS Seguro</div>
                        </div>
                    </Card>
                </div>

                {/* Details Form */}
                <div className="md:col-span-2">
                    <Card title="Información Personal">
                        <form className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Nombres" value="Maria" disabled />
                                <Input label="Apellidos" value="Gomez" disabled />
                                <Input label="Fecha de Nacimiento" type="date" value="1990-05-15" disabled />
                                <Input label="Teléfono" value="999888777" />
                                <Input label="Dirección" value="Av. Siempre Viva 123" />
                                <Input label="Email" value="patient1@example.com" />
                            </div>
                            <div className="pt-4 flex justify-end">
                                <Button className="w-auto px-6">Actualizar Datos</Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};
