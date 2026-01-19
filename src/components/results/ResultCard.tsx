import { ReactNode } from 'react';

interface ResultCardProps {
    title: string;
    icon: string;
    children: ReactNode;
    className?: string;
}

export default function ResultCard({ title, icon, children, className = '' }: ResultCardProps) {
    return (
        <div className={`card overflow-hidden ${className}`}>
            <div className="bg-gray-800/50 p-6 border-b border-gray-700 flex items-center gap-3">
                <span className="text-2xl">{icon}</span>
                <h3 className="text-xl font-bold">{title}</h3>
            </div>
            <div className="p-6 md:p-8">
                {children}
            </div>
        </div>
    );
}
