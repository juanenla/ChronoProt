import Image from 'next/image';
import Link from 'next/link';

interface ActivityCardProps {
    title: string;
    image: string;
    href?: string;
    disabled?: boolean;
    onClick?: () => void;
}

export function ActivityCard({ title, image, href, disabled, onClick }: ActivityCardProps) {
    const Content = (
        <div
            className={`
                group relative w-full h-80 rounded-2xl overflow-hidden border border-[var(--glass-border)]
                transition-all duration-300 ease-out
                ${disabled ? 'cursor-not-allowed opacity-80' : 'cursor-pointer hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.2)]'}
            `}
            onClick={onClick}
        >
            {/* Background Image with Zoom Effect */}
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-110">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                />
            </div>

            {/* Gradient Overlay */}
            <div className={`
                absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent
                transition-opacity duration-300
                ${disabled ? 'opacity-90 grayscale' : 'group-hover:opacity-80'}
            `} />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3 className={`
                    text-3xl font-bold mb-2 tracking-wide
                    ${disabled ? 'text-gray-400' : 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400'}
                `}>
                    {title}
                </h3>

                {disabled && (
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 w-fit">
                        <span className="text-xs font-medium text-purple-200">Próximamente</span>
                    </div>
                )}
            </div>

            {/* Lock Icon for Disabled */}
            {disabled && (
                <div className="absolute top-4 right-4 text-white/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                </div>
            )}
        </div>
    );

    if (href && !disabled) {
        return <Link href={href} className="w-full">{Content}</Link>;
    }

    return Content;
}
