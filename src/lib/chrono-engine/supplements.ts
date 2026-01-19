/**
 * ChronoPro - Supplement Tiers
 * 🔒 SECRETO COMERCIAL - Solo servidor
 * Stack de suplementos por nivel de evidencia
 */

import { SupplementInfo } from './types';

export const SUPPLEMENT_TIERS = {
    A: {
        label: 'Evidencia Sólida',
        icon: '✅',
        supplements: [
            { name: 'Proteína', dose: '1.6-2.2 g/kg/día', icon: '🥛', note: 'Base fundamental para hipertrofia' },
            { name: 'Creatina Monohidrato', dose: '3-5g/día', icon: '⚡', note: '+8.4% masa muscular vs placebo' },
            { name: 'Cafeína', dose: '3-6 mg/kg pre-entreno', icon: '☕', note: 'Mejora rendimiento y foco' }
        ] as SupplementInfo[]
    },
    B: {
        label: 'Evidencia Moderada',
        icon: '🔬',
        supplements: [
            { name: 'Beta-alanina', dose: '3-6g/día', icon: '💊', note: 'Mejora series de 60-240 segundos' },
            { name: 'Citrulina Malato', dose: '6-8g pre-entreno', icon: '🍉', note: 'Vasodilatación y bombeo' },
            { name: 'HMB', dose: '3g/día', icon: '💪', note: 'Más efectivo en principiantes' }
        ] as SupplementInfo[]
    },
    C: {
        label: 'Evidencia Emergente',
        icon: '🔍',
        supplements: [
            { name: 'Omega-3', dose: '2-4g/día', icon: '🐟', note: 'Sinergia con entrenamiento' },
            { name: 'Vitamina D', dose: '1000-4000 UI/día', icon: '☀️', note: 'Si hay deficiencia' }
        ] as SupplementInfo[]
    }
};

export const NOT_RECOMMENDED = [
    'BCAA aislados (innecesarios con proteína adecuada)',
    'Glutamina (inefectiva en sanos)',
    'Tribulus terrestris',
    'Turkesterona (marketing > ciencia)'
];
