'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { Database } from '@/lib/supabase/types';
import { toast } from 'sonner';
import { EXERCISE_DB } from '@/lib/data/exercises_db';
// @ts-ignore
import html2canvas from 'html2canvas';

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
const EQUIPMENT_TYPES = ['Todos', 'Mancuernas', 'Barra', 'Máquina', 'Polea', 'Peso Corporal'];

export default function RoutineBuilder() {
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDay, setSelectedDay] = useState<string>('Lunes');
    const [routine, setRoutine] = useState<WeekRoutine>({});
    const [search, setSearch] = useState('');
    const [viewMode, setViewMode] = useState<'editor' | 'summary'>('editor');
    const [selectedEquipment, setSelectedEquipment] = useState('Todos');
    const summaryRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchAndSeedExercises();
        const saved = localStorage.getItem('chrono_routine_advanced');
        if (saved) setRoutine(JSON.parse(saved));
        else {
            const initial: WeekRoutine = {};
            DAYS.forEach(d => initial[d] = { exercises: [], duration: '', timeOfDay: 'Tarde' });
            setRoutine(initial);
        }
    }, []);

    async function fetchAndSeedExercises() {
        try {
            // 1. Try to fetch
            const { data, error } = await supabase.from('exercises').select('*').order('name');

            if (error) throw error;

            if (data && data.length > 5) {
                // DB has data, use it
                setExercises(data);
            } else {
                // DB is empty or has very few items -> Auto-Seed
                console.log('Database empty, seeding...');
                toast.info('Inicializando base de datos de ejercicios...');

                // Map local DB to DB shape (remove ID/created_at)
                const exercisesToInsert = EXERCISE_DB.map(ex => ({
                    name: ex.name,
                    muscle_group: ex.muscle_group,
                    equipment: ex.equipment,
                    difficulty: ex.difficulty,
                    image_url: null,
                    description: null
                }));

                // Use any cast to bypass complex TS inference issues with bulk insert
                const { data: newExercises, error: insertError } = await supabase
                    .from('exercises')
                    .insert(exercisesToInsert as any)
                    .select();

                if (insertError) {
                    console.error('Seeding error:', insertError);
                    toast.error('Error al inicializar ejercicios.');
                } else if (newExercises) {
                    setExercises(newExercises);
                    toast.success('¡Base de datos cargada con +100 ejercicios!');
                }
            }
        } catch (error) {
            console.error('Error fetching exercises:', error);
            // Fallback to local DB for display if offline
            // @ts-ignore
            setExercises(EXERCISE_DB.map((ex, i) => ({ ...ex, id: i.toString() })));
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

    const downloadSummary = async () => {
        if (!summaryRef.current) return;
        try {
            const canvas = await html2canvas(summaryRef.current, {
                backgroundColor: '#030712', // dark background
                scale: 2 // high res
            });
            const link = document.createElement('a');
            link.download = 'Mi_Rutina_ChronoPro.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('Imagen descargada');
        } catch (err) {
            console.error(err);
            toast.error('Error al generar imagen');
        }
    };

    const filteredExercises = exercises.filter(e => {
        const matchesSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
            e.muscle_group.toLowerCase().includes(search.toLowerCase());
        const matchesEquipment = selectedEquipment === 'Todos' ||
            (e.equipment && e.equipment.includes(selectedEquipment === 'Polea' ? 'Cable' : selectedEquipment)); // Mapping Polea -> Cable if needed
        return matchesSearch && matchesEquipment;
    });

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-[1600px] mx-auto">
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
                        <div className="lg:col-span-3 space-y-4">
                            <div className="card p-6 h-[calc(100vh-200px)] border border-gray-800 flex flex-col">
                                <h2 className="text-xl font-bold mb-4">Ejercicios</h2>

                                {/* Filters */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    <select
                                        className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs w-full outline-none focus:border-blue-500"
                                        value={selectedEquipment}
                                        onChange={(e) => setSelectedEquipment(e.target.value)}
                                    >
                                        <option value="Todos">Todo el Equipamiento</option>
                                        {EQUIPMENT_TYPES.filter(t => t !== 'Todos').map(t => (
                                            <option key={t} value={t}>{t}</option>
                                        ))}
                                    </select>
                                </div>

                                <input
                                    type="text"
                                    placeholder="Buscar..."
                                    className="input-field mb-4"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />

                                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                                    {loading ? (
                                        <p className="text-gray-500 text-center text-sm">Cargando DB...</p>
                                    ) : filteredExercises.length === 0 ? (
                                        <p className="text-gray-500 text-center text-sm">No se encontraron ejercicios.</p>
                                    ) : filteredExercises.map(ex => (
                                        <div
                                            key={ex.id}
                                            onClick={() => addToRoutine(ex)}
                                            className="p-3 rounded-lg bg-gray-900/50 hover:bg-gray-800 border border-gray-800 hover:border-blue-500/30 cursor-pointer group flex gap-3 items-center transition-all"
                                        >
                                            <div className="w-8 h-8 rounded bg-gray-800 flex items-center justify-center text-lg shrink-0">
                                                {/* Simple Category Icons based on muscle group */}
                                                {ex.muscle_group === 'Pecho' ? '🏋️' :
                                                    ex.muscle_group === 'Espalda' ? '🦍' :
                                                        ex.muscle_group === 'Piernas' ? '🦵' :
                                                            ex.muscle_group === 'Brazos' ? '💪' :
                                                                ex.muscle_group === 'Cardio' ? '🏃' : '⚡️'}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-medium text-white text-sm truncate group-hover:text-blue-400">{ex.name}</div>
                                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">{ex.muscle_group} • {ex.equipment}</div>
                                            </div>
                                            <div className="text-blue-500 opacity-0 group-hover:opacity-100 font-bold px-2">+</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Editor del Día */}
                        <div className="lg:col-span-9 space-y-6">
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(routine[selectedDay]?.exercises || []).length === 0 ? (
                                        <div className="col-span-full text-center py-20">
                                            <div className="text-6xl mb-4 opacity-20">📝</div>
                                            <p className="text-gray-500">No hay ejercicios asignados.</p>
                                        </div>
                                    ) : (
                                        routine[selectedDay].exercises.map((ex, idx) => (
                                            <div key={`${ex.id}-${idx}`} className="flex flex-col gap-3 p-4 rounded-xl bg-gray-900/40 border border-gray-800 hover:border-gray-700 transition-colors group relative">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-white truncate">{ex.name}</div>
                                                        <div className="text-xs text-gray-500">{ex.muscle_group}</div>
                                                    </div>
                                                    <button
                                                        onClick={() => removeFromRoutine(selectedDay, ex.id)}
                                                        className="text-gray-600 hover:text-red-400 p-1"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2 bg-gray-950/50 p-2 rounded-lg border border-gray-800">
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500 uppercase text-center">Series</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-transparent text-center font-mono font-bold text-blue-400 border-b border-gray-700 focus:border-blue-500 outline-none text-sm"
                                                            value={ex.sets}
                                                            onChange={(e) => updateExercise(selectedDay, ex.id, 'sets', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="flex flex-col gap-1">
                                                        <label className="text-[10px] text-gray-500 uppercase text-center">Repeticiones</label>
                                                        <input
                                                            type="text"
                                                            className="w-full bg-transparent text-center font-mono font-bold text-pink-400 border-b border-gray-700 focus:border-blue-500 outline-none text-sm"
                                                            value={ex.reps}
                                                            onChange={(e) => updateExercise(selectedDay, ex.id, 'reps', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    // Vista de Resumen Semanal (7 Columnas Desktop)
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                            <h2 className="text-xl font-bold text-white">Tu Plan Semanal</h2>
                            <button
                                onClick={downloadSummary}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg font-bold transition-all text-sm"
                            >
                                <span>📸</span> Descargar Imagen
                            </button>
                        </div>

                        <div
                            ref={summaryRef}
                            className="bg-[#030712] p-4 rounded-xl border border-gray-800"
                        >
                            <div className="text-center mb-6 hidden md:block">
                                <h1 className="text-3xl font-bold text-white tracking-widest uppercase">ChronoPro</h1>
                                <p className="text-gray-500 text-sm">Entrenamiento basado en Cronobiología</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-[600px]">
                                {DAYS.map(day => {
                                    const dayRoutine = routine[day];
                                    const hasExercises = dayRoutine?.exercises.length > 0;

                                    return (
                                        <div key={day} className={`flex flex-col h-full rounded-xl border ${hasExercises ? 'border-gray-800 bg-gray-900/40' : 'border-gray-900 bg-gray-950/30'}`}>
                                            <div className={`p-3 text-center border-b ${hasExercises ? 'border-gray-800 bg-blue-900/20' : 'border-gray-900'}`}>
                                                <h3 className="font-bold text-sm uppercase tracking-wider">{day}</h3>
                                                {hasExercises ? (
                                                    <div className="mt-1 flex flex-col gap-0.5">
                                                        <span className="text-[10px] text-blue-300 font-bold">{dayRoutine.timeOfDay}</span>
                                                        <span className="text-[10px] text-gray-500">{dayRoutine.duration}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[10px] text-gray-600 mt-1 block">Descanso</span>
                                                )}
                                            </div>

                                            <div className="p-2 space-y-2 flex-1 overflow-y-auto custom-scrollbar">
                                                {hasExercises && dayRoutine.exercises.map((ex, i) => (
                                                    <div key={i} className="bg-gray-950 p-2 rounded border border-gray-800 text-xs">
                                                        <div className="font-semibold text-gray-200 leading-tight mb-1">{ex.name}</div>
                                                        <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                                                            <span>{ex.sets} sets</span>
                                                            <span className="text-pink-400">{ex.reps} reps</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-6 text-center text-gray-600 text-[10px] uppercase tracking-widest hidden md:block border-t border-gray-900 pt-4">
                                Personal Plan • Generated by ChronoPro
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
