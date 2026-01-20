'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { toast } from 'sonner';

type Exercise = Database['public']['Tables']['exercises']['Row'];

type RoutineExercise = Exercise & {
    sets: string;
    reps: string;
    notes?: string;
};

type RoutineDay = {
    exercises: RoutineExercise[];
    duration: string;
    timeOfDay: string; // 'Mañana', 'Mediodía', 'Tarde', 'Noche'
};

type WeekRoutine = {
    [key: string]: RoutineDay;
};

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
const TIMES = ['Mañana', 'Mediodía', 'Tarde', 'Noche'];

export default function RoutineBuilder() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState<string>('Lunes');
    const [routine, setRoutine] = useState<WeekRoutine>({});
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'editor' | 'summary'>('editor');

    useEffect(() => {
        fetchExercises();
        const saved = localStorage.getItem('chrono_routine_advanced');
        if (saved) setRoutine(JSON.parse(saved));
        else {
            // Initialize empty structure
            const initial: WeekRoutine = {};
            DAYS.forEach(d => initial[d] = { exercises: [], duration: '', timeOfDay: 'Tarde' });
            setRoutine(initial);
        }
    }, []);

    async function fetchExercises() {
        try {
            const { data, error } = await supabase.from('exercises').select('*').order('name');
            if (error) throw error;
            if (data) setExercises(data);
        } catch (error) {
            console.error('Error fetching exercises:', error);
        } finally {
            setLoading(false);
        }
    }

    const saveRoutine = (newRoutine: WeekRoutine) => {
        setRoutine(newRoutine);
        localStorage.setItem('chrono_routine_advanced', JSON.stringify(newRoutine));
    };

    const addToRoutine = (exercise: Exercise) => {
        const currentDay = routine[selectedDay] || { exercises: [], duration: '', timeOfDay: 'Tarde' };

        if (currentDay.exercises.find(e => e.id === exercise.id)) {
            toast.warning('Este ejercicio ya está en la rutina de hoy');
            return;
        }

        const newExercise: RoutineExercise = { ...exercise, sets: '3', reps: '10-12' };
        const newRoutine = {
            ...routine,
            [selectedDay]: {
                ...currentDay,
                exercises: [...currentDay.exercises, newExercise]
            }
        };
        saveRoutine(newRoutine);
        toast.success(`Agregado ${exercise.name}`);
    };

    const updateExercise = (day: string, exId: string, field: 'sets' | 'reps', value: string) => {
        const currentDay = routine[day];
        const newExercises = currentDay.exercises.map(e =>
            e.id === exId ? { ...e, [field]: value } : e
        );
        saveRoutine({
            ...routine,
            [day]: { ...currentDay, exercises: newExercises }
        });
    };

    const updateDayDetails = (day: string, field: 'duration' | 'timeOfDay', value: string) => {
        const currentDay = routine[day] || { exercises: [], duration: '', timeOfDay: 'Tarde' };
        saveRoutine({
            ...routine,
            [day]: { ...currentDay, [field]: value }
        });
    };

    const removeFromRoutine = (day: string, exerciseId: string) => {
        const currentDay = routine[day];
        const newExercises = currentDay.exercises.filter(e => e.id !== exerciseId);
        saveRoutine({
            ...routine,
            [day]: { ...currentDay, exercises: newExercises }
        });
    };

    const filteredExercises = exercises.filter(e =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.muscle_group.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/gym" className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
                            <span>←</span> Volver a Gimnasio
                        </Link>
                        <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Armador Profesional
                        </h1>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('editor')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'editor' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            Editor
                        </button>
                        <button
                            onClick={() => setViewMode('summary')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${viewMode === 'summary' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}
                        >
                            Resumen Semanal
                        </button>
                    </div>
                </div>

                {viewMode === 'editor' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Selector de Ejercicios */}
                        <div className="lg:col-span-4 space-y-4">
                            <div className="card p-6 h-[calc(100vh-200px)] border border-gray-800 flex flex-col">
                                <h2 className="text-xl font-bold mb-4">Base de Datos</h2>
                                <input
                                    type="text"
                                    placeholder="Buscar ejercicio..."
                                    className="input-field mb-4"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {loading ? (
                                        <p className="text-gray-500 text-center">Cargando...</p>
                                    ) : filteredExercises.map(ex => (
                                        <div
                                            key={ex.id}
                                            onClick={() => addToRoutine(ex)}
                                            className="p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/30 cursor-pointer group flex gap-3 items-center"
                                        >
                                            <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center text-xs text-gray-500 shrink-0">
                                                {ex.image_url ? 'IMG' : '💪'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-white truncate group-hover:text-blue-400">{ex.name}</div>
                                                <div className="text-xs text-gray-400">{ex.muscle_group}</div>
                                            </div>
                                            <div className="text-blue-500 opacity-0 group-hover:opacity-100 font-bold px-2">+</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Editor del Día */}
                        <div className="lg:col-span-8 space-y-6">
                            {/* Días */}
                            <div className="flex overflow-x-auto gap-2 pb-2 custom-scrollbar">
                                {DAYS.map(day => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`
                                            px-6 py-3 rounded-xl whitespace-nowrap text-sm font-bold transition-all
                                            ${selectedDay === day
                                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 scale-105'
                                                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 border border-gray-800'}
                                        `}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>

                            <div className="card p-6 border border-gray-800 min-h-[500px]">
                                {/* Configuración del Día */}
                                <div className="flex flex-wrap gap-4 items-center justify-between mb-8 pb-6 border-b border-gray-800">
                                    <h3 className="text-3xl font-bold text-white flex items-center gap-3">
                                        {selectedDay}
                                        <span className="text-sm font-normal text-gray-500 bg-gray-900 px-3 py-1 rounded-full border border-gray-800">
                                            {(routine[selectedDay]?.exercises || []).length} ejercicios
                                        </span>
                                    </h3>

                                    <div className="flex gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Duración</label>
                                            <input
                                                type="text"
                                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm w-32 focus:border-blue-500 outline-none"
                                                placeholder="ej. 60 min"
                                                value={routine[selectedDay]?.duration || ''}
                                                onChange={(e) => updateDayDetails(selectedDay, 'duration', e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Horario</label>
                                            <select
                                                className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm w-32 focus:border-blue-500 outline-none"
                                                value={routine[selectedDay]?.timeOfDay || 'Tarde'}
                                                onChange={(e) => updateDayDetails(selectedDay, 'timeOfDay', e.target.value)}
                                            >
                                                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Lista de Ejercicios */}
                                <div className="space-y-4">
                                    {(routine[selectedDay]?.exercises || []).length === 0 ? (
                                        <div className="text-center py-20">
                                            <div className="text-6xl mb-4 opacity-20">📝</div>
                                            <p className="text-gray-500">No hay ejercicios asignados para el {selectedDay}.</p>
                                            <p className="text-sm text-gray-600 mt-2">Selecciona ejercicios del panel izquierdo para comenzar.</p>
                                        </div>
                                    ) : (
                                        routine[selectedDay].exercises.map((ex, idx) => (
                                            <div key={`${ex.id}-${idx}`} className="flex flex-col md:flex-row md:items-center gap-4 p-4 rounded-xl bg-gray-900/40 border border-gray-800 hover:border-gray-700 transition-colors group">
                                                <div className="flex items-center gap-4 flex-1">
                                                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-lg text-white">{ex.name}</div>
                                                        <div className="text-xs text-gray-500">{ex.muscle_group}</div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4 bg-gray-950/50 p-2 rounded-lg border border-gray-800">
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500 uppercase text-center">Series</label>
                                                        <input
                                                            type="text"
                                                            className="w-16 bg-transparent text-center font-mono font-bold text-blue-400 border-b border-gray-700 focus:border-blue-500 outline-none"
                                                            value={ex.sets}
                                                            onChange={(e) => updateExercise(selectedDay, ex.id, 'sets', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="w-px h-8 bg-gray-800" />
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500 uppercase text-center">Reps</label>
                                                        <input
                                                            type="text"
                                                            className="w-16 bg-transparent text-center font-mono font-bold text-pink-400 border-b border-gray-700 focus:border-blue-500 outline-none"
                                                            value={ex.reps}
                                                            onChange={(e) => updateExercise(selectedDay, ex.id, 'reps', e.target.value)}
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeFromRoutine(selectedDay, ex.id)}
                                                    className="text-gray-600 hover:text-red-400 p-2 opacity-0 group-hover:opacity-100 transition-all"
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
                ) : (
                    // Vista de Resumen Semanal
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {DAYS.map(day => {
                            const dayRoutine = routine[day];
                            const hasExercises = dayRoutine?.exercises.length > 0;

                            return (
                                <div key={day} className={`card p-5 border ${hasExercises ? 'border-gray-700 bg-gray-900/20' : 'border-gray-800 bg-gray-950/50 opacity-50'}`}>
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="font-bold text-lg">{day}</h3>
                                        {hasExercises && (
                                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                                {dayRoutine.timeOfDay}
                                            </span>
                                        )}
                                    </div>

                                    {hasExercises ? (
                                        <>
                                            <div className="text-xs text-gray-500 mb-3 flex gap-2">
                                                <span>⏱ {dayRoutine.duration || '--'}</span>
                                                <span>•</span>
                                                <span>{dayRoutine.exercises.length} ejercicios</span>
                                            </div>
                                            <ul className="space-y-2 text-sm">
                                                {dayRoutine.exercises.map((ex, i) => (
                                                    <li key={i} className="flex justify-between text-gray-300">
                                                        <span className="truncate pr-2">{ex.name}</span>
                                                        <span className="text-gray-600 tabular-nums text-xs">{ex.sets}x{ex.reps}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-600 italic">Descanso</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
