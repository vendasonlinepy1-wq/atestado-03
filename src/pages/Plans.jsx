import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { CheckCircle, Clock, FileText, Shield, Check, Info } from 'lucide-react';
import { Button } from '../components/Button';

export const Plans = () => {
    const navigate = useNavigate();

    // Mantendo os planos conforme solicitado (39,90 e 54,90)
    const plans = {
        single: {
            price: 39.90,
            name: "Atendimento Premium",
            title: "Atendimento Médico 24h",
            subtitle: "ATENDIMENTO PREMIUM",
            features: [
                "Clínico Geral 24h",
                "Atendimento para todas as idades",
                "Receitas",
                "Atestado",
                "Solicitação de exames",
                "Encaminhamentos"
            ]
        },
        combo: {
            price: 54.90,
            name: "Combo Saúde (2 Consultas)",
            title: "PROMOÇÃO: 2 Consultas por R$ 54,90",
            subtitle: "PROMOÇÃO: 2 Consultas",
            info: "(use quando quiser)",
            features: [
                `Cada consulta sai a um preço promocional de R$ ${(54.90 / 2).toFixed(2).replace('.', ',')}`,
                "Clínico Geral 24h",
                "Atendimento para todas as idades",
                "Receitas",
                "Atestado",
                "Solicitação de exames",
                "Encaminhamentos",
                "A segunda consulta não tem validade, use quando quiser (precisar)."
            ]
        }
    };

    const handleSelectPlan = (planKey) => {
        const plan = plans[planKey];
        localStorage.setItem('selectedPlan', planKey);
        localStorage.setItem('selectedPlanPrice', plan.price.toString());
        localStorage.setItem('selectedPlanName', plan.name);
        navigate('/pagamento');
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <Header />

            <div className="container mx-auto px-4 max-w-4xl" style={{ paddingTop: '100px' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 items-start">
                    {/* Plano Individual */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-full"
                    >
                        <div className="bg-[#0047AB] py-4 px-6 text-center">
                            <h2 className="text-xl font-bold leading-tight" style={{ color: '#FFFFFF' }}>
                                {plans.single.title}
                            </h2>
                        </div>

                        <div className="p-8 flex-1 flex flex-col items-center">
                            <div className="text-[#0047AB] text-4xl font-bold mb-6">
                                R$ 39,90
                            </div>

                            <div className="w-full">
                                <h3 className="text-sm font-bold text-black mb-4 text-center">
                                    {plans.single.subtitle}
                                </h3>
                                <ul className="space-y-2 mb-8">
                                    {plans.single.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                                            <span className="text-black leading-none mt-1.5">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto w-full pt-4 border-t border-gray-100 flex justify-center">
                                <Button
                                    variant="primary"
                                    className="bg-[#FF6600] hover:bg-[#E65100] text-white px-10 py-2 rounded-md font-bold text-lg border-none shadow-md"
                                    onClick={() => handleSelectPlan('single')}
                                >
                                    Selecionar
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                    {/* Plano Combo */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden flex flex-col h-full relative"
                    >
                        <div className="bg-[#0047AB] py-4 px-6 text-center">
                            <h2 className="text-xl font-bold leading-tight uppercase" style={{ color: '#FFFFFF' }}>
                                {plans.combo.title}
                            </h2>
                        </div>

                        <div className="p-8 flex-1 flex flex-col items-center">
                            <div className="text-[#0047AB] text-4xl font-bold mb-4">
                                R$ 54,90
                            </div>

                            <div className="w-full">
                                <h3 className="text-sm font-bold text-black mb-1 text-center">
                                    {plans.combo.subtitle}
                                </h3>
                                <p className="text-sm text-gray-600 mb-4 text-center italic">
                                    {plans.combo.info}
                                </p>
                                <ul className="space-y-2 mb-8">
                                    {plans.combo.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 font-medium">
                                            <span className="text-black leading-none mt-1.5">•</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto w-full pt-4 border-t border-gray-100 flex justify-center">
                                <Button
                                    variant="primary"
                                    className="bg-[#FF6600] hover:bg-[#E65100] text-white px-10 py-2 rounded-md font-bold text-lg border-none shadow-md"
                                    onClick={() => handleSelectPlan('combo')}
                                >
                                    Selecionar
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Seção Incluso - Igual a Imagem 1 */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm max-w-2xl mx-auto"
                >
                    <h3 className="text-[#64748B] text-sm font-bold uppercase tracking-wider mb-6">
                        INCLUSO EM TODOS OS PLANOS
                    </h3>

                    <div className="space-y-6">
                        <div className="flex items-start gap-4">
                            <Clock className="text-[#0047AB] mt-1 shrink-0" size={24} />
                            <p className="text-[#334155] text-lg font-medium leading-tight">
                                Atendimento 24h por dia, 7 dias por semana
                            </p>
                        </div>

                        <div className="flex items-start gap-4">
                            <FileText className="text-[#0047AB] mt-1 shrink-0" size={24} />
                            <p className="text-[#334155] text-lg font-medium leading-tight">
                                Receitas e Atestados Digitais Válidos
                            </p>
                        </div>

                        <div className="flex items-start gap-4">
                            <Shield className="text-[#0047AB] mt-1 shrink-0" size={24} />
                            <p className="text-[#334155] text-lg font-medium leading-tight">
                                Médicos com CRM ativo verificado
                            </p>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="bg-green-100 rounded-full p-0.5 mt-1 shrink-0">
                                <Check className="text-[#22C55E]" size={20} />
                            </div>
                            <p className="text-[#334155] text-lg font-medium leading-tight">
                                Retorno gratuito em até 7 dias
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
