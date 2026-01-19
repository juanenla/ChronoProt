/**
 * ChronoPro - Timing Matrix
 * 🔒 SECRETO COMERCIAL - Solo servidor
 * Matrices de timing según horario de entrenamiento
 */

import { TimingRecommendation, TrainingTime } from './types';

export const TIMING_MATRIX: Record<TrainingTime, TimingRecommendation> = {
    morning: {
        range: '06:00 - 10:00',
        creatine: 'Post-entreno inmediato (dentro de 30 min)',
        protein: 'Whey 25-40g + carbohidratos 30-50g',
        rationale: 'Aprovecha la máxima sensibilidad insulínica matinal'
    },
    midday: {
        range: '12:00 - 14:00',
        creatine: 'Post-entreno inmediato',
        protein: 'Whey 25-30g',
        rationale: 'Combina con almuerzo completo 30-60 min después'
    },
    afternoon: {
        range: '16:00 - 19:00',
        creatine: 'Post-entreno inmediato',
        protein: 'Whey 25-40g + plátano o fruta',
        rationale: 'Ventana de recuperación óptima; cena 2-3h después'
    },
    night: {
        range: '19:00 - 22:00',
        creatine: 'Post-entreno inmediato',
        protein: 'Whey 25-30g post + caseína 30-40g opcional pre-sueño',
        rationale: 'Prioriza recuperación nocturna; evita estimulantes'
    }
};
