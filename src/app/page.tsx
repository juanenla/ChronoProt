'use client';

import { ActivityCard } from '@/components/ui/ActivityCard';
import { toast } from 'sonner';

export default function Home() {

    const handleComingSoon = (activity: string) => {
        toast.info(`Cronobiología para ${activity}`, {
            description: "Estamos ajustando los algoritmos circadinos para esta actividad. ¡Pronto estará disponible!",
            duration: 4000,
        });
    };

    return (
        <main className="min-h-screen bg-[var(--background)] p-4 md:p-8 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl w-full flex flex-col gap-8 md:gap-12">
                {/* Header */}
                <div className="text-center space-y-4 max-w-2xl mx-auto">
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-2">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient">
                            ChronoPro
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 font-light leading-relaxed">
                        Optimiza tu rendimiento alineando cada rutina con tu ritmo biológico.
                        <br className="hidden md:block" />
                        Selecciona tu disciplina para comenzar.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">

                    <ActivityCard
                        title="Gimnasio / Musculación"
                        image="/assets/gym.png"
                        href="/gym"
                    />

                    <ActivityCard
                        title="Running"
                        image="/assets/running.png"
                        disabled
                        onClick={() => handleComingSoon('Running')}
                    />

                    <ActivityCard
                        title="Trekking"
                        image="/assets/walking.png"
                        disabled
                        onClick={() => handleComingSoon('Trekking')}
                    />

                    <ActivityCard
                        title="Tenis / Padel"
                        image="/assets/tennis.png"
                        disabled
                        onClick={() => handleComingSoon('Tenis')}
                    />
                </div>

                {/* Footer Disclaimer */}
                <div className="text-center mt-12 opacity-50">
                    <p className="text-xs max-w-2xl mx-auto">
                        © 2026 ChronoPro. Algoritmos basados en evidencia científica.
                        Este software optimiza horarios, no sustituye asesoramiento médico profesional.
                    </p>
                </div>
            </div>
        </main>
    );
}
