
import React, { useState, useEffect } from 'react';
import { Users, Plus, Calendar, User, Baby } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabaseClient } from '../../infrastructure/db/client';
import { useNavigate } from 'react-router-dom';

export const Familiares: React.FC = () => {
    const navigate = useNavigate();
    const [familiares, setFamiliares] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFamiliares = async () => {
            try {
                // Get Current Parent ID (Main User)
                // For prototype, we assume the logged in user (or '12345678') is the Parent
                // In real app, we get auth.user() -> check if it's a parent
                const parentDni = '12345678';
                const { data: parent } = await supabaseClient.from('patients').select('id').eq('dni', parentDni).single();

                if (parent) {
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

        fetchFamiliares();
    }, []);

    const handleAgendar = (childDni: string, childName: string) => {
        // Switch profile logic implicitly? 
        // Or just navigate to Booking with a param? 
        // For consistency with the requested feature "Agendar Cita", we switch the active profile
        localStorage.setItem('activePatientDni', childDni);
        // Force a small delay or reload? Ideally reload needed for Layout to catch up, 
        // but maybe we just navigate and let the user see the change.
        // Better: Set item and navigate, then reload or notify Layout via event.
        // Simplest for prototype:
        window.location.href = '/cliente/reservar';
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
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
                        // Calculate Age
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

                    {/* Add New Button (Mock) */}
                    <button className="border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 text-slate-400 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50/50 transition-all group">
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
