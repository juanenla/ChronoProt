'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GeneratedPlan } from '@/lib/chrono-engine';
import ResultCard from '@/components/results/ResultCard';

export default function ResultsView() {
    const router = useRouter();
    const [plan, setPlan] = useState<GeneratedPlan | null>(null);

    useEffect(() => {
        // Retrieve plan from storage
        const stored = localStorage.getItem('chronopro_plan');
        if (!stored) {
            router.push('/');
            return;
        }
        setPlan(JSON.parse(stored));
    }, [router]);

    if (!plan) return <div className="min-h-screen flex items-center justify-center text-xl">Cargando tu plan personalizado...</div>;

    return (
        <div className="space-y-8">
            {/* 1. Profile Summary */}
            <ResultCard title="1. Perfil Detectado" icon="👤">
                <div className="flex flex-wrap gap-3">
                    <Badge icon="🕐" label={plan.profile.chronotypeLabel} />
                    <Badge icon="🏋️" label={`Entreno: ${plan.profile.trainingLabel}`} />
                    <Badge icon="📅" label={plan.profile.frequencyLabel} />
                    <Badge icon={plan.profile.dietIcon} label={plan.profile.dietLabel} />
                    <Badge icon="📊" label={plan.profile.experienceLabel} />
                    <Badge icon="🎯" label={plan.profile.goalLabel} />
                </div>
            </ResultCard>

            {/* 2. Creatine Timing */}
            <ResultCard title="2. Timing Óptimo de Creatina" icon="⏰">
                <div className="space-y-6">
                    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-lg p-5">
                        <h4 className="font-bold mb-3 text-indigo-300">📍 Días de Entrenamiento ({plan.timing.trainingDays.range})</h4>
                        <div className="flex gap-4 items-start">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <div className="font-semibold text-lg text-white">Creatina: {plan.timing.trainingDays.creatine}</div>
                                <div className="text-indigo-200 mt-1">{plan.timing.trainingDays.protein}</div>
                            </div>
                        </div>
                        <p className="text-gray-400 mt-3 text-sm italic">{plan.timing.trainingDays.rationale}</p>
                    </div>

                    <div className="bg-gray-800/40 rounded-lg p-5">
                        <h4 className="font-bold mb-3 text-gray-300">couch Días de Descanso</h4>
                        <div className="flex gap-4 items-start">
                            <span className="text-2xl">⚡</span>
                            <div>
                                <div className="font-semibold text-gray-200">{plan.timing.restDays}</div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-700">
                        <h4 className="font-bold mb-4">🥗 Distribución Proteica ({plan.profile.chronotypeLabel.split(' ')[0]})</h4>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <MetricBox title="Desayuno" value={`${plan.timing.proteinDistribution.breakfast}%`} />
                            <MetricBox title="Almuerzo" value={`${plan.timing.proteinDistribution.lunch}%`} />
                            <MetricBox title="Cena" value={`${plan.timing.proteinDistribution.dinner}%`} />
                        </div>
                        <p className="text-sm text-gray-400 mt-4 text-center">{plan.timing.proteinDistribution.note}</p>
                    </div>
                </div>
            </ResultCard>

            {/* 3. Chronobiology Science */}
            <ResultCard title="3. Ciencia Cronobiológica" icon="🧬" className="border-l-4 border-l-purple-500">
                <div className="space-y-6">
                    <p className="text-gray-300">
                        Tu cronotipo determina las ventanas óptimas de consumo proteico basado en ritmos circadianos
                        de actividad mTORC1, secreción hormonal y sensibilidad insulínica.
                    </p>

                    <div className="grid md:grid-cols-2 gap-4">
                        {plan.science.circadianFacts.map((fact, i) => (
                            <div key={i} className="bg-gray-800 p-3 rounded flex gap-3 text-sm">
                                <span>🔹</span>
                                <span>{fact}</span>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gradient-to-r from-purple-900/30 to-indigo-900/30 p-5 rounded-lg border border-purple-500/20">
                        <h4 className="font-bold text-purple-300 mb-2">⚡ Ventana Anabólica Real</h4>
                        <p className="text-gray-300 text-sm">
                            Meta-análisis actual indica que la ventana anabólica se extiende a <strong>{plan.science.anabolicWindow}</strong>.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold mb-3">💪 Umbral de Leucina</h4>
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <MetricBox title="Jóvenes (<40)" value={plan.science.leucineThreshold.young} subtitle="para activar mTORC1" />
                            <MetricBox title="Adultos (>40)" value={plan.science.leucineThreshold.older} subtitle="requieren mayor dosis" />
                        </div>
                    </div>
                </div>
            </ResultCard>

            {/* 4. Protein Absorption */}
            <ResultCard title="4. Velocidad de Absorción" icon="⚗️">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-700 text-gray-400 text-sm">
                                <th className="p-3">Tipo</th>
                                <th className="p-3 text-center">Absorción</th>
                                <th className="p-3 text-center">Pico AA</th>
                                <th className="p-3">Uso Óptimo</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {plan.absorption.map((item, i) => (
                                <tr key={i} className="border-b border-gray-800">
                                    <td className="p-3 font-medium">
                                        <span className="mr-2">{item.icon}</span> {item.name}
                                    </td>
                                    <td className="p-3 text-center text-gray-400">{item.rate}</td>
                                    <td className="p-3 text-center text-gray-400">{item.peak}</td>
                                    <td className="p-3 text-indigo-300">{item.optimalUse}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </ResultCard>

            {/* 5. Timeline */}
            <ResultCard title="5. Ejemplo de Día Completo" icon="📅">
                <div className="timeline pl-6 border-l-2 border-indigo-900/50 space-y-8 ml-3">
                    {plan.timeline.map((item, i) => (
                        <div key={i} className={`relative ${item.highlight ? 'bg-indigo-900/20 p-4 rounded-r border-l-4 border-indigo-500 -ml-[26px] pl-6' : ''}`}>
                            {!item.highlight && (
                                <div className="absolute -left-[31px] top-1 w-3 h-3 bg-gray-600 rounded-full border-2 border-gray-900"></div>
                            )}
                            <div className="font-mono text-indigo-400 font-bold mb-1">{item.time}</div>
                            <div className="font-bold text-lg">{item.action}</div>
                            <div className="text-sm text-gray-400 mt-1" dangerouslySetInnerHTML={{ __html: item.detail }} />
                        </div>
                    ))}
                </div>
            </ResultCard>

            <div className="flex gap-4">
                <button onClick={() => router.push('/')} className="flex-1 btn-secondary text-center">
                    ← Modificar Perfil
                </button>
                <button onClick={() => window.print()} className="flex-1 btn-primary text-center">
                    🖨️ Guardar PDF
                </button>
            </div>
        </div>
    );
}

function Badge({ icon, label }: { icon: string; label: string }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-full text-sm border border-gray-700">
            <span>{icon}</span>
            <span>{label}</span>
        </span>
    );
}

function MetricBox({ title, value, subtitle }: { title: string; value: string; subtitle?: string }) {
    return (
        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <div className="text-gray-400 text-xs uppercase tracking-wider mb-1">{title}</div>
            <div className="text-xl font-bold text-indigo-400">{value}</div>
            {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
        </div>
    );
}
