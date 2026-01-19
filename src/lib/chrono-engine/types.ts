/**
 * ChronoPro - Chrono Engine Types
 * Tipos TypeScript para el modelo multiparamétrico
 */

export type ChronoType = 'morning' | 'intermediate' | 'evening';
export type TrainingTime = 'morning' | 'midday' | 'afternoon' | 'night';
export type Frequency = 'low' | 'moderate' | 'high';
export type Diet = 'omnivore' | 'vegetarian' | 'vegan' | 'intermittent' | 'keto' | 'other';
export type Experience = 'beginner' | 'intermediate' | 'advanced';
export type Goal = 'hypertrophy' | 'strength' | 'both';

export interface UserProfile {
    chronotype: ChronoType;
    trainingTime: TrainingTime;
    frequency: Frequency;
    diet: Diet;
    experience: Experience;
    supplements: string[];
    goal: Goal;
}

export interface TimingRecommendation {
    range: string;
    creatine: string;
    protein: string;
    rationale: string;
}

export interface ProteinDistribution {
    breakfast: number;
    lunch: number;
    dinner: number;
    note: string;
    exerciseWindow: string;
    cenaRecommendation: string;
}

export interface DietAdjustment {
    label: string;
    icon: string;
    creatineNote: string;
    proteinSource: string;
    loadingPhase: boolean;
    extraNote?: string;
    importantNote?: string;
}

export interface ProteinAbsorption {
    name: string;
    rate: string;
    peak: string;
    optimalUse: string;
    icon: string;
}

export interface TimelineItem {
    time: string;
    action: string;
    detail: string;
    highlight?: boolean;
}

export interface SupplementInfo {
    name: string;
    dose: string;
    icon: string;
    note: string;
}

export interface GeneratedPlan {
    profile: {
        chronotypeLabel: string;
        trainingLabel: string;
        frequencyLabel: string;
        dietLabel: string;
        experienceLabel: string;
        goalLabel: string;
        dietIcon: string;
    };
    timing: {
        trainingDays: TimingRecommendation;
        restDays: string;
        proteinDistribution: ProteinDistribution;
    };
    science: {
        circadianFacts: string[];
        anabolicWindow: string;
        leucineThreshold: {
            young: string;
            older: string;
        };
    };
    absorption: ProteinAbsorption[];
    supplements: {
        tierA: SupplementInfo[];
        tierB: SupplementInfo[];
        tierC: SupplementInfo[];
        notRecommended: string[];
    };
    timeline: TimelineItem[];
    hydration: number;
    metrics: {
        weeks1_2: string;
        weeks3_4: string;
        weeks8_12: string;
        expectedWeight: string;
    };
    adjustments: {
        phase1: string;
        phase2: string;
        phase3: string;
        phase4: string;
    };
}
