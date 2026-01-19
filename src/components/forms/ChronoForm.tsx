'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChronoForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        // Get form data
        const formData = new FormData(e.currentTarget);
        const data = {
            chronotype: formData.get('chronotype'),
            trainingTime: formData.get('training_time'),
            frequency: formData.get('frequency'),
            diet: formData.get('diet'),
            experience: formData.get('experience'),
            supplements: formData.getAll('supplements'),
            goal: formData.get('goal'),
        };

        try {
            // Call API (secret model runs on server)
            const res = await fetch('/api/generate-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.success) {
                // Save response for analytics
                await fetch('/api/save-response', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...data, plan: result.plan }),
                });

                // Store plan in localStorage to pass to results page
                localStorage.setItem('chronopro_plan', JSON.stringify(result.plan));
                router.push('/results');
            } else {
                alert('Error generating plan: ' + result.error);
            }
        } catch (error) {
            console.error(error);
            alert('Error connecting to server');
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Cronotipo */}
            <div className="space-y-4">
                <label className="block text-xl font-semibold">
                    <span className="text-indigo-400 mr-2">1.</span>
                    ¿Cuál es tu cronotipo?
                </label>
                <p className="text-gray-400 text-sm">Si no lo sabes, indica tu hora natural de despertar sin alarma</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="radio-card">
                        <input type="radio" name="chronotype" value="morning" className="hidden" required />
                        <div className="radio-content">
                            <span className="text-3xl">🌅</span>
                            <span className="font-bold">Matutino</span>
                            <span className="text-xs text-gray-400">Despierto antes de las 7:00</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="chronotype" value="intermediate" className="hidden" />
                        <div className="radio-content">
                            <span className="text-3xl">☀️</span>
                            <span className="font-bold">Intermedio</span>
                            <span className="text-xs text-gray-400">Despierto entre 7:00-9:00</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="chronotype" value="evening" className="hidden" />
                        <div className="radio-content">
                            <span className="text-3xl">🌙</span>
                            <span className="font-bold">Vespertino</span>
                            <span className="text-xs text-gray-400">Despierto después de las 9:00</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* 2. Training Time */}
            <div className="space-y-4">
                <label className="block text-xl font-semibold">
                    <span className="text-indigo-400 mr-2">2.</span>
                    ¿A qué hora entrenas habitualmente?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="radio-card">
                        <input type="radio" name="training_time" value="morning" className="hidden" required />
                        <div className="radio-content">
                            <span className="text-2xl">🏋️</span>
                            <span className="font-bold">Mañana</span>
                            <span className="text-xs text-gray-400">06:00 - 10:00</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="training_time" value="midday" className="hidden" />
                        <div className="radio-content">
                            <span className="text-2xl">💪</span>
                            <span className="font-bold">Mediodía</span>
                            <span className="text-xs text-gray-400">12:00 - 14:00</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="training_time" value="afternoon" className="hidden" />
                        <div className="radio-content">
                            <span className="text-2xl">🔥</span>
                            <span className="font-bold">Tarde</span>
                            <span className="text-xs text-gray-400">16:00 - 19:00</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="training_time" value="night" className="hidden" />
                        <div className="radio-content">
                            <span className="text-2xl">🌃</span>
                            <span className="font-bold">Noche</span>
                            <span className="text-xs text-gray-400">19:00 - 22:00</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* 3. Frequency */}
            <div className="space-y-4">
                <label className="block text-xl font-semibold">
                    <span className="text-indigo-400 mr-2">3.</span>
                    ¿Cuántos días entrenas por semana?
                </label>
                <div className="grid grid-cols-3 gap-4">
                    <label className="radio-card">
                        <input type="radio" name="frequency" value="low" className="hidden" required />
                        <div className="radio-content py-2">
                            <span className="font-medium">2-3 días</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="frequency" value="moderate" className="hidden" />
                        <div className="radio-content py-2">
                            <span className="font-medium">3-4 días</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="frequency" value="high" className="hidden" />
                        <div className="radio-content py-2">
                            <span className="font-medium">5-6 días</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* 4. Diet */}
            <div className="space-y-4">
                <label className="block text-xl font-semibold">
                    <span className="text-indigo-400 mr-2">4.</span>
                    ¿Cuál es tu patrón alimenticio?
                </label>
                <select name="diet" className="input-field" required>
                    <option value="">Selecciona una opción...</option>
                    <option value="omnivore">Omnívoro (como de todo)</option>
                    <option value="vegetarian">Vegetariano</option>
                    <option value="vegan">Vegano</option>
                    <option value="intermittent">Ayuno intermitente</option>
                    <option value="keto">Keto / Low carb</option>
                    <option value="other">Otro</option>
                </select>
            </div>

            {/* 5. Experience */}
            <div className="space-y-4">
                <label className="block text-xl font-semibold">
                    <span className="text-indigo-400 mr-2">5.</span>
                    ¿Cuánta experiencia tienes entrenando?
                </label>
                <div className="grid grid-cols-3 gap-4">
                    <label className="radio-card">
                        <input type="radio" name="experience" value="beginner" className="hidden" required />
                        <div className="radio-content">
                            <span className="font-bold">Principiante</span>
                            <span className="text-xs text-gray-400">&lt;1 año</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="experience" value="intermediate" className="hidden" />
                        <div className="radio-content">
                            <span className="font-bold">Intermedio</span>
                            <span className="text-xs text-gray-400">1-3 años</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="experience" value="advanced" className="hidden" />
                        <div className="radio-content">
                            <span className="font-bold">Avanzado</span>
                            <span className="text-xs text-gray-400">&gt;3 años</span>
                        </div>
                    </label>
                </div>
            </div>

            {/* 6. Supplements */}
            <div className="space-y-4">
                <label className="block text-xl font-semibold">
                    <span className="text-indigo-400 mr-2">6.</span>
                    ¿Qué suplementos usas actualmente?
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['Proteína en polvo', 'Creatina', 'Cafeína / Pre-entreno', 'Beta-alanina', 'Omega-3', 'Ninguno aún'].map((supp, i) => {
                        const values = ['protein', 'creatine', 'caffeine', 'beta-alanine', 'omega3', 'none'];
                        return (
                            <label key={i} className="flex items-center space-x-3 bg-gray-900 border border-gray-700 p-3 rounded-lg cursor-pointer hover:border-gray-500">
                                <input type="checkbox" name="supplements" value={values[i]} className="form-checkbox h-5 w-5 text-indigo-600 rounded bg-gray-800 border-gray-600" />
                                <span>{supp}</span>
                            </label>
                        );
                    })}
                </div>
            </div>

            {/* 7. Goal */}
            <div className="space-y-4">
                <label className="block text-xl font-semibold">
                    <span className="text-indigo-400 mr-2">7.</span>
                    ¿Cuál es tu objetivo principal?
                </label>
                <div className="grid grid-cols-3 gap-4">
                    <label className="radio-card">
                        <input type="radio" name="goal" value="hypertrophy" className="hidden" required />
                        <div className="radio-content">
                            <span className="text-2xl">💪</span>
                            <span className="font-bold">Hipertrofia</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="goal" value="strength" className="hidden" />
                        <div className="radio-content">
                            <span className="text-2xl">🏆</span>
                            <span className="font-bold">Fuerza</span>
                        </div>
                    </label>
                    <label className="radio-card">
                        <input type="radio" name="goal" value="both" className="hidden" />
                        <div className="radio-content">
                            <span className="text-2xl">⚡</span>
                            <span className="font-bold">Ambos</span>
                        </div>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary text-xl py-4 mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        Generando Plan...
                    </>
                ) : (
                    <>
                        Generar Mi Plan
                        <span>→</span>
                    </>
                )}
            </button>
        </form>
    );
}
