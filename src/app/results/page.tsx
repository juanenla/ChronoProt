import ResultsView from '@/components/results/ResultsView';

export default function ResultsPage() {
    return (
        <main className="min-h-screen py-12 px-4">
            <div className="container mx-auto max-w-3xl">
                <div className="mb-8 flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    <h1 className="text-3xl font-bold">Tu Plan ChronoPro</h1>
                </div>

                <ResultsView />

                <footer className="mt-16 text-center text-gray-500 text-sm pb-8">
                    <p>ChronoPro © 2026 | Modelo Multiparamétrico v2.0</p>
                </footer>
            </div>
        </main>
    );
}
