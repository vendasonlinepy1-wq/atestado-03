import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { PixPayment } from '../components/PixPayment';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

export const Payment = () => {
    const navigate = useNavigate();

    // Get selected plan from localStorage
    const [planData, setPlanData] = useState({
        plan: 'single',
        price: 39.90,
        name: 'Atendimento Premium'
    });

    useEffect(() => {
        const savedPlan = localStorage.getItem('selectedPlan');
        const savedPrice = localStorage.getItem('selectedPlanPrice');
        const savedName = localStorage.getItem('selectedPlanName');

        if (savedPlan && savedPrice && savedName) {
            setPlanData({
                plan: savedPlan,
                price: parseFloat(savedPrice),
                name: savedName
            });
        }
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
            <Header />

            <div className="container mx-auto px-4 pt-[100px] max-w-lg">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => navigate('/planos')}
                    className="flex items-center gap-2 text-gray-500 hover:text-[#003366] mb-6 transition-colors"
                >
                    <ArrowLeft size={18} />
                    Voltar para planos
                </motion.button>

                {/* Selected Plan Summary */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-xl border border-gray-200 mb-6 flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#003366] rounded-full flex items-center justify-center">
                            <CheckCircle className="text-white" size={20} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Plano selecionado</p>
                            <p className="font-bold text-[#003366]">{planData.name}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-[#003366]">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(planData.price)}
                        </p>
                    </div>
                </motion.div>

                {/* Pix Payment */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <PixPayment
                        amount={planData.price}
                        buyerName="Cliente Teste"
                        buyerEmail="cliente@teste.com"
                        buyerDocument="12345678900"
                        buyerPhone="5511999999999"
                    />
                </motion.div>

                {/* Security Notice */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 flex items-start gap-3 bg-yellow-50 p-4 rounded-xl text-yellow-800 text-sm border border-yellow-200"
                >
                    <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    <p>Seus dados estão seguros. A liberação do atendimento é automática após a compensação do Pix.</p>
                </motion.div>

                {/* Benefits */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 bg-white p-4 rounded-xl border border-gray-200"
                >
                    <p className="text-xs text-gray-500 uppercase font-bold mb-3">Após o pagamento você terá</p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" />
                            Acesso imediato ao atendimento
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" />
                            Médico disponível em menos de 2 minutos
                        </li>
                        <li className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-green-500" />
                            Receitas e atestados digitais válidos
                        </li>
                    </ul>
                </motion.div>
            </div>
        </div>
    );
};
