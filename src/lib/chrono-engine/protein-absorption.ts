/**
 * ChronoPro - Protein Absorption Data
 * 🔒 SECRETO COMERCIAL - Solo servidor
 * Velocidades de absorción del modelo multiparamétrico
 */

import { ProteinAbsorption } from './types';

export const PROTEIN_ABSORPTION_DATA: Record<string, ProteinAbsorption> = {
    whey: {
        name: 'Whey (suero)',
        rate: '~10 g/hora',
        peak: '60-90 min',
        optimalUse: 'Post-ejercicio',
        icon: '🥛'
    },
    casein: {
        name: 'Caseína',
        rate: '~3-6 g/hora',
        peak: '120-180 min',
        optimalUse: 'Antes de dormir (40g, 30 min antes)',
        icon: '🌙'
    },
    egg: {
        name: 'Clara de huevo',
        rate: 'Moderada',
        peak: '90-120 min',
        optimalUse: 'Cualquier comida; ideal ERC (bajo fósforo)',
        icon: '🥚'
    },
    vegetal: {
        name: 'Proteína vegetal',
        rate: 'Variable',
        peak: '90-150 min',
        optimalUse: 'Comidas principales; arroz+guisante para perfil completo',
        icon: '🌱'
    }
};
