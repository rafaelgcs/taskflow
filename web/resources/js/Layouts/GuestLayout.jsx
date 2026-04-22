import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#050508] pt-6 sm:pt-0 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] pointer-events-none -translate-x-1/2"></div>
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none translate-x-1/2"></div>
            <div className="absolute top-1/2 left-1/2 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col items-center w-full">
                <div className="mt-6 w-full overflow-hidden bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-3xl sm:px-10" style={{ maxWidth: '420px' }}>
                    {children}
                </div>
                
                <p className="mt-8 text-sm text-gray-500">
                    Sua nova central de organização inteligente.
                </p>
            </div>
        </div>
    );
}
