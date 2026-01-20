'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { toast } from 'sonner';

type Exercise = Database['public']['Tables']['exercises']['Row'];

type WeekRoutine = {
    [key: string]: Exercise[];
};

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Mock initial data in case DB is empty during dev
const MOCK_EXERCISES: Partial<Exercise>[] = [
    { id: '1', name: 'Press de Banca', muscle_group: 'Pecho' },
    { id: '2', name: 'Sentadilla', muscle_group: 'Piernas' },
    { id: '3', name: 'Peso Muerto', muscle_group: 'Espalda' },
    { id: '4', name: 'Press Militar', muscle_group: 'Hombros' },
    { id: '5', name: 'Dominadas', muscle_group: 'Espalda' },
];

export default function RoutineBuilder() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState<string>('Lunes');
    const [routine, setRoutine] = useState<WeekRoutine>({});
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchExercises();
        // Load saved routine
        const saved = localStorage.getItem('chrono_routine');
        if (saved) setRoutine(JSON.parse(saved));
    }, []);

    async function fetchExercises() {
        try {
            const { data, error } = await supabase
                .from('exercises')
                .select('*')
                .order('name');

            if (error) throw error;
            if (data && data.length > 0) {
                setExercises(data);
            } else {
                // Fallback if DB is empty (pending migration run)
                setExercises(MOCK_EXERCISES as Exercise[]);
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
            // Fallback
            setExercises(MOCK_EXERCISES as Exercise[]);
        } finally {
            setLoading(false);
        }
    }

    const addToRoutine = (exercise: Exercise) => {
        const currentDayExercises = routine[selectedDay] || [];
        // Prevent duplicates
        if (currentDayExercises.find(e => e.id === exercise.id)) {
            toast.warning('Este ejercicio ya está en tu rutina de hoy');
            return;
        }

        const newRoutine = {
            ...routine,
            [selectedDay]: [...currentDayExercises, exercise]
        };
        setRoutine(newRoutine);
        localStorage.setItem('chrono_routine', JSON.stringify(newRoutine));
        toast.success(`Agregado ${exercise.name} a ${selectedDay}`);
    };

    const removeFromRoutine = (day: string, exerciseId: string) => {
        const newRoutine = {
            ...routine,
            [day]: routine[day].filter(e => e.id !== exerciseId)
        };
        setRoutine(newRoutine);
        localStorage.setItem('chrono_routine', JSON.stringify(newRoutine));
    };

    const filteredExercises = exercises.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle_group.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <Link href="/gym" className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                        <span>←</span> Volver a Gimnasio
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                        Armador de Rutinas
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Exercise Selector */}
                    <div className="lg:col-span-5 space-y-4">
                        <div className="card p-6 h-full border border-gray-800">
                            <h2 className="text-xl font-bold mb-4">Base de Datos de Ejercicios</h2>
                            <input
                                type="text"
                                placeholder="Buscar (ej: Pecho, Banca...)"
                                className="input-field mb-4"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                            <div className="h-[500px] overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                {loading ? (
                                    <p className="text-gray-500 text-center py-4">Cargando base de datos...</p>
                                ) : filteredExercises.map(ex => (
                                    <div
                                        key={ex.id}
                                        onClick={() => addToRoutine(ex)}
                                        className="p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/30 cursor-pointer transition-all flex justify-between items-center group"
                                    >
                                        <div>
                                            <div className="font-medium text-white group-hover:text-blue-400 transition-colors">{ex.name}</div>
                                            <div className="text-xs text-gray-400">{ex.muscle_group} • {ex.equipment || 'General'}</div>
                                        </div>
                                        <button className="text-blue-500 opacity-0 group-hover:opacity-100 font-bold">+</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: Weekly Scheduler */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Day Tabs */}
                        <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
                            {DAYS.map(day => (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`
                                        px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors
                                        ${selectedDay === day
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                            : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-white'}
                                    `}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                        {/* Selected Day View */}
                        <div className="card p-6 min-h-[500px] border border-gray-800">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-2xl font-bold text-white">{selectedDay}</h3>
                                <div className="text-sm text-gray-500">
                                    {(routine[selectedDay] || []).length} ejercicios
                                </div>
                            </div>

                            <div className="space-y-3">
                                {(routine[selectedDay] || []).length === 0 ? (
                                    <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-800 rounded-xl">
                                        <p>No hay ejercicios para este día.</p>
                                        <p className="text-sm mt-2">Selecciona ejercicios de la lista para agregarlos.</p>
                                    </div>
                                ) : (
                                    (routine[selectedDay] || []).map((ex, idx) => (
                                        <div key={`${ex.id}-${idx}`} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900 border border-gray-800 group">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                                                {idx + 1}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-lg">{ex.name}</div>
                                                <div className="text-sm text-gray-400 flex gap-2">
                                                    <span>{ex.muscle_group}</span>
                                                    <span>•</span>
                                                    <span>3-4 series x 8-12 reps</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromRoutine(selectedDay, ex.id)}
                                                className="text-gray-600 hover:text-red-400 px-3 py-2 transition-colors"
                                                title="Eliminar"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
