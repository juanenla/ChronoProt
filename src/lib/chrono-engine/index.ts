/**
 * ChronoPro - Chrono Engine
 * 🔒 SECRETO COMERCIAL - SOLO SERVIDOR
 * 
 * Este módulo contiene el modelo multiparamétrico de cronoterapia.
 * NUNCA se envía al cliente, solo se ejecuta en API routes.
 */

import { UserProfile, GeneratedPlan, TimelineItem } from './types';
import { TIMING_MATRIX } from './timing-matrix';
import { PROTEIN_ABSORPTION_DATA } from './protein-absorption';
import { CIRCADIAN_FACTS, CONFIG } from './circadian-facts';
import { DIET_ADJUSTMENTS, PROTEIN_DISTRIBUTION } from './diet-adjustments';
import { SUPPLEMENT_TIERS, NOT_RECOMMENDED } from './supplements';

const LABELS = {
    chronotype: {
        morning: 'Matutino 🌅',
        intermediate: 'Intermedio ☀️',
        evening: 'Vespertino 🌙'
    },
    trainingTime: {
        morning: 'Mañana (06:00-10:00)',
        midday: 'Mediodía (12:00-14:00)',
        afternoon: 'Tarde (16:00-19:00)',
        night: 'Noche (19:00-22:00)'
    },
    frequency: {
        low: '2-3 días/semana',
        moderate: '3-4 días/semana',
        high: '5-6 días/semana'
    },
    experience: {
        beginner: 'Principiante (<1 año)',
        intermediate: 'Intermedio (1-3 años)',
        advanced: 'Avanzado (>3 años)'
    },
    goal: {
        hypertrophy: 'Hipertrofia 💪',
        strength: 'Fuerza 🏆',
        both: 'Hipertrofia + Fuerza ⚡'
    }
};

function generateTimeline(profile: UserProfile): TimelineItem[] {
    const diet = DIET_ADJUSTMENTS[profile.diet];
    const distribution = PROTEIN_DISTRIBUTION[profile.chronotype];

    const wakeUpTimes = {
        morning: '06:00',
        intermediate: '07:30',
        evening: '09:00'
    };

    const wakeUp = wakeUpTimes[profile.chronotype];

    switch (profile.trainingTime) {
        case 'morning':
            return [
                { time: wakeUp, action: 'Despertar', detail: 'Hidratación: 500ml agua' },
                { time: '06:30', action: 'Pre-entreno opcional', detail: 'Cafeína 3-6mg/kg si usas' },
                { time: '07:00', action: '🏋️ ENTRENAMIENTO', detail: '', highlight: true },
                { time: '07:45', action: 'Post-entreno inmediato', detail: `${diet.proteinSource} 25-40g + Creatina 5g + Carbohidratos 30-50g`, highlight: true },
                { time: '09:00', action: 'Desayuno completo', detail: `${distribution.breakfast}% de proteína diaria` },
                { time: '13:00', action: 'Almuerzo', detail: `${distribution.lunch}% de proteína diaria` },
                { time: '20:00', action: 'Cena', detail: `${distribution.dinner}% de proteína diaria` },
                { time: '22:30', action: 'Pre-sueño opcional', detail: 'Caseína 30g si entreno intenso' }
            ];
        case 'midday':
            return [
                { time: wakeUp, action: 'Despertar', detail: 'Hidratación: 500ml agua' },
                { time: '08:00', action: 'Desayuno', detail: `${distribution.breakfast}% de proteína diaria` },
                { time: '11:30', action: 'Pre-entreno opcional', detail: 'Cafeína 3-6mg/kg si usas' },
                { time: '12:00', action: '🏋️ ENTRENAMIENTO', detail: '', highlight: true },
                { time: '13:00', action: 'Post-entreno inmediato', detail: `${diet.proteinSource} 25-30g + Creatina 5g`, highlight: true },
                { time: '13:30', action: 'Almuerzo completo', detail: `${distribution.lunch}% de proteína diaria` },
                { time: '20:00', action: 'Cena', detail: `${distribution.dinner}% de proteína diaria` },
                { time: '22:30', action: 'Pre-sueño opcional', detail: 'Caseína 30g si entreno intenso' }
            ];
        case 'afternoon':
            return [
                { time: wakeUp, action: 'Despertar', detail: 'Hidratación: 500ml agua' },
                { time: '08:00', action: 'Desayuno', detail: `${distribution.breakfast}% de proteína diaria` },
                { time: '13:00', action: 'Almuerzo', detail: `${distribution.lunch}% de proteína diaria` },
                { time: '17:00', action: 'Pre-entreno opcional', detail: 'Cafeína 3-6mg/kg + snack ligero' },
                { time: '17:30', action: '🏋️ ENTRENAMIENTO', detail: '', highlight: true },
                { time: '18:30', action: 'Post-entreno inmediato', detail: `${diet.proteinSource} 25-40g + Creatina 5g + Plátano`, highlight: true },
                { time: '20:30', action: 'Cena', detail: `${distribution.dinner}% de proteína diaria` },
                { time: '23:00', action: 'Pre-sueño opcional', detail: 'Caseína 30g si entreno intenso' }
            ];
        case 'night':
            return [
                { time: wakeUp, action: 'Despertar', detail: 'Hidratación: 500ml agua' },
                { time: '08:00', action: 'Desayuno', detail: `${distribution.breakfast}% de proteína diaria` },
                { time: '13:00', action: 'Almuerzo', detail: `${distribution.lunch}% de proteína diaria` },
                { time: '18:00', action: 'Cena ligera pre-entreno', detail: 'Proteína + carbohidratos complejos' },
                { time: '19:30', action: 'Pre-entreno opcional', detail: 'Cafeína reducida o evitar (afecta sueño)' },
                { time: '20:00', action: '🏋️ ENTRENAMIENTO', detail: '', highlight: true },
                { time: '21:00', action: 'Post-entreno inmediato', detail: `${diet.proteinSource} 25-30g + Creatina 5g`, highlight: true },
                { time: '22:30', action: 'Proteína adicional', detail: `${distribution.dinner}% restante + Caseína 30-40g opcional` }
            ];
    }
}

