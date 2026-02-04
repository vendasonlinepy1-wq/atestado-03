import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { CheckCircle2, ArrowRight, MessageCircle, FileText, Clock } from 'lucide-react';
import { Button } from '../components/Button';

export const Success = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear selected plan from localStorage
        localStorage.removeItem('selectedPlan');
        localStorage.removeItem('selectedPlanPrice');
        localStorage.removeItem('selectedPlanName');
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <Header />

            <div className="container mx-auto px-4 max-w-lg" style={{ paddingTop: '120px' }}>
                {/* Success Animation */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                        className="inline-block"
                    >
                        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                            <CheckCircle2 className="text-white" size={60} />
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-3xl font-bold text-green-700 mt-6 mb-2"
                    >
                        Pagamento Confirmado!
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-gray-600"
                    >
                        Seu atendimento foi liberado com sucesso
                    </motion.p>
                </motion.div>

                {/* Next Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-6"
                >
                    <h2 className="font-bold text-lg text-[#003366] mb-4">Próximos Passos</h2>

                    <div className="space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <MessageCircle className="text-[#003366]" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#003366]">1. Acesse o WhatsApp</h3>
                                <p className="text-sm text-gray-600">Clique no botão abaixo para iniciar seu atendimento com nosso médico.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Clock className="text-[#003366]" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#003366]">2. Aguarde o Médico</h3>
                                <p className="text-sm text-gray-600">Um médico irá atendê-lo em até 2 minutos.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <FileText className="text-[#003366]" size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-[#003366]">3. Receba seu Atestado</h3>
                                <p className="text-sm text-gray-600">Após a consulta, você receberá seu atestado digital por e-mail e WhatsApp.</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* CTA Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <a
                        href="https://wa.me/5511999999999?text=Ol%C3%A1%21%20Acabei%20de%20fazer%20o%20pagamento%20e%20gostaria%20de%20iniciar%20minha%20consulta."
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <Button
                            variant="primary"
                            size="lg"
                            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 rounded-full shadow-lg"
                        >
                            <MessageCircle size={20} />
                            Iniciar Atendimento no WhatsApp
                            <ArrowRight size={20} />
                        </Button>
                    </a>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        Atendimento 24 horas • Médicos com CRM ativo
                    </p>
                </motion.div>

                {/* Back to home */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="text-center mt-8"
                >
                    <button
                        onClick={() => navigate('/')}
                        className="text-gray-500 hover:text-[#003366] text-sm underline"
                    >
                        Voltar para a página inicial
                    </button>
                </motion.div>
            </div>
        </div>
    );
};
