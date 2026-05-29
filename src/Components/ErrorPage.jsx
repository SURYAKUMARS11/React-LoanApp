import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AlertTriangle,
    ArrowLeft,
    Home,
    RefreshCw,
    Car,
    ShieldAlert
} from 'lucide-react';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans antialiased text-slate-900">

            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/5 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]" />

            <div className="max-w-xl w-full relative z-10">
                {/* Branding */}
                <div className="flex items-center justify-center gap-3 mb-12">
                    <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                        <Car className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-slate-900 font-black text-xl tracking-tighter uppercase">Vehicle Hub</span>
                </div>

                {/* Error Card */}
                <div className="bg-white rounded-[40px] shadow-[0_30px_70px_-20px_rgba(0,0,0,0.1)] border border-slate-100 p-10 md:p-16 text-center relative overflow-hidden">

                    {/* Top Accent Bar */}
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-teal-500" />

                    {/* Illustration Area */}
                    <div className="relative mb-10">
                        <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50/50 relative z-10">
                            <ShieldAlert className="w-12 h-12 text-rose-500" />
                        </div>
                        {/* Decorative Rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-slate-100 rounded-full animate-ping opacity-20" />
                    </div>

                    {/* Error Text */}
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">
                        Oops! Something Went Wrong
                    </h1>

                    <p className="text-slate-500 font-medium leading-relaxed mb-10 max-w-sm mx-auto">
                        Please try again later.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300 active:scale-95 group"
                        >
                            <Home className="w-4 h-4" />
                            Take Me Home
                        </button>

                        <button
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 active:scale-95"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Retry Page
                        </button>
                    </div>
                </div>

                {/* Bottom Assistance Link */}
                <div className="mt-10 text-center">
                    <p className="text-slate-400 text-sm font-semibold">
                        Need immediate assistance? {' '}
                        <button className="text-blue-600 font-black hover:underline underline-offset-4">
                            Contact Support
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;