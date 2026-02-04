import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { CheckCircle, ArrowRight, Shield, Clock, FileText } from 'lucide-react';
import { Button } from '../components/Button';

export const Plans = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('single');

    const plans = {
        single: { price: 39.90, name: "Atendimento Premium" },
        combo: { price: 54.90, name: "Combo Saúde (2 Consultas)" }
    };

    const handleContinue = () => {
        // Save selected plan to localStorage for use in payment page
        localStorage.setItem('selectedPlan', selectedPlan);
        localStorage.setItem('selectedPlanPrice', plans[selectedPlan].price.toString());
        localStorage.setItem('selectedPlanName', plans[selectedPlan].name);
        navigate('/pagamento');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
            <Header />

            <div className="container mx-auto px-4 max-w-2xl" style={{ paddingTop: '100px' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-3xl md:text-4xl font-bold text-[#003366] mb-3">
                        Escolha seu Plano
                    </h1>
                    <p className="text-gray-600">
                        Selecione a opção ideal para você e comece sua consulta agora
                    </p>
                </motion.div>

                <div className="space-y-4 mb-8">
                    {/* Plan 1: Single */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => setSelectedPlan('single')}
                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 bg-white shadow-sm ${selectedPlan === 'single'
                            ? 'border-[#003366] shadow-lg scale-[1.02]'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-[#003366] mb-1">Atendimento Premium</h3>
                                <p className="text-gray-500 text-sm">Consulta individual imediata</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-[#003366]">
                                    R$ <span className="text-4xl">39</span><span className="text-xl">,90</span>
                                </div>
                                <p className="text-xs text-gray-400">pagamento único</p>
                            </div>
                        </div>
                        {selectedPlan === 'single' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 bg-[#003366] text-white rounded-full p-1"
                            >
                                <CheckCircle size={20} />
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Plan 2: Combo */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => setSelectedPlan('combo')}
                        className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 bg-white shadow-sm relative overflow-hidden ${selectedPlan === 'combo'
                            ? 'border-[#FF6600] shadow-lg scale-[1.02]'
                            : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                            }`}
                    >
                        {/* Best Value Badge */}
                        <div className="absolute -top-0 -right-0">
                            <div className="bg-[#FF6600] text-white text-xs font-bold px-4 py-1 rotate-0 rounded-bl-lg">
                                MAIS POPULAR
                            </div>
                        </div>

                        <div className="flex justify-between items-start pt-4">
                            <div className="flex-1">
                                <h3 className="font-bold text-xl text-[#003366] mb-1">Combo Saúde</h3>
                                <p className="text-gray-500 text-sm">2 Consultas (Válido por 1 ano)</p>
                                <div className="mt-2 inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">
                                    ECONOMIZE 30%
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-[#FF6600]">
                                    R$ <span className="text-4xl">54</span><span className="text-xl">,90</span>
                                </div>
                                <p className="text-xs text-green-600 font-medium">R$ 27,45 por consulta</p>
                            </div>
                        </div>
                        {selectedPlan === 'combo' && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-12 right-2 bg-[#FF6600] text-white rounded-full p-1"
                            >
                                <CheckCircle size={20} />
                            </motion.div>
                        )}
                    </motion.div>
                </div>

                {/* Features List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-6 rounded-2xl border border-gray-200 mb-8"
                >
                    <h3 className="font-bold text-sm text-gray-500 uppercase mb-4 tracking-wide">
                        Incluso em todos os planos
                    </h3>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3 text-gray-700">
                            <Clock size={18} className="text-[#003366]" />
                            Atendimento 24h por dia, 7 dias por semana
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <FileText size={18} className="text-[#003366]" />
                            Receitas e Atestados Digitais Válidos
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <Shield size={18} className="text-[#003366]" />
                            Médicos com CRM ativo verificado
                        </li>
                        <li className="flex items-center gap-3 text-gray-700">
                            <CheckCircle size={18} className="text-green-500" />
                            Retorno gratuito em até 7 dias
                        </li>
                        {selectedPlan === 'combo' && (
                            <motion.li
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="flex items-center gap-3 text-[#FF6600] font-bold"
                            >
                                <CheckCircle size={18} />
                                2ª Consulta disponível para usar quando quiser!
                            </motion.li>
                        )}
                    </ul>
                </motion.div>

                {/* Continue Button */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full bg-[#FF6600] hover:bg-[#E65100] text-white font-bold text-lg py-4 rounded-full shadow-lg"
                        onClick={handleContinue}
                    >
                        Continuar para Pagamento <ArrowRight size={20} />
                    </Button>

                    <p className="text-center text-xs text-gray-400 mt-4">
                        Pagamento 100% seguro via Pix • Acesso imediato após confirmação
                    </p>
                </motion.div>
            </div>
        </div>
    );
};
