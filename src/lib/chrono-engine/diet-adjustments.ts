/**
 * ChronoPro - Diet Adjustments
 * 🔒 SECRETO COMERCIAL - Solo servidor
 * Ajustes por patrón alimenticio del modelo multiparamétrico
 */

import { DietAdjustment, Diet, ProteinDistribution, ChronoType } from './types';

export const DIET_ADJUSTMENTS: Record<Diet, DietAdjustment> = {
    omnivore: {
        label: 'Omnívoro',
        icon: '🥩',
        creatineNote: 'Stores de creatina típicamente normales',
        proteinSource: 'Whey, caseína, o cualquier fuente completa',
        loadingPhase: false
    },
    vegetarian: {
        label: 'Vegetariano',
        icon: '🥛',
        creatineNote: 'Stores moderadamente bajos - mayor beneficio potencial',
        proteinSource: 'Whey o proteína vegetal de alta calidad',
        loadingPhase: true
    },
    vegan: {
        label: 'Vegano',
        icon: '🌱',
        creatineNote: 'Stores significativamente bajos - máximo beneficio esperado',
        proteinSource: 'Proteína arroz + guisante (combinación completa)',
        loadingPhase: true,
        extraNote: 'Considera fase de carga: 20g/día × 5-7 días'
    },
    intermittent: {
        label: 'Ayuno Intermitente',
        icon: '⏰',
        creatineNote: 'Tomar creatina en primera comida del día',
        proteinSource: 'Cualquier fuente en ventana de alimentación',
        loadingPhase: false,
        importantNote: 'NO consumir creatina durante el ayuno'
    },
    keto: {
        label: 'Keto / Low Carb',
        icon: '🥑',
        creatineNote: 'Puede añadir 10-15g carbohidratos post-entreno sin salir de cetosis',
        proteinSource: 'Whey isolate o proteína con bajo carbohidrato',
        loadingPhase: false,
        extraNote: 'Los carbohidratos post-entreno mejoran la absorción'
    },
    other: {
        label: 'Otro patrón',
        icon: '🍽️',
        creatineNote: 'Aplicar matriz de timing estándar',
        proteinSource: 'Según preferencias personales',
        loadingPhase: false
    }
};

export const PROTEIN_DISTRIBUTION: Record<ChronoType, ProteinDistribution> = {
    morning: {
        breakfast: 40, lunch: 35, dinner: 25,
        note: 'Concentrar 70% de proteína antes de 15:00h',
        exerciseWindow: '07:00-11:00h óptimo',
        cenaRecommendation: 'Cena temprana (≥3h antes de dormir)'
    },
    intermediate: {
        breakfast: 33, lunch: 34, dinner: 33,
        note: 'Distribución uniforme; evitar concentrar en últimas horas',
        exerciseWindow: 'Flexible',
        cenaRecommendation: 'Mantener consistencia horaria'
    },
    evening: {
        breakfast: 25, lunch: 35, dinner: 40,
        note: 'Permitir 35-40% de proteína después de 16:00h',
        exerciseWindow: '15:00-19:00h óptimo',
        cenaRecommendation: 'Priorizar proteína sobre carbohidratos en cena'
    }
};
