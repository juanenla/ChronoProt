'use client';

import { useEffect, useState } from 'react';
import ResultCard from '@/components/results/ResultCard';

interface Response {
    id: string;
    created_at: string;
    chronotype: string;
    diet: string;
    goal: string;
    experience: string;
}

export default function AdminResponses() {
    const [responses, setResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // TODO: Add auth header in real app
        fetch('/api/admin/responses?limit=50')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setResponses(data.data);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Respuestas de Usuarios</h1>
                <div className="text-sm text-gray-400">{responses.length} registros recientes</div>
            </div>

            <ResultCard title="Últimos Registros" icon="📋">
                {loading ? (
                    <div className="text-center py-8">Cargando...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b-2 border-gray-700 text-gray-400">
                                    <th className="p-3">Fecha</th>
                                    <th className="p-3">Cronotipo</th>
                                    <th className="p-3">Dieta</th>
                                    <th className="p-3">Objetivo</th>
                                    <th className="p-3">Experiencia</th>
                                </tr>
                            </thead>
                            <tbody>
                                {responses.map((r) => (
                                    <tr key={r.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                                        <td className="p-3">{new Date(r.created_at).toLocaleDateString()}</td>
                                        <td className="p-3 capitalize">{translate(r.chronotype)}</td>
                                        <td className="p-3 capitalize">{translateDiet(r.diet)}</td>
                                        <td className="p-3 capitalize">{translate(r.goal)}</td>
                                        <td className="p-3 capitalize">{translate(r.experience)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </ResultCard>
        </div>
    );
}

function translate(str: string) {
    const map: Record<string, string> = {
        morning: 'Matutino', intermediate: 'Intermedio', evening: 'Vespertino',
        hypertrophy: 'Hipertrofia', strength: 'Fuerza', both: 'Ambos',
        beginner: 'Principiante', advanced: 'Avanzado'
    };
    return map[str] || str;
}

function translateDiet(str: string) {
    const map: Record<string, string> = {
        omnivore: 'Omnívoro', vegetarian: 'Vegetariano', vegan: 'Vegano',
        intermittent: 'Ayuno Intermitente', keto: 'Keto'
    };
    return map[str] || str;
}
