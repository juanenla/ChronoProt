'use client';

import { useEffect, useState } from 'react';
import ResultCard from '@/components/results/ResultCard';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        // Fetch stats from API
        // Note: In real app, add auth header
        fetch('/api/admin/stats', {
            headers: {
                'Authorization': 'Bearer test-token' // Placeholder
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) setStats(data.stats);
            })
            .catch(err => console.error(err));
    }, []);

    if (!stats) return <div>Cargando estadísticas...</div>;

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Respuestas" value={stats.total} icon="📝" />
                <StatCard title="Últimas 24h" value={stats.last24h} icon="⏱️" />
                <StatCard title="Matutinos" value={stats.byChronotype.morning} icon="🌅" />
                <StatCard title="Vespertinos" value={stats.byChronotype.evening} icon="🌙" />
            </div>

            <ResultCard title="Distribución por Dieta" icon="🍎">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Object.entries(stats.byDiet).map(([diet, count]: any) => (
                        <div key={diet} className="flex justify-between items-center bg-gray-900 p-3 rounded">
                            <span className="capitalize">{diet}</span>
                            <span className="font-bold text-indigo-400">{count}</span>
                        </div>
                    ))}
                </div>
            </ResultCard>
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string, value: number, icon: string }) {
    return (
        <div className="card p-6 flex items-center justify-between">
            <div>
                <div className="text-gray-400 text-sm uppercase tracking-wider">{title}</div>
                <div className="text-3xl font-bold mt-1">{value}</div>
            </div>
            <div className="text-3xl">{icon}</div>
        </div>
    );
}
