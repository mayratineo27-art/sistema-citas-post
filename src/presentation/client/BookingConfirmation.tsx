import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { ChevronLeft, User, Calendar, Clock, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabaseClient } from '../../infrastructure/db/client';

export const BookingConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get params from URL
    const specialtyParam = searchParams.get('specialty') || 'Medicina General';
    // Fix: 'medicina-general' -> 'medicina general'
    let rawName = specialtyParam.replace(/-/g, ' ');

    // Normalize accents mapping
    const specialtyMap: Record<string, string> = {
        'psicologia': 'Psicología',
        'topico': 'Tópico',
        'medicina general': 'Medicina General',
        'obstetricia': 'Obstetricia',
        'dental': 'Dental',
        'emergencia': 'Emergencia'
    };

    // Use mapped name or fallback to Title Case roughly (or just raw for ilike)
    const specialtyName = specialtyMap[rawName.toLowerCase()] || rawName;
    const date = searchParams.get('date') || '2025-12-06';
    const time = searchParams.get('time') || '08:00 AM';

    const [loading, setLoading] = useState(false);
    const [patientId, setPatientId] = useState<string | null>(null);

    // Mock Patient Data (Updated from DB)
    const [patient, setPatient] = useState({
        firstName: 'Cargando...',
        lastName: '',
        dni: '12345678',
        insurance: '...',
        sex: '...',
        birthDate: '...',
        age: 0
    });

    useEffect(() => {
        const loadPatient = async () => {
            // Hardcoded DNI for prototype (Dynamic updated)
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';
            const { data, error } = await supabaseClient
                .from('patients')
                .select('*')
                .eq('dni', activeDni)
                .single();

            if (data) {
                setPatientId(data.id);
                setPatient({
                    firstName: data.first_name,
                    lastName: data.last_name,
                    dni: data.dni,
                    insurance: data.insurance_type || 'SIS',
                    sex: data.sex || 'MALE',
                    birthDate: data.birth_date,
                    age: new Date().getFullYear() - new Date(data.birth_date).getFullYear()
                });
            } else {
                console.error("Patient not found", error);
            }
        };
        loadPatient();
    }, []);

    const handleConfirm = async () => {
        console.log("🔵 Iniciando Confirmación...");

        if (!patientId) {
            alert("Error: No se identificó al paciente (ID nulo). Espere a que carguen los datos.");
            return;
        }
        setLoading(true);
        try {
            console.log("🔍 Buscando especialidad:", specialtyName);

            // 1. Find Specialty ID
            const { data: specData, error: specError } = await supabaseClient
                .from('specialties')
                .select('id, name')
                .ilike('name', `%${specialtyName}%`)
                .limit(1)
                .single();

            if (specError || !specData) {
                console.error("❌ Error especialidad:", specError);
                throw new Error(`Especialidad '${specialtyName}' no encontrada.`);
            }
            console.log("✅ Especialidad encontrada:", specData);

            // 2. Assign Doctor (Random active doctor for now)
            const { data: docData, error: docError } = await supabaseClient
                .from('doctors')
                .select('id')
                .eq('specialty_id', specData.id)
                .limit(1)
                .single();

            if (docError || !docData) {
                console.error("❌ Error doctor:", docError);
                throw new Error("No hay doctores disponibles para esta especialidad.");
            }
            console.log("✅ Doctor asignado:", docData.id);

            // 3. Create Appointment
            // Combine Date and Time into ISO string
            // Assuming time is "08:00 AM" formatting
            const [timePart, modifier] = time.split(' ');
            let [hours, minutes] = timePart.split(':');
            if (hours === '12') hours = '00';
            if (modifier === 'PM') hours = String(parseInt(hours, 10) + 12);

            const isoDateTime = `${date}T${hours.padStart(2, '0')}:${minutes}:00`;

            const { error: insertError } = await supabaseClient
                .from('appointments')
                .insert({
                    patient_id: patientId,
                    doctor_id: docData.id,
                    date_time: isoDateTime,
                    status: 'PENDING',
                    reason: 'Reserva Web Debug'
                });

            if (insertError) {
                console.error("❌ Error insert:", insertError);
                throw insertError;
            }

            console.log("✅ Cita insertada correctamente!");
            alert("¡Cita Confirmada Exitosamente!");
            navigate('/cliente/citas');

        } catch (error: any) {
            console.error("🚨 Booking Critical Error:", error);
            alert(`Error al reservar: ${error.message || JSON.stringify(error)}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

            {/* LEFT COLUMN: CITA EN PROCESO (User Info) */}
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-4 mb-2">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-slate-600" />
                    </button>
                    <div className="bg-slate-300 rounded-r-full pr-6 pl-4 py-2 flex items-center gap-2">
                        <span className="font-bold text-slate-700">1.</span>
                        <span className="font-bold text-slate-800 uppercase tracking-wide text-sm">CITA EN PROCESO</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-4 right-4 text-slate-300">
                        <User size={64} strokeWidth={1} />
                    </div>

                    <form className="space-y-4 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Paciente</label>
                            <input
                                type="text"
                                value={`${patient.firstName} ${patient.lastName}`}
                                readOnly
                                className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-slate-700 font-medium focus:ring-0"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">DNI</label>
                            <input
                                type="text"
                                value={patient.dni}
                                readOnly
                                className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-slate-700 font-medium focus:ring-0"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Seguro</label>
                            <input
                                type="text"
                                value={patient.insurance}
                                readOnly
                                className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-slate-700 font-medium focus:ring-0"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Sexo</label>
                                <input
                                    type="text"
                                    value={patient.sex}
                                    readOnly
                                    className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-slate-700 font-medium focus:ring-0"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Edad</label>
                                <input
                                    type="text"
                                    value={`${patient.age} años`}
                                    readOnly
                                    className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-slate-700 font-medium focus:ring-0"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Centro de Salud</label>
                            <div className="w-full bg-slate-200 border-none rounded-lg px-4 py-3 text-slate-800 font-bold focus:ring-0 text-center uppercase tracking-wide">
                                "Los Licenciados"
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Especialidad Seleccionada</label>
                            <input
                                type="text"
                                value={specialtyParam.replace(/-/g, ' ').toUpperCase()}
                                readOnly
                                className="w-full bg-slate-100 border-none rounded-lg px-4 py-3 text-slate-700 font-bold focus:ring-0"
                            />
                        </div>
                    </form>

                    {/* Heartbeat Decorative Line */}
                    <div className="mt-8 opacity-20 h-12 w-full pointer-events-none">
                        <svg viewBox="0 0 500 150" className="w-full h-full text-slate-800 fill-none stroke-current stroke-2">
                            <path d="M0,75 L150,75 L160,40 L180,110 L200,20 L220,130 L240,75 L500,75" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: FECHA DISPONIBLE (Appointment Info) */}
            <div className="flex-1 space-y-6">
                <div className="bg-slate-300 rounded-r-full pr-6 pl-4 py-2 flex items-center gap-2 w-fit mb-8">
                    <span className="font-bold text-slate-700">2.</span>
                    <span className="font-bold text-slate-800 uppercase tracking-wide text-sm">FECHA DISPONIBLE</span>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-slate-100 relative">
                    <div className="absolute top-4 right-4 text-slate-300">
                        <Calendar size={64} strokeWidth={1} />
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Fecha</label>
                            <div className="bg-slate-100 rounded-lg px-4 py-4 flex items-center gap-3">
                                <Calendar className="text-sky-600" size={24} />
                                <span className="text-lg font-bold text-slate-800">{date}</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1 ml-1">Turno / Hora</label>
                            <div className="bg-slate-100 rounded-lg px-4 py-4 flex items-center gap-3">
                                <Clock className="text-orange-500" size={24} />
                                <span className="text-lg font-bold text-slate-800">{time}</span>
                            </div>
                        </div>

                        <div className="pt-8">
                            <Button
                                onClick={handleConfirm}
                                disabled={loading}
                                className="w-full h-14 text-lg font-bold bg-sky-600 hover:bg-sky-700 text-white shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" /> Procesando...
                                    </>
                                ) : (
                                    "CONFIRMAR CITA"
                                )}
                            </Button>
                            <p className="text-center text-xs text-slate-400 mt-4">
                                Al confirmar, aceptas las políticas de privacidad del centro de salud.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
