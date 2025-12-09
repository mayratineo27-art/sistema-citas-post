import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Star, ArrowRight, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DoctorMock {
    id: number;
    name: string;
    specialty: string;
    rating: number;
    patients: number;
    imageColor: string;
    availability: string;
}

// Valid Specialties: Medicina General, Obstetricia, Psicología, Dental, CRED (Crecimiento y Desarrollo)
const MOCK_DOCTORS: DoctorMock[] = [
    {
        id: 1,
        name: 'Dr. Sarah Garcia',
        specialty: 'Medicina General',
        rating: 4.9,
        patients: 120,
        imageColor: 'bg-emerald-100 text-emerald-600',
        availability: 'Hoy, 3:00 PM - 6:00 PM'
    },
    {
        id: 2,
        name: 'Dra. Ana Gomez',
        specialty: 'Obstetricia',
        rating: 4.8,
        patients: 200,
        imageColor: 'bg-rose-100 text-rose-600',
        availability: 'Mañana, 8:00 AM - 12:00 PM'
    },
    {
        id: 3,
        name: 'Dr. Carlos Ruiz',
        specialty: 'Psicología',
        rating: 4.9,
        patients: 85,
        imageColor: 'bg-purple-100 text-purple-600',
        availability: 'Hoy, 4:00 PM - 7:00 PM'
    },
    {
        id: 4,
        name: 'Dra. Maria Diaz',
        specialty: 'Dental',
        rating: 4.7,
        patients: 150,
        imageColor: 'bg-blue-100 text-blue-600',
        availability: 'Viernes, 9:00 AM - 1:00 PM'
    },
    {
        id: 5,
        name: 'Dra. Lucia Fernandez',
        specialty: 'CRED (Crecimiento y Desarrollo)',
        rating: 5.0,
        patients: 300,
        imageColor: 'bg-orange-100 text-orange-600',
        availability: 'Hoy, 2:00 PM - 5:00 PM'
    },
    {
        id: 6,
        name: 'Dr. Juan Perez',
        specialty: 'Medicina General',
        rating: 4.6,
        patients: 90,
        imageColor: 'bg-sky-100 text-sky-600',
        availability: 'Mañana, 2:00 PM - 6:00 PM'
    }
];

export const Medicos: React.FC = () => {
    const navigate = useNavigate();

    const handleBook = (specialty: string) => {
        // Robust mapping to route param IDs
        const map: Record<string, string> = {
            'Medicina General': 'medicina-general',
            'Obstetricia': 'obstetricia',
            'Psicología': 'psicologia',
            'Dental': 'dental',
            'Tópico': 'topico',
            'Emergencia': 'emergencia',
            'CRED (Crecimiento y Desarrollo)': 'cres' // Mapped manually
        };

        const specialtyId = map[specialty] || specialty.toLowerCase().replace(/ /g, '-');
        navigate(`/cliente/reservar/horarios/${specialtyId}`);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Nuestros Especialistas</h1>
                    <p className="text-gray-500">Encuentra al médico adecuado para tus necesidades y verifica su disponibilidad.</p>
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
                    <Card key={doctor.id} className="p-0 hover:shadow-xl transition-all border border-gray-100 flex flex-col overflow-hidden group">

                        {/* Header with Color */}
                        <div className={`h-24 ${doctor.imageColor} relative`}>
                            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                                <div className="w-20 h-20 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-2xl font-bold">
                                    <span className={doctor.imageColor.replace('bg-', 'text-').split(' ')[1]}>
                                        {doctor.name.charAt(4)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 px-6 pb-6 flex flex-col items-center text-center flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{doctor.name}</h3>
                            <p className="text-sky-600 font-medium mb-4 text-sm uppercase tracking-wide">{doctor.specialty}</p>

                            {/* Availability Badge */}
                            <div className="mb-4 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-green-100">
                                <Clock size={14} />
                                {doctor.availability}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 w-full justify-center">
                                <div className="flex items-center gap-1">
                                    <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                    <span className="font-bold text-gray-700">{doctor.rating}</span>
                                </div>
                                <div className="h-4 w-px bg-gray-300"></div>
                                <div>{doctor.patients}+ Pacientes</div>
                            </div>

                            <Button
                                className="w-full mt-auto bg-sky-600 hover:bg-sky-700 text-white shadow-md hover:shadow-lg transition-all"
                                onClick={() => handleBook(doctor.specialty)}
                            >
                                Reservar Cita <ArrowRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
