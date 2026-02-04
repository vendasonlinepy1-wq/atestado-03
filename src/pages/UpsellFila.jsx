import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, ShieldCheck, Lock, Clock, AlertTriangle, Zap, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { Button } from '../components/Button';
import { createUpsellPayment } from '../services/paymentService';

export const UpsellFila = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [step, setStep] = useState('analyzing'); // analyzing -> error -> queue -> priority-payment
    const [progress, setProgress] = useState(0);
    const [queuePosition, setQueuePosition] = useState(384);
    const [peopleInQueue, setPeopleInQueue] = useState(124);
    const [loadingUpsell, setLoadingUpsell] = useState(false);
    const [upsellPaymentData, setUpsellPaymentData] = useState(null);
    const [copied, setCopied] = useState(false);

    // Initial analysis simulation
    useEffect(() => {
        if (step === 'analyzing') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setStep('error'), 1000);
                        return 100;
                    }
                    return prev + Math.random() * 15;
                });
            }, 400);
            return () => clearInterval(interval);
        }
    }, [step]);

    // Error to queue transition
    useEffect(() => {
        if (step === 'error') {
            const timer = setTimeout(() => {
                setStep('queue');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [step]);

    // Dynamic queue logic
    useEffect(() => {
        if (step === 'queue') {
            const interval = setInterval(() => {
                setQueuePosition(prev => Math.max(12, prev - Math.floor(Math.random() * 3 + 1)));
                setPeopleInQueue(prev => Math.max(8, prev + Math.floor(Math.random() * 5 - 2)));
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [step]);

    // Poll for upsell payment status
    useEffect(() => {
        if (step !== 'priority-payment' || !upsellPaymentData?.externalId) return;

        const checkStatus = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/check-payment-status`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ externalId: upsellPaymentData.externalId })
                });
                const data = await response.json();
                if (data.status === 'paid') {
                    navigate('/sucesso');
                }
            } catch (error) {
                console.error('Error checking upsell status:', error);
            }
        };

        const intervalId = setInterval(checkStatus, 5000);
        return () => clearInterval(intervalId);
    }, [step, upsellPaymentData?.externalId, navigate]);

    const handleCopy = () => {
        if (upsellPaymentData?.pixCode) {
            navigator.clipboard.writeText(upsellPaymentData.pixCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePriorityClick = async () => {
        setLoadingUpsell(true);
        // Simulate or call real payment
        const result = await createUpsellPayment({
            buyerName: "Cliente VIP",
            buyerEmail: "vip@cliente.com",
            buyerDocument: "12345678900",
            buyerPhone: "5511999999999"
        });

        if (result.success) {
            setUpsellPaymentData(result);
            setStep('priority-payment');
        } else {
            alert("Erro ao gerar pagamento de prioridade. Tente navegar diretamente.");
            navigate('/sucesso');
        }
        setLoadingUpsell(false);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-start pb-40">
            {/* Dark Header */}
            <div className="w-full bg-[#0F172A] py-6 px-4 text-center shadow-lg">
                <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                    <ShieldCheck size={20} />
                    <span className="text-xs font-bold uppercase tracking-widest">Portal de Atendimento Seguro</span>
                </div>
                <h1 className="text-white font-bold text-xl">Consultas24h Online</h1>
            </div>

            <main className="container max-w-lg px-4 mt-8">
                <AnimatePresence mode="wait">
                    {step === 'analyzing' && (
                        <motion.div
                            key="analyzing"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center"
                        >
                            <div className="relative w-24 h-24 mx-auto mb-6">
                                <Loader2 className="animate-spin text-blue-600 w-full h-full" strokeWidth={1} />
                                <div className="absolute inset-0 flex items-center justify-center font-bold text-blue-600">
                                    {Math.floor(progress)}%
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analisando Pagamento</h2>
                            <p className="text-slate-500">Estamos processando sua solicitação de atendimento médico imediato...</p>

                            <div className="mt-8 space-y-3">
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-blue-600"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs font-bold text-slate-400">
                                    <span>CONECTANDO GATEWAY</span>
                                    <span>SERVIDOR SEGURO</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border-l-8 border-l-amber-500 text-center"
                        >
                            <AlertTriangle className="text-amber-500 mx-auto mb-4" size={56} />
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Alta Demanda Detectada</h2>
                            <p className="text-slate-500">Identificamos um pico de acessos simultâneos no seu estado. Redirecionando para a fila de espera...</p>
                        </motion.div>
                    )}

                    {step === 'queue' && (
                        <motion.div
                            key="queue"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-slate-600 text-xs font-bold">
                                        <Clock size={14} /> FILA VIRTUAL
                                    </div>
                                    <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">ID: TX-9923-B</div>
                                </div>

                                <div className="text-center py-4">
                                    <p className="text-slate-500 text-sm uppercase font-bold tracking-widest mb-1">Sua posição atual</p>
                                    <div className="text-7xl font-black text-slate-900 mb-2">{queuePosition}º</div>
                                    <p className="text-slate-400 text-xs italic">Há {peopleInQueue} pacientes à sua frente</p>
                                </div>

                                <div className="mt-10 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                            <Zap size={18} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800">Tempo estimado de espera</p>
                                            <p className="text-sm text-slate-500">~ 45 a 60 minutos</p>
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 leading-tight">
                                        Devido ao alto volume de consultas nas últimas 24h, o tempo de triagem pode variar. Por favor, mantenha esta janela aberta.
                                    </p>
                                </div>
                            </div>

                            {/* Sticky/Fixed Priority Offer */}
                            <motion.div
                                initial={{ y: 100 }}
                                animate={{ y: 0 }}
                                className="fixed bottom-0 left-0 right-0 z-50 p-4"
                            >
                                <div className="max-w-md mx-auto bg-[#0F172A] rounded-3xl p-6 shadow-2xl border border-slate-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="bg-amber-400 p-2 rounded-xl">
                                            <Zap className="text-black" size={24} fill="currentColor" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-lg leading-none">Pular toda a Fila?</h3>
                                            <p className="text-amber-400 text-xs font-bold uppercase tracking-widest mt-1">Acesso Prioritário VIP</p>
                                        </div>
                                    </div>

                                    <ul className="text-slate-400 text-sm space-y-2 mb-6">
                                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Atendimento médico em menos de 2 min</li>
                                        <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400" /> Prioridade máxima na triagem digital</li>
                                    </ul>

                                    <Button
                                        variant="primary"
                                        className="w-full bg-amber-400 hover:bg-amber-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 group"
                                        onClick={handlePriorityClick}
                                        disabled={loadingUpsell}
                                    >
                                        {loadingUpsell ? (
                                            <Loader2 className="animate-spin" />
                                        ) : (
                                            <>QUERO PRIORIDADE AGORA <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" /></>
                                        )}
                                    </Button>
                                    <div className="text-center mt-3">
                                        <button
                                            onClick={() => navigate('/sucesso')}
                                            className="text-slate-500 text-xs underline decoration-dotted underline-offset-4 hover:text-slate-400 transition-colors"
                                        >
                                            Não, prefiro esperar minha vez
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {step === 'priority-payment' && (
                        <motion.div
                            key="priority-payment"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white p-8 rounded-3xl shadow-xl border-t-8 border-t-amber-400 text-center"
                        >
                            <div className="bg-amber-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100">
                                <Zap className="text-amber-500" size={32} fill="currentColor" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Liberação VIP</h2>
                            <p className="text-slate-500 mb-6 text-sm">Pague a taxa única de prioridade para ser atendido agora mesmo.</p>

                            <div className="bg-slate-50 rounded-2xl p-6 mb-6">
                                <div className="text-xs text-slate-400 font-bold uppercase mb-2">Taxa de Prioridade</div>
                                <div className="text-4xl font-black text-slate-900 mb-4">R$ 29,90</div>

                                <div className="bg-white p-3 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden mb-4">
                                    <img
                                        src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(upsellPaymentData?.pixCode || '')}`}
                                        alt="QR Code Priority"
                                        className="w-32 h-32 mx-auto"
                                    />
                                </div>

                                <div className="relative">
                                    <input
                                        readOnly
                                        value={upsellPaymentData?.pixCode || ''}
                                        className="w-full bg-white border border-slate-200 rounded-lg py-3 px-4 text-[10px] text-slate-400 font-mono truncate mb-3"
                                    />
                                    <Button
                                        variant={copied ? "success" : "primary"}
                                        className={`w-full ${copied ? 'bg-green-600' : 'bg-slate-900'} text-white rounded-xl py-3 font-bold flex items-center justify-center gap-2`}
                                        onClick={handleCopy}
                                    >
                                        {copied ? <><Check size={18} /> Copiado!</> : <><Copy size={18} /> Copiar Código</>}
                                    </Button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 mb-4 flex items-center justify-center gap-2">
                                <Lock size={12} /> Pagamento 100% Seguro
                            </p>

                            <button
                                onClick={() => navigate('/sucesso')}
                                className="text-slate-400 text-sm hover:text-slate-600 transition-colors"
                            >
                                Voltar para a fila comum
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
