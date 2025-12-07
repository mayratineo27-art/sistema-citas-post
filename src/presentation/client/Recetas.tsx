import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Search, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { supabaseClient } from '../../infrastructure/db/client';

export const Recetas: React.FC = () => {
    const [recetas, setRecetas] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Mock for now, replace with auth.user
    const patientDni = "12345678";

    useEffect(() => {
        fetchRecetas();
    }, []);

    const fetchRecetas = async () => {
        try {
            // In a real scenario, we would fetch from a 'prescriptions' table linked to appointments
            // For now, we'll try to fetch from 'details' or mock it since schema is simple
            const { data, error } = await supabaseClient
                .from('details')
                .select(`
                    id,
                    treatment,
                    notes,
                    created_at,
                    appointments (
                        date_time,
                        doctors (
                            firstName,
                            lastName,
                            specialties (name)
                        )
                    )
                `)
                //.eq('patient_dni', patientDni) // This would require joining patient table
                .limit(5);

            if (data) {
                setRecetas(data);
            }
        } catch (error) {
            console.error("Error fetching recipes", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600">
                    <FileText size={28} />
                </div>
                Mis Recetas Médicas
            </h1>

            {/* Search / Filter */}
            <div className="relative">
                <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                <input
                    type="text"
                    placeholder="Buscar por especialista o medicamento..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-400 transition-all font-medium text-slate-700"
                />
            </div>

            {loading ? (
                <div className="text-center py-12 text-slate-400">Cargando recetas...</div>
            ) : recetas.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-300">
                    <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <FileText size={32} />
                    </div>
                    <p className="text-slate-500 font-medium">No tienes recetas recientes.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {recetas.map((receta) => (
                        <Card key={receta.id} className="p-0 overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-emerald-50 p-2.5 rounded-lg text-emerald-600 font-bold text-xs uppercase tracking-wider">
                                            {receta.appointments?.doctors?.specialties?.name || "Medicina General"}
                                        </div>
                                        <span className="text-slate-400 text-xs font-semibold flex items-center gap-1">
                                            <Calendar size={12} />
                                            {new Date(receta.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="text-emerald-600 hover:bg-emerald-50 rounded-full px-3">
                                        Descargar PDF
                                    </Button>
                                </div>

                                <div className="mb-4">
                                    <h3 className="text-lg font-bold text-slate-800 mb-1">
                                        Dr. {receta.appointments?.doctors?.firstName} {receta.appointments?.doctors?.lastName}
                                    </h3>
                                    <p className="text-slate-500 text-sm">C.M.P. 12345</p>
                                </div>

                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Indicaciones / Medicamentos</h4>
                                    <p className="text-slate-700 font-medium leading-relaxed">
                                        {receta.treatment || "Paracetamol 500mg - 1 tableta cada 8 horas por 3 días.\nIbuprofeno 400mg - Si hay dolor."}
                                    </p>
                                </div>

                                {receta.notes && (
                                    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50">
                                        <p className="text-slate-600 text-xs italic">
                                            <span className="font-bold text-blue-500 not-italic mr-1">Nota:</span>
                                            {receta.notes}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};
