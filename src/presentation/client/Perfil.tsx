
import React from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, MapPin, Calendar, Heart, Shield, Users, PlusCircle, Edit3, Settings, Activity } from 'lucide-react';
import { supabaseClient } from '../../infrastructure/db/client';

export const Perfil: React.FC = () => {
    const [patient, setPatient] = React.useState<any>(null);
    const [children, setChildren] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    // Editable State
    const [phone, setPhone] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [saving, setSaving] = React.useState(false);

    React.useEffect(() => {
        const fetchProfile = async () => {
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';
            const { data: pData } = await supabaseClient.from('patients').select('*').eq('dni', activeDni).single();
            if (pData) {
                const birth = new Date(pData.birth_date);
                const age = new Date().getFullYear() - birth.getFullYear();
                setPatient({ ...pData, age, formattedBirth: birth.toLocaleDateString() });

                // Set editable fields
                setPhone(pData.phone || '');
                setAddress(pData.address || '');

                // Fetch children if main user
                if (activeDni === '12345678') {
                    const { data: kids } = await supabaseClient.from('patients').select('*').eq('parent_id', pData.id);
                    if (kids) setChildren(kids);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSaveProfile = async () => {
        if (!patient) return;
        setSaving(true);
        try {
            const { error } = await supabaseClient
                .from('patients')
                .update({ phone, address })
                .eq('id', patient.id);

            if (error) throw error;
            alert("✅ Perfil actualizado correctamente");
        } catch (err) {
            console.error("Error updating profile", err);
            alert("❌ Error al guardar datos");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-teal-600 font-medium tracking-wide">Cargando perfil...</div>;
    if (!patient) return <div className="p-10 text-center text-slate-400">Error al cargar perfil</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 pb-12 w-full max-w-6xl mx-auto">
            {/* Header Title */}
            <div className="flex items-center gap-4 mb-8 pt-4">
                <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                    <span className="bg-teal-50 p-2 rounded-xl text-teal-600 border border-teal-100">
                        <User size={24} strokeWidth={1.5} />
                    </span>
                    <span className="font-bold text-teal-900">Mi Expediente</span>
                    <span className="text-slate-300 text-2xl font-thin">/</span>
                    <span className="text-slate-500 text-lg">Perfil Digital</span>
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Column: Personal Info */}
                <div className="lg:w-2/3 space-y-6">
                    <div className="glass-card rounded-[2.5rem] overflow-hidden shadow-xl shadow-teal-900/5 border border-white/50 relative">
                        {/* ID Card Header */}
                        <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                <User size={250} strokeWidth={0.5} />
                            </div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                                <div className="relative group">
                                    <div className="w-32 h-32 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white text-4xl font-light border-4 border-white/20 shadow-2xl transition-transform group-hover:scale-105">
                                        {patient.first_name[0]}{patient.last_name[0]}
                                    </div>
                                    <button className="absolute bottom-0 right-0 bg-white text-teal-600 p-2 rounded-full shadow-lg hover:bg-teal-50 transition-colors">
                                        <Edit3 size={16} />
                                    </button>
                                </div>
                                <div className="text-center md:text-left pt-2">
                                    <h2 className="text-3xl font-bold tracking-tight mb-2">{patient.first_name} {patient.last_name}</h2>
                                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                                        <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/10 flex items-center gap-2">
                                            <Shield size={12} /> DNI: {patient.dni}
                                        </span>
                                        <span className="bg-teal-900/40 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-white/5 text-teal-100 flex items-center gap-2">
                                            <Heart size={12} /> {patient.insurance_type || 'SIS'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Body */}
                        <div className="p-8 md:p-12 bg-white/60 backdrop-blur-3xl">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/60">
                                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-widest flex items-center gap-2">
                                    <Settings size={16} className="text-teal-500" /> Datos Personales
                                </h3>
                                <Button variant="ghost" size="sm" className="text-xs text-teal-600 hover:bg-teal-50 hover:text-teal-700 font-bold">
                                    Solicitar Corrección
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Name */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nombre Completo</label>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm flex items-center gap-3">
                                        <User size={18} className="text-slate-300" />
                                        {patient.first_name} {patient.last_name}
                                    </div>
                                </div>

                                {/* DNI & Birth */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">DNI</label>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm flex items-center gap-3">
                                        <Shield size={18} className="text-slate-300" />
                                        {patient.dni}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Fecha Nacimiento</label>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm flex items-center gap-3">
                                        <Calendar size={18} className="text-slate-300" />
                                        {patient.formattedBirth}
                                    </div>
                                </div>

                                {/* Sex & Age (NEW) */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Sexo</label>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm flex items-center gap-3">
                                        <Users size={18} className="text-slate-300" />
                                        {patient.sex === 'MALE' ? 'Masculino' : patient.sex === 'FEMALE' ? 'Femenino' : 'No Especificado'}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Edad</label>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm flex items-center gap-3">
                                        <Activity size={18} className="text-slate-300" />
                                        {patient.age} años
                                    </div>
                                </div>

                                {/* Health Center (NEW) */}
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-teal-600 uppercase tracking-wider ml-1">Centro de Salud Asignado</label>
                                    <div className="p-3 bg-teal-50 border border-teal-100 rounded-xl text-teal-800 font-bold shadow-sm flex items-center gap-3">
                                        <MapPin size={18} className="text-teal-500" />
                                        "Los Licenciados"
                                    </div>
                                </div>

                                {/* Contact Info (EDITABLE) */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Teléfono</label>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm flex items-center gap-3 group focus-within:ring-2 ring-teal-500/20 focus-within:border-teal-400 transition-all">
                                        <Phone size={18} className="text-slate-300 group-focus-within:text-teal-500" />
                                        <input
                                            type="text"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="bg-transparent border-none focus:ring-0 w-full p-0 text-sm font-semibold text-slate-700 placeholder:text-slate-300 outline-none"
                                            placeholder="Sin registrar"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Dirección</label>
                                    <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold shadow-sm flex items-center gap-3 group focus-within:ring-2 ring-teal-500/20 focus-within:border-teal-400 transition-all">
                                        <MapPin size={18} className="text-slate-300 group-focus-within:text-teal-500" />
                                        <input
                                            type="text"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            className="bg-transparent border-none focus:ring-0 w-full p-0 text-sm font-semibold text-slate-700 placeholder:text-slate-300 outline-none"
                                            placeholder="Sin registrar"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex justify-end">
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={saving}
                                    className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl px-8 py-3 shadow-lg shadow-teal-500/20 transition-all font-bold tracking-wide text-sm hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Family & Status */}
                <div className="lg:w-1/3 space-y-6">

                    {/* Quick Stats */}
                    <div className="glass-card p-8 rounded-[2rem] border border-white/60 shadow-lg shadow-slate-200/50">
                        <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-widest text-xs flex items-center gap-2 border-b border-slate-100 pb-4">
                            <Activity size={16} className="text-teal-500" /> Estado de Salud
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-rose-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-rose-100">
                                <Heart size={24} className="text-rose-400 mb-2" strokeWidth={1.5} />
                                <span className="text-2xl font-black text-rose-600">O+</span>
                                <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider mt-1">Sanguíneo</span>
                            </div>
                            <div className="bg-emerald-50 rounded-2xl p-4 flex flex-col items-center justify-center border border-emerald-100">
                                <Shield size={24} className="text-emerald-500 mb-2" strokeWidth={1.5} />
                                <span className="text-xs font-black text-emerald-600 bg-emerald-200/50 px-3 py-1 rounded-full uppercase tracking-widest">Activo</span>
                                <span className="text-[10px] text-emerald-500 uppercase font-bold tracking-wider mt-2">Estado</span>
                            </div>
                        </div>
                    </div>

                    {/* Family Members */}
                    {children.length > 0 && (
                        <div className="glass-card p-8 rounded-[2rem] border border-white/60 shadow-lg shadow-purple-900/5 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide text-xs">
                                    <Users className="text-purple-500" size={18} strokeWidth={1.5} />
                                    Mis Familiares
                                </h3>
                                <span className="text-[10px] bg-purple-50 text-purple-600 border border-purple-100 px-2 py-0.5 rounded-full font-bold">
                                    {children.length}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6 relative z-10">
                                {children.map(child => (
                                    <div key={child.id} className="flex items-center gap-3 p-3 bg-white/80 rounded-xl hover:bg-white transition-all cursor-pointer border border-transparent hover:border-purple-100 shadow-sm hover:shadow-md group">
                                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-xs border border-purple-200 group-hover:scale-105 transition-transform">
                                            {child.first_name[0]}{child.last_name[0]}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-700 group-hover:text-purple-700 truncate transition-colors">{child.first_name} {child.last_name}</p>
                                            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Hijo/a • {new Date().getFullYear() - new Date(child.birth_date).getFullYear()} años</p>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-purple-400" />
                                    </div>
                                ))}
                            </div>

                            <Button onClick={() => window.location.href = '/cliente/familiares'} className="relative z-10 w-full border border-dashed border-slate-300 bg-transparent text-slate-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl py-3 text-sm font-bold transition-all flex items-center justify-center gap-2">
                                <PlusCircle size={16} />
                                Gestionar Familia
                            </Button>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

// Start of Imports Hack (ChevronRight was missing in imports)
import { ChevronRight } from 'lucide-react';
