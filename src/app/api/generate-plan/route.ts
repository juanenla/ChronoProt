/**
 * ChronoPro - Generate Plan API
 * POST /api/generate-plan
 * 
 * 🔒 El modelo multiparamétrico se ejecuta SOLO aquí (servidor)
 */

import { NextRequest, NextResponse } from 'next/server';
import { generatePlan, UserProfile } from '@/lib/chrono-engine';

// Validación del perfil
function validateProfile(data: unknown): data is UserProfile {
    if (!data || typeof data !== 'object') return false;

    const profile = data as Record<string, unknown>;

    const validChronotypes = ['morning', 'intermediate', 'evening'];
    const validTrainingTimes = ['morning', 'midday', 'afternoon', 'night'];
    const validFrequencies = ['low', 'moderate', 'high'];
    const validDiets = ['omnivore', 'vegetarian', 'vegan', 'intermittent', 'keto', 'other'];
    const validExperiences = ['beginner', 'intermediate', 'advanced'];
    const validGoals = ['hypertrophy', 'strength', 'both'];

    return (
        validChronotypes.includes(profile.chronotype as string) &&
        validTrainingTimes.includes(profile.trainingTime as string) &&
        validFrequencies.includes(profile.frequency as string) &&
        validDiets.includes(profile.diet as string) &&
        validExperiences.includes(profile.experience as string) &&
        Array.isArray(profile.supplements) &&
        validGoals.includes(profile.goal as string)
    );
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        if (!validateProfile(body)) {
            return NextResponse.json(
                { error: 'Invalid profile data' },
                { status: 400 }
            );
        }

        // Generar plan usando el modelo secreto
        const plan = generatePlan(body);

        return NextResponse.json({
            success: true,
            plan
        });

    } catch (error) {
        console.error('Error generating plan:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
