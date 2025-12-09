
import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Search, Star, ArrowRight, Clock, Stethoscope, ChevronRight, Filter } from 'lucide-react';
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
        imageColor: 'bg-gradient-to-br from-emerald-400 to-teal-500 text-white',
        availability: 'Hoy, 3:00 PM - 6:00 PM'
    },
    {
        id: 2,
        name: 'Dra. Ana Gomez',
        specialty: 'Obstetricia',
        rating: 4.8,
        patients: 200,
        imageColor: 'bg-gradient-to-br from-rose-400 to-pink-500 text-white',
        availability: 'Mañana, 8:00 AM - 12:00 PM'
    },
    {
        id: 3,
        name: 'Dr. Carlos Ruiz',
        specialty: 'Psicología',
        rating: 4.9,
        patients: 85,
        imageColor: 'bg-gradient-to-br from-purple-400 to-indigo-500 text-white',
        availability: 'Hoy, 4:00 PM - 7:00 PM'
    },
    {
        id: 4,
        name: 'Dra. Maria Diaz',
        specialty: 'Dental',
        rating: 4.7,
        patients: 150,
        imageColor: 'bg-gradient-to-br from-blue-400 to-cyan-500 text-white',
        availability: 'Viernes, 9:00 AM - 1:00 PM'
    },
    {
        id: 5,
        name: 'Dra. Lucia Fernandez',
        specialty: 'CRED (Crecimiento y Desarrollo)',
        rating: 5.0,
        patients: 300,
        imageColor: 'bg-gradient-to-br from-orange-400 to-amber-500 text-white',
        availability: 'Hoy, 2:00 PM - 5:00 PM'
    },
    {
        id: 6,
        name: 'Dr. Juan Perez',
        specialty: 'Medicina General',
        rating: 4.6,
        patients: 90,
        imageColor: 'bg-gradient-to-br from-sky-400 to-blue-500 text-white',
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
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <span className="bg-teal-50 p-2 rounded-xl text-teal-600 border border-teal-100">
                            <Stethoscope size={24} strokeWidth={1.5} />
                        </span>
                        <span className="font-bold text-teal-900">Staff Médico</span>
                    </h1>
                    <p className="text-slate-500 mt-2 max-w-xl">
                        Conoce a nuestros especialistas altamente calificados. Filtra, revisa su disponibilidad y reserva tu cita en segundos.
                    </p>
                </div>

                {/* Search Bar */}
                <div className="relative group w-full md:w-96">
                    <div className="absolute inset-0 bg-teal-100 rounded-2xl blur-md opacity-20 group-hover:opacity-40 transition-opacity"></div>
                    <div className="relative bg-white border border-slate-200 rounded-2xl flex items-center px-4 py-3 shadow-sm group-hover:shadow-md transition-shadow">
                        <Search className="text-slate-400 mr-3" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar médico o especialidad..."
                            className="flex-1 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400"
                        />
                        <button className="bg-slate-100 p-1.5 rounded-lg text-slate-500 hover:text-teal-600 hover:bg-teal-50 transition-colors">
                            <Filter size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_DOCTORS.map((doctor) => (
                    <div key={doctor.id} className="group relative bg-white/60 backdrop-blur-xl border border-white/50 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-teal-900/10 hover:-translate-y-1 transition-all duration-300">

                        {/* Profile Header */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className={`w-16 h-16 rounded-2xl shadow-lg flex items-center justify-center text-2xl font-black ${doctor.imageColor}`}>
                                {doctor.name.split(' ')[1][0]}
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-teal-700 transition-colors">{doctor.name}</h3>
                                <p className="text-sm font-medium text-slate-400">{doctor.specialty}</p>
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex items-center justify-between mb-6 bg-white/50 rounded-xl p-3 border border-white/60">
                            <div className="flex items-center gap-1.5">
                                <Star size={16} className="text-amber-400 fill-amber-400" />
                                <span className="font-bold text-slate-700">{doctor.rating}</span>
                                <span className="text-xs text-slate-400 font-medium">Rating</span>
                            </div>
                            <div className="w-px h-8 bg-slate-200"></div>
                            <div className="text-xs font-bold text-slate-600">
                                {doctor.patients}+ <span className="text-slate-400 font-medium">Pacientes</span>
                            </div>
                        </div>

                        {/* Availability & Action */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-teal-600 bg-teal-50 px-3 py-2 rounded-lg border border-teal-100/50">
                                <Clock size={14} />
                                Disponible: {doctor.availability}
                            </div>

                            <Button
                                className="w-full bg-slate-900 hover:bg-teal-600 text-white rounded-xl py-6 shadow-lg shadow-slate-900/10 group-hover:shadow-teal-500/20 transition-all font-bold flex items-center justify-between px-6"
                                onClick={() => handleBook(doctor.specialty)}
                            >
                                Reservar Cita
                                <div className="bg-white/20 p-1 rounded-full">
                                    <ChevronRight size={16} />
                                </div>
                            </Button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