export function generatePlan(profile: UserProfile): GeneratedPlan {
    const diet = DIET_ADJUSTMENTS[profile.diet];
    const timing = TIMING_MATRIX[profile.trainingTime];
    const distribution = PROTEIN_DISTRIBUTION[profile.chronotype];
    const hydration = CONFIG.HYDRATION[profile.frequency];

    const expectedWeight = diet.loadingPhase ? '2-3kg' : '1.5-2.5kg';

    const plan: GeneratedPlan = {
        profile: {
            chronotypeLabel: LABELS.chronotype[profile.chronotype],
            trainingLabel: LABELS.trainingTime[profile.trainingTime],
            frequencyLabel: LABELS.frequency[profile.frequency],
            dietLabel: diet.label,
            experienceLabel: LABELS.experience[profile.experience],
            goalLabel: LABELS.goal[profile.goal],
            dietIcon: diet.icon
        },
        timing: {
            trainingDays: timing,
            restDays: `Creatina: Con la comida más grande del día. Mantener dosis de ${CONFIG.CREATINE_DOSE} diarios`,
            proteinDistribution: distribution
        },
        science: {
            circadianFacts: [
                CIRCADIAN_FACTS.mTORC1,
                CIRCADIAN_FACTS.nightDegradation,
                CIRCADIAN_FACTS.GH,
                CIRCADIAN_FACTS.cortisol
            ],
            anabolicWindow: CONFIG.ANABOLIC_WINDOW,
            leucineThreshold: CONFIG.LEUCINE_THRESHOLD
        },
        absorption: Object.values(PROTEIN_ABSORPTION_DATA),
        supplements: {
            tierA: SUPPLEMENT_TIERS.A.supplements.map(s => ({
                ...s,
                note: s.name === 'Proteína' ? `${s.note} | Fuente: ${diet.proteinSource}` : s.note
            })),
            tierB: profile.experience !== 'beginner' ? SUPPLEMENT_TIERS.B.supplements : [],
            tierC: SUPPLEMENT_TIERS.C.supplements,
            notRecommended: NOT_RECOMMENDED
        },
        timeline: generateTimeline(profile),
        hydration,
        metrics: {
            weeks1_2: `Peso esperado: +${expectedWeight} (retención intramuscular). Monitorea tolerancia digestiva.`,
            weeks3_4: 'Stores musculares saturados. Notarás mejor rendimiento en series pesadas.',
            weeks8_12: 'Evalúa progresión de fuerza y medidas. Ajusta si es necesario.',
            expectedWeight
        },
        adjustments: {
            phase1: diet.loadingPhase
                ? `Opción de fase carga: 20g/día (4 tomas de 5g) durante 5-7 días, luego mantenimiento con 5g/día. Aumenta hidratación a ${hydration}L/día.`
                : `Comienza con 5g/día de creatina monohidrato. Aumenta hidratación a ${hydration}L/día.`,
            phase2: 'Ajusta timing según respuesta personal. Añade 1-2 series adicionales si toleras bien.',
            phase3: 'Mantén protocolo estable. Registra progresión de fuerza semanalmente.',
            phase4: 'Compara métricas con inicio. Considera análisis de función renal. Ajusta stack según resultados.'
        }
    };

    return plan;
}

// Export types for API
export type { UserProfile, GeneratedPlan } from './types';
