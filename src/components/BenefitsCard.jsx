import React from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Plus } from 'lucide-react';
import { Button } from './Button';
import { useNavigate } from 'react-router-dom';

export const BenefitsCard = () => {
    const navigate = useNavigate();

    const checklist = [
        "Atestados",
        "Receitas e renovações de receitas",
        "Pedidos e checagem de exames",
        "Encaminhamentos",
        "Acompanhamento clínico",
        "Atendimento para qualquer idade",
        "Não precisa agendar",
        "Você já fala com o médico agora",
        "E muito mais..."
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-gray-100 rounded-[30px] overflow-hidden shadow-2xl relative"
        >
            {/* Background Watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none">
                <Plus className="w-80 h-80 text-gray-800" />
            </div>

            {/* Header */}
            <div className="bg-[#0047AB] p-8 text-center pt-10 pb-8">
                <h2 className="text-white font-black text-xl md:text-2xl leading-tight uppercase font-outfit">
                    TUDO FÁCIL DE RESOLVER E <br />
                    COM <span className="text-[#00BFFF]">ZERO</span> BUROCRACIA
                </h2>
            </div>

            {/* Content */}
            <div className="p-8 pb-10">
                <ul className="space-y-3 mb-8">
                    {checklist.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <div className="bg-transparent rounded-md text-[#0066CC] flex-shrink-0 mt-0.5">
                                {/* Visual match for the check icon in the image */}
                                <CheckSquare size={24} strokeWidth={2.5} />
                            </div>
                            <span className="text-[#003366] font-bold text-lg leading-snug text-left">
                                {item}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* CTA Button */}
                <div className="text-center px-4">
                    <Button
                        variant="primary"
                        size="lg"
                        className="w-full bg-[#E65100] hover:bg-[#F57C00] text-white font-black uppercase tracking-wide py-4 text-lg rounded-full shadow-[0_4px_14px_rgba(230,81,0,0.5)]"
                        onClick={() => navigate('/cadastro')}
                    >
                        QUERO ME CONSULTAR AGORA
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};
