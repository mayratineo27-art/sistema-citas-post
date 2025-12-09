
import React, { useState, useEffect } from 'react';
import { Users, Plus, Calendar, User, Baby, X, Save, Shield } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { supabaseClient } from '../../infrastructure/db/client';
import { useNavigate } from 'react-router-dom';

export const Familiares: React.FC = () => {
    const navigate = useNavigate();
    const [familiares, setFamiliares] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [parentId, setParentId] = useState<string | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dni: '',
        birthDate: '',
        sex: 'MALE'
    });
    const [saving, setSaving] = useState(false);

    const fetchFamiliares = async () => {
        try {
            const activeDni = localStorage.getItem('activePatientDni') || '12345678';
            // Always assume 12345678 is the parent for this prototype if activeDni is just the child
            // But actually we need the *Real* parent ID.
            // Let's assume the logged in session user is the parent.
            // For now, we fetch the parent by the HARDCODED parent DNI '12345678'
            const parentDni = '12345678';

            const { data: parent } = await supabaseClient.from('patients').select('id').eq('dni', parentDni).single();

            if (parent) {
                setParentId(parent.id);
                const { data } = await supabaseClient
                    .from('patients')
                    .select('*')
                    .eq('parent_id', parent.id);

                if (data) setFamiliares(data);
            }
        } catch (error) {
            console.error("Error fetching relatives", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFamiliares();
    }, []);

    const handleAgendar = (childDni: string, childName: string) => {
        localStorage.setItem('activePatientDni', childDni);
        window.location.href = '/cliente/reservar';
    };

    const handleSaveChild = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!parentId) {
            alert("Error: No se identificó al padre. Intenta recargar.");
            return;
        }
        setSaving(true);
        try {
            // Basic Validation
            if (formData.dni.length !== 8) {
                alert("El DNI debe tener 8 dígitos");
                setSaving(false);
                return;
            }

            // Insert Child
            const { data, error } = await supabaseClient.from('patients').insert({
                first_name: formData.firstName,
                last_name: formData.lastName,
                dni: formData.dni,
                birth_date: formData.birthDate,
                sex: formData.sex,
                parent_id: parentId,
                insurance_type: 'SIS' // Default
            }).select();

            if (error) {
                console.error("Supabase Insert Error:", error);
                throw error;
            }

            // Success
            setShowModal(false);
            setFormData({ firstName: '', lastName: '', dni: '', birthDate: '', sex: 'MALE' });
            fetchFamiliares(); // Refresh list
            alert("Familiar agregado correctamente");

        } catch (error: any) {
            console.error("Error saving child:", error);
            alert(`Error al guardar: ${error.message || JSON.stringify(error)}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 relative">

            {/* MODAL IS NOW INLINED TO PREVENT FOCUS LOSS */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 border border-white/50">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-6 text-white flex justify-between items-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                                <Baby size={150} />
                            </div>
                            <h2 className="text-xl font-bold flex items-center gap-2 relative z-10">
                                <Plus size={24} /> Agregar Menor
                            </h2>
                            <button onClick={() => setShowModal(false)} className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors relative z-10">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSaveChild} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Nombre</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.firstName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
                                        placeholder="Ej. Juan"
                                    />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Apellido</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
                                        placeholder="Ej. Perez"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">DNI del Menor</label>
                                    <div className="relative">
                                        <Shield className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                        <input
                                            required
                                            type="text"
                                            maxLength={8}
                                            value={formData.dni}
                                            onChange={(e) => setFormData(prev => ({ ...prev, dni: e.target.value.replace(/\D/g, '') }))}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
                                            placeholder="8 dígitos"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Fecha Nacimiento</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase ml-1 block mb-1">Sexo</label>
                                <div className="flex gap-4">
                                    <label className={`flex-1 border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${formData.sex === 'MALE' ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        <input type="radio" name="sex" className="hidden" onClick={() => setFormData(prev => ({ ...prev, sex: 'MALE' }))} />
                                        Masculino
                                    </label>
                                    <label className={`flex-1 border rounded-xl p-3 flex items-center justify-center gap-2 cursor-pointer transition-all ${formData.sex === 'FEMALE' ? 'bg-purple-50 border-purple-500 text-purple-700 font-bold' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
                                        <input type="radio" name="sex" className="hidden" onClick={() => setFormData(prev => ({ ...prev, sex: 'FEMALE' }))} />
                                        Femenino
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button disabled={saving} className="w-full h-14 text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xl hover:shadow-purple-500/20 transition-all rounded-xl">
                                    {saving ? 'Guardando...' : 'Guardar Familiar'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Header Card */}
            <div className="bg-white rounded-[2.5rem] p-8 mb-8 shadow-xl shadow-slate-200 border border-slate-100 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                        <Users className="text-purple-600" size={32} />
                        MIS FAMILIARES
                    </h1>
                </div>
                <div className="bg-purple-100 text-purple-700 px-6 py-2 rounded-2xl font-black text-sm uppercase tracking-widest shadow-sm">
                    {familiares.length} Asignados
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
            ) : (
                <div className="grid gap-6 max-w-xl mx-auto">
                    {familiares.map((child) => {
                        const age = new Date().getFullYear() - new Date(child.birth_date).getFullYear();

                        return (
                            <Card key={child.id} className="p-6 border-0 shadow-lg shadow-purple-100 hover:shadow-xl transition-all ring-1 ring-slate-100 rounded-3xl group bg-gradient-to-br from-white to-purple-50/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-5">
                                        <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-inner group-hover:scale-110 transition-transform duration-300">
                                            <span className="font-black text-xl tracking-tighter">
                                                {child.first_name[0]}{child.last_name[0]}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 leading-tight">
                                                {child.first_name} <br /> <span className="text-purple-700">{child.last_name}</span>
                                            </h3>
                                            <div className="text-sm font-medium text-slate-400 mt-1 flex items-center gap-2">
                                                <Baby size={14} />
                                                Hijo • {age} años
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleAgendar(child.dni, child.first_name)}
                                        className="bg-white hover:bg-purple-50 text-purple-600 border-2 border-purple-100 hover:border-purple-200 h-14 w-14 rounded-2xl p-0 flex items-center justify-center shadow-sm transition-all"
                                        title="Agendar Cita para este familiar"
                                    >
                                        <Calendar size={24} />
                                    </Button>
                                </div>
                            </Card>
                        )
                    })}

                    {/* Add New Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50/50 transition-all group"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-50 group-hover:bg-white flex items-center justify-center transition-colors">
                            <Plus size={24} />
                        </div>
                        <span className="font-bold text-sm tracking-widest uppercase">Agregar Menor</span>
                    </button>

                    <p className="text-center text-xs text-slate-400 mt-2 max-w-xs mx-auto">
                        Solo puedes agregar a menores de edad bajo tu tutela legal.
                    </p>
                </div>
            )}
        </div>
    );
};
