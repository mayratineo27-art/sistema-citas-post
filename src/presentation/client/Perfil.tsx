import React from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { User, Mail, Phone, MapPin, Calendar, Heart, Shield, Users, PlusCircle } from 'lucide-react';

import { supabaseClient } from '../../infrastructure/db/client';

export const Perfil: React.FC = () => {
    const [patient, setPatient] = React.useState<any>(null);
    const [children, setChildren] = React.useState<any[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchProfile = async () => {
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';
            // 1. Fetch Patient Data
            const { data: pData } = await supabaseClient.from('patients').select('*').eq('dni', activeDni).single();
            if (pData) {
                // Format dates/age
                const birth = new Date(pData.birth_date);
                const age = new Date().getFullYear() - birth.getFullYear();
                setPatient({ ...pData, age, formattedBirth: birth.toLocaleDateString() });

                // 2. Fetch Children (Only if current user is Parent, or maybe simply all linked to Parnet?)
                // Logic: If current user is Parent (12345678), fetch children.
                // If current user is Child, maybe show siblings? Or nothing?
                // For now, let's just fetch children of the "Main User" always, or 
                // if this patient has children.
                // Let's assume we want to show "Mis Familiares" only if active profile is Parent.
                if (activeDni === '12345678') {
                    const { data: kids } = await supabaseClient.from('patients').select('*').eq('parent_id', pData.id);
                    if (kids) setChildren(kids);
                }
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    if (loading) return <div className="p-10 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div></div>;
    if (!patient) return <div>Error al cargar perfil</div>;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
            <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                <div className="bg-sky-100 p-2 rounded-xl text-sky-600">
                    <User size={28} />
                </div>
                Mi Expediente Digital
            </h1>

            <div className="flex flex-col lg:flex-row gap-8">

                {/* Left Column: Personal Info (Matches Prototype) */}
                <div className="lg:w-2/3 space-y-8">
                    <Card className="p-0 overflow-hidden border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-[2rem]">
                        <div className="bg-gradient-to-r from-sky-600 to-sky-500 p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                <User size={200} />
                            </div>
                            <div className="relative z-10">
                                <div className="w-28 h-28 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white text-4xl font-black mx-auto mb-4 border-4 border-white/30 shadow-xl">
                                    {patient.first_name[0]}{patient.last_name[0]}
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{patient.first_name} {patient.last_name}</h2>
                                <p className="text-sky-100 font-medium tracking-wide mt-1 bg-sky-700/30 inline-block px-4 py-1 rounded-full text-sm">DNI: {patient.dni}</p>
                            </div>
                        </div>

                        <div className="p-8 md:p-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold text-slate-700 text-lg flex items-center gap-2 uppercase tracking-wide">
                                    <div className="w-1 h-6 bg-sky-500 rounded-full"></div>
                                    Datos del Paciente
                                </h3>
                                <Button variant="outline" size="sm" className="text-xs rounded-full border-slate-200 hover:bg-slate-50 hover:text-sky-600 hover:border-sky-200 transition-colors">
                                    Solicitar Corrección
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 text-sm">
                                <Input label="Nombre y Apellidos" defaultValue={`${patient.first_name} ${patient.last_name}`} disabled className="bg-slate-50 border-slate-200 focus:ring-0 text-slate-700 font-semibold" />
                                <Input label="DNI" defaultValue={patient.dni} disabled className="bg-slate-50 border-slate-200 focus:ring-0 text-slate-700 font-semibold" />
                                <div className="md:col-span-2 grid grid-cols-2 gap-8">
                                    <Input label="Seguro" defaultValue={patient.insurance_type || 'SIS'} disabled className="font-bold text-emerald-700 bg-emerald-50 border-emerald-100" />
                                    <Input label="Sexo" defaultValue={patient.sex || 'No Especificado'} disabled className="bg-slate-50 border-slate-200 focus:ring-0 text-slate-700 font-semibold" />
                                </div>
                                <Input label="Fecha de Nacimiento" type="text" defaultValue={patient.formattedBirth} disabled className="bg-slate-50 border-slate-200 focus:ring-0 text-slate-500" />
                                <Input label="Edad" defaultValue={`${patient.age} años`} disabled className="bg-slate-50 border-slate-200 focus:ring-0 text-slate-500" />
                                <Input label="Número de Contacto" defaultValue={patient.phone || ''} className="bg-white border-slate-300 focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all text-slate-800 font-medium" />
                                <Input label="Dirección" defaultValue={patient.address || ''} className="bg-white border-slate-300 focus:ring-2 focus:ring-sky-100 focus:border-sky-400 transition-all text-slate-800 font-medium" />
                            </div>

                            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
                                <Button className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl px-6 py-2 shadow-lg hover:shadow-sky-500/30 transition-all font-bold tracking-wide">
                                    Guardar Cambios
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Column: Family & Status */}
                <div className="lg:w-1/3 space-y-8">

                    {/* Family Members Section (Only show if children exist) */}
                    {children.length > 0 && (
                        <Card className="p-8 border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-[2rem] bg-gradient-to-br from-white to-purple-50/30">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wide text-sm">
                                    <Users className="text-purple-500" size={20} />
                                    Mis Familiares
                                </h3>
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-3 py-1 rounded-full font-black uppercase tracking-widest">
                                    {children.length} Asignados
                                </span>
                            </div>

                            <div className="space-y-4 mb-8">
                                {children.map(child => (
                                    <div key={child.id} className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:bg-purple-50 transition-colors cursor-pointer border border-slate-100 shadow-sm group">
                                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-purple-200 group-hover:scale-110 transition-all">
                                            {child.first_name[0]}{child.last_name[0]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-800 group-hover:text-purple-700 transition-colors">{child.first_name}</p>
                                            <p className="text-xs text-slate-400 font-medium">Hijo/a</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-white rounded-full">
                                            <Calendar size={16} className="text-slate-300 group-hover:text-purple-400" />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <Button onClick={() => window.location.href = '/cliente/familiares'} className="w-full border-2 border-dashed border-slate-200 bg-transparent text-slate-500 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl py-3 font-bold transition-all">
                                <PlusCircle size={18} className="mr-2" />
                                Gestionar Familia
                            </Button>
                            <p className="text-[10px] text-slate-400 mt-4 text-center leading-relaxed">
                                Solo puedes agregar a menores de edad bajo tu tutela legal.
                            </p>
                        </Card>
                    )}

                    {/* Quick Stats */}
                    <Card className="p-8 border-0 shadow-[0_4px_20px_rgba(0,0,0,0.05)] rounded-[2rem]">
                        <h3 className="font-bold text-slate-800 mb-6 uppercase tracking-wide text-sm flex items-center gap-2">
                            <div className="w-1 h-4 bg-slate-300 rounded-full"></div>
                            Resumen Rápido
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                                <span className="text-slate-500 flex items-center gap-3 font-medium">
                                    <Heart size={18} className="text-red-400" /> Tipo Sangre
                                </span>
                                <span className="font-black text-slate-700 bg-white px-3 py-1 rounded-lg border border-slate-100">O+</span>
                            </li>
                            <li className="flex justify-between items-center text-sm p-3 bg-slate-50 rounded-xl">
                                <span className="text-slate-500 flex items-center gap-3 font-medium">
                                    <Shield size={18} className="text-green-500" /> Estado
                                </span>
                                <span className="text-green-700 font-bold text-[10px] bg-green-100 px-3 py-1 rounded-full uppercase tracking-wider">Activo</span>
                            </li>
                        </ul>
                    </Card>

                </div>
            </div>
        </div>
    );
};
