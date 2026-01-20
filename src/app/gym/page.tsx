import ChronoForm from '@/components/forms/ChronoForm';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      {/* Hero Section */}
      <section className="container mx-auto max-w-4xl text-center mb-16 relative">
        <Link href="/" className="absolute left-0 top-0 text-sm text-gray-400 hover:text-white flex items-center gap-1 transition-colors">
          <span>←</span> Volver al Inicio
        </Link>

        <div className="inline-flex items-center justify-center gap-2 mb-6 mt-12 md:mt-0">
          <span className="text-4xl">⚡</span>
          <span className="text-4xl font-bold tracking-tight">
            Chrono<span className="gradient-text">Pro</span>
          </span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Optimiza tu <span className="gradient-text">Suplementación</span>
          <br />según tu Cronotipo
        </h1>

        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Descubre el timing perfecto para creatina y proteína basado en tu ritmo circadiano,
          horario de entrenamiento y estilo de alimentación.
        </p>

        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 max-w-2xl mx-auto flex gap-4 text-left">
          <span className="text-2xl">⚠️</span>
          <p className="text-sm text-orange-200">
            <strong>Aviso importante:</strong> Esta herramienta es educativa y optimiza el TIMING de suplementos
            que YA consumes. No es consejo médico. Consulta un profesional antes de iniciar suplementación.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="container mx-auto max-w-3xl">
        <div className="card p-8 md:p-12">
          <div className="mb-10 pb-6 border-b border-gray-800">
            <h2 className="text-3xl font-bold mb-2">Tu Perfil Personal</h2>
            <p className="text-gray-400">Responde estas 7 preguntas para generar tu plan personalizado</p>
          </div>

          <ChronoForm />
        </div>

        {/* Workout Builder Teaser */}
        <div className="mt-8 card p-8 border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2 text-blue-100">📅 Armador de Rutinas</h3>
              <p className="text-blue-200/70">
                Accede a nuestra base de datos completa de ejercicios y diseña tu semana de entrenamiento ideal.
              </p>
            </div>
            <Link href="/gym/routine" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all whitespace-nowrap shadow-lg shadow-blue-900/20">
              Ir al Armador →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto max-w-4xl mt-24 text-center text-gray-500 text-sm pb-8">
        <p className="mb-2">ChronoPro © 2026 | Herramienta educativa basada en evidencia científica</p>
        <p>Las recomendaciones se basan en meta-análisis y revisiones sistemáticas publicadas</p>
      </footer>
    </main>
  );
}
