import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { ChevronLeft, User, Calendar, Clock, Loader2, MapPin, Shield, CheckCircle, AlertCircle, PartyPopper } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabaseClient } from '../../infrastructure/db/client';

export const BookingConfirmation: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Get params from URL
    const specialtyParam = searchParams.get('specialty') || 'Medicina General';
    let rawName = specialtyParam.replace(/-/g, ' ');

    // Normalize accents mapping
    const specialtyMap: Record<string, string> = {
        'psicologia': 'Psicología',
        'topico': 'Tópico',
        'medicina general': 'Medicina General',
        'obstetricia': 'Obstetricia',
        'dental': 'Dental',
        'emergencia': 'Emergencia',
        'crecimiento y desarrollo': 'CRED (Crecimiento y Desarrollo)',
        'cres': 'CRED (Crecimiento y Desarrollo)'
    };

    const specialtyName = specialtyMap[rawName.toLowerCase()] || rawName;
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const time = searchParams.get('time') || '08:00 AM';

    // Fix Date Timezone Issue: Parse manually to ensure Local Time
    const [year, month, day] = date.split('-').map(Number);
    // Create date focusing on noon to avoid any edge case offsets, though for just display, manual formatting is safest.
    const displayDateObj = new Date(year, month - 1, day);

    const [loading, setLoading] = useState(false);
    const [patientId, setPatientId] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);
    const [ticketNumber, setTicketNumber] = useState<string>('');

    const [patient, setPatient] = useState({
        firstName: 'Cargando...',
        lastName: '',
        dni: '',
        insurance: '',
        sex: '',
        birthDate: '',
        age: 0
    });

    useEffect(() => {
        const loadPatient = async () => {
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';
            console.log("Loading patient for DNI:", activeDni);

            const { data, error } = await supabaseClient
                .from('patients')
                .select('*')
                .eq('dni', activeDni)
                .single();

            if (data) {
                console.log("Patient loaded:", data.id);
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
                alert("Error: No se pudo cargar el paciente. Verifique su conexión.");
            }
        };
        loadPatient();
    }, []);

    const handleConfirm = async () => {
        console.log("🔵 Iniciando Confirmación...");

        if (!patientId) {
            alert("Error: No se identificó al paciente. Recargue la página.");
            return;
        }
        setLoading(true);
        try {
            console.log("🔍 Buscando especialidad:", specialtyName);

            // 1. Find Specialty ID
            const { data: specData, error: specError } = await supabaseClient
                .from('specialties')
                .select('id, name')
                .ilike('name', `%${specialtyName}%`) // Fuzzy search
                .limit(1)
                .single();

            if (specError || !specData) {
                console.error("❌ Error especialidad:", specError);
                throw new Error(`La especialidad '${specialtyName}' no existe en la base de datos.`);
            }

            // 2. Assign Doctor (Random active doctor)
            const { data: docData, error: docError } = await supabaseClient
                .from('doctors')
                .select('id')
                .eq('specialty_id', specData.id)
                .limit(1)
                .single(); // Should pick one, or use maybeSingle if list

            if (docError || !docData) {
                console.warn("⚠️ No doctores específicos, buscando cualquiera disponible (Fallback mode)");
                // Validar si es porque no hay doctores o error de query
            }

            // Fallback: If no specific doctor found, try to find ANY doctor (Just for stability in prototypes, remove in prod)
            // Or better: Throw specific error
            const doctorId = docData?.id;

            if (!doctorId) {
                throw new Error("No hay doctores asignados a esta especialidad actualmente.");
            }

            // 3. Create Appointment Timestamp (UTC Conversion)
            const [timePart, modifier] = time.split(' ');
            let [hours, minutes] = timePart.split(':').map(Number);

            if (modifier === 'PM' && hours < 12) hours += 12;
            if (modifier === 'AM' && hours === 12) hours = 0;

            // Construct Local Date Object
            const [y, m, d] = date.split('-').map(Number);
            const bookingDate = new Date(y, m - 1, d, hours, minutes, 0);

            // Convert to UTC ISO String for DB storage
            // This ensures 08:30 AM Local -> 13:30 PM UTC (assuming UTC-5)
            // When retrieved, it converts back 13:30 UTC -> 08:30 AM Local
            const isoDateTime = bookingDate.toISOString();

            const payload = {
                patient_id: patientId,
                doctor_id: doctorId,
                date_time: isoDateTime,
                status: 'PENDING',
                reason: 'Reserva Web App'
            };

            console.log("🚀 Enviando Payload:", payload);

            const { error: insertError } = await supabaseClient
                .from('appointments')
                .insert(payload);

            if (insertError) {
                console.error("❌ Error Database Insert:", insertError);
                throw new Error(`Error de Base de Datos: ${insertError.message || insertError.details}`);
            }

            console.log("✅ Cita insertada correctamente!");

            // Generate ticket number (for UI feedback)
            const ticketNum = `T${Date.now().toString().slice(-8)}`;
            setTicketNumber(ticketNum);
            setShowSuccess(true);

            // Redirect after showing success (2.5 seconds)
            setTimeout(() => {
                navigate('/cliente/citas?success=true');
            }, 2500);

        } catch (error: any) {
            console.error("🚨 Booking Critical Error:", error);
            alert(`⛔ No se pudo guardar el ticket:\n\n${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24">

            {/* SUCCESS OVERLAY */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] p-12 max-w-md shadow-2xl shadow-teal-500/20 text-center animate-in zoom-in-95 duration-500">
                        <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                            <PartyPopper size={48} className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-3">¡Reserva Confirmada!</h2>
                        <p className="text-slate-600 mb-6">Tu cita médica ha sido registrada exitosamente en el sistema.</p>
                        <div className="bg-teal-50 border-2 border-teal-200 rounded-2xl p-4 mb-6">
                            <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-1">Número de Ticket</p>
                            <p className="text-2xl font-black text-teal-700">{ticketNumber}</p>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                            <span>Redirigiendo a Mis Visitas</span>
                            <Loader2 size={16} className="animate-spin" />
                        </div>
                    </div>
                </div>
            )}

            {/* HEADER MOBILE */}
            <div className="lg:hidden flex items-center gap-4 mb-4">
                <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm text-slate-600">
                    <ChevronLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-slate-800">Confirmar Cita (v2.1)</h1>
            </div>

            {/* LEFT COLUMN: Patient Card (REDESIGNED LIGHT) */}
            <div className="lg:w-1/2 space-y-6">
                {/* Step Indicator */}
                <div className="hidden lg:flex items-center gap-3 mb-2">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-800">
                        <ChevronLeft size={24} />
                    </button>
                    <div className="bg-teal-600 text-white px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase shadow-lg shadow-teal-500/20">
                        Paso Final (v2.1 Fix)
                    </div>
                    <span className="text-slate-400 font-medium">Verificación de Datos</span>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-white/60 relative group hover:shadow-teal-100 transition-all duration-500">
                    {/* ID Header - Light Gradient */}
                    <div className="bg-gradient-to-br from-slate-50 to-white p-8 relative overflow-hidden border-b border-slate-100">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <User size={150} className="text-teal-900" />
                        </div>
                        <div className="relative z-10">
                            <h2 className="text-xs font-bold text-teal-600 uppercase tracking-[0.2em] mb-4">Titular de la Cita</h2>
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center text-3xl font-bold text-teal-700 border border-teal-100 shadow-sm">
                                    {patient.firstName[0]}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 capitalize">{patient.firstName.toLowerCase()}</h3>
                                    <p className="text-slate-500 text-lg font-medium capitalize">{patient.lastName.toLowerCase()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Data Grid */}
                    <div className="p-8 space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">DNI</label>
                                <div className="font-bold text-slate-700 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl flex items-center gap-2">
                                    <Shield size={14} className="text-teal-500" /> {patient.dni || '...'}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Seguro</label>
                                <div className="font-bold text-slate-700 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
                                    {patient.insurance}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Sede</label>
                                <div className="font-bold text-slate-700 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl flex items-center gap-2">
                                    <MapPin size={14} className="text-red-500" /> Central
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Edad</label>
                                <div className="font-bold text-slate-700 bg-slate-50 border border-slate-100 px-3 py-2 rounded-xl">
                                    {patient.age} años
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
                                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-xs text-amber-800 leading-relaxed font-bold">
                                    IMPORTANTE: Acude 30 minutos antes para pasar por Triaje y signos vitales.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Ticket Preview */}
            <div className="lg:w-1/2">
                <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-teal-900/10 border border-teal-100 overflow-hidden relative group hover:-translate-y-1 transition-all duration-500"
                    style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cream-paper.png")' }}>

                    {/* Decorative Top */}
                    <div className="h-4 bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-500"></div>

                    <div className="p-8 md:p-10">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-xs font-black text-teal-600 uppercase tracking-widest mb-2">Nueva Reserva</h2>
                                <h3 className="text-3xl font-black text-slate-900 leading-none capitalize">{specialtyName.toLowerCase()}</h3>
                            </div>
                            <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600">
                                <Calendar size={24} strokeWidth={2} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="bg-teal-50 p-3 rounded-xl text-teal-700">
                                    <Calendar size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Fecha Programada</p>
                                    <p className="text-xl font-black text-slate-800 capitalize">
                                        {displayDateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="bg-teal-50 p-3 rounded-xl text-teal-700">
                                    <Clock size={24} />
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase">Hora Estimada</p>
                                    <p className="text-xl font-black text-slate-800">{time}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10">
                            <Button
                                onClick={handleConfirm}
                                disabled={loading || !patientId}
                                className="w-full h-16 bg-slate-900 hover:bg-teal-600 text-white rounded-2xl text-lg font-bold shadow-xl shadow-slate-900/20 hover:shadow-teal-500/30 transition-all flex items-center justify-center gap-3"
                            >
                                {loading ? (
                                    <> <Loader2 className="animate-spin" /> Generando Ticket... </>
                                ) : (
                                    <> Confirmar Reserva <CheckCircle size={20} /> </>
                                )}
                            </Button>
                            <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest font-bold">
                                Al confirmar aceptas las políticas del centro
                            </p>
                        </div>
                    </div>

                    {/* Ticket Cutout Effect */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-medical-pattern rounded-full shadow-inner border-r border-slate-200"></div>
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-medical-pattern rounded-full shadow-inner border-l border-slate-200"></div>
                </div>
            </div>
        </div>
    );
};

