import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Star, MapPin, ArrowRight } from 'lucide-react';

interface DoctorMock {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    patients: number;
    imageColor: string;
}

const MOCK_DOCTORS: DoctorMock[] = [
    { id: 1, name: 'Dr. Sarah Garcia', specialty: 'Medicina General', rating: 4.9, patients: 120, imageColor: 'bg-emerald-100 text-emerald-600' },
    { id: 2, name: 'Dr. Marco Polo', specialty: 'Cardiología', rating: 4.8, patients: 85, imageColor: 'bg-blue-100 text-blue-600' },
    { id: 3, name: 'Dra. Elena Nito', specialty: 'Pediatría', rating: 4.9, patients: 200, imageColor: 'bg-rose-100 text-rose-600' },
    { id: 4, name: 'Dr. Alan Brito', specialty: 'Traumatología', rating: 4.7, patients: 90, imageColor: 'bg-amber-100 text-amber-600' },
];

export const Medicos: React.FC = () => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nuestros Especialistas</h1>
                    <p className="text-gray-500">Encuentra al médico adecuado para tus necesidades.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o especialidad..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none w-full md:w-80"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_DOCTORS.map((doctor) => (
                    <Card key={doctor.id} className="p-6 hover:shadow-lg transition-shadow border border-gray-100 flex flex-col items-center text-center">
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold mb-4 ${doctor.imageColor}`}>
                            {doctor.name.charAt(4)}
                        </div>

                        <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                        <p className="text-sky-600 font-medium mb-3">{doctor.specialty}</p>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 w-full justify-center">
                            <div className="flex items-center gap-1">
                                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                <span className="font-bold text-gray-700">{doctor.rating}</span>
                            </div>
                            <div className="h-4 w-px bg-gray-300"></div>
                            <div>{doctor.patients}+ Pacientes</div>
                        </div>

                        <Button className="w-full mt-auto">
                            Reservar Cita <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};
