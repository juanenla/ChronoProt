export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-950">
            <nav className="bg-gray-900 border-b border-gray-800 p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <div className="font-bold flex items-center gap-2">
                        <span>⚡</span>
                        <span>ChronoAdmin</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                        <a href="/admin" className="hover:text-indigo-400">Dashboard</a>
                        <a href="/admin/responses" className="hover:text-indigo-400">Respuestas</a>
                        <button className="text-red-400 hover:text-red-300">Salir</button>
                    </div>
                </div>
            </nav>
            <main className="container mx-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
