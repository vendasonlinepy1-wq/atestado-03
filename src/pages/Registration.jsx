import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowRight, Lock, ShieldCheck } from 'lucide-react';

export const Registration = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nome: '', email: '', genero: '', cpf: '', celular: '',
        nascimento: '', cep: '', senha: '', confirmSenha: '',
        emergenciaNome: '', emergenciaTel: '', termos: false
    });
    const [errors, setErrors] = useState({});

    // Mask functions
    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    };

    const maskPhone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{4})\d+?$/, '$1');
    };

    const maskCEP = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let maskedValue = value;

        // Apply masks
        if (name === 'cpf') maskedValue = maskCPF(value);
        if (name === 'celular' || name === 'emergenciaTel') maskedValue = maskPhone(value);
        if (name === 'cep') maskedValue = maskCEP(value);

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : maskedValue
        }));
        // Clear error on change
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
        if (!formData.email) newErrors.email = 'E-mail é obrigatório';
        if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
        if (!formData.senha) newErrors.senha = 'Senha é obrigatória';
        if (formData.senha !== formData.confirmSenha) newErrors.confirmSenha = 'Senhas não conferem';
        if (!formData.termos) newErrors.termos = 'Você deve aceitar os termos';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            // Simulate API call
            console.log('Form data:', formData);
            navigate('/planos');
        } else {
            // Shake effect logic could go here
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-[var(--background)] pb-20">
            <Header />

            <div className="container mx-auto px-4 pt-[100px]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl mx-auto bg-white rounded-[var(--radius-lg)] shadow-xl overflow-hidden"
                >
                    {/* Form Header */}
                    <div className="bg-[var(--primary)] p-6 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-x-10 -translate-y-10" />
                        <h2 className="text-2xl font-bold relative z-10">Área do Consumidor</h2>
                        <p className="opacity-90 text-sm mt-2 relative z-10">Preencha seus dados para acessar o atendimento 24h.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                        {/* Personal Data */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[var(--primary)] border-b pb-2">Dados Pessoais</h3>
                            <Input name="nome" label="Nome Completo" placeholder="Ex: João Silva" required value={formData.nome} onChange={handleChange} error={errors.nome} />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="email" label="E-mail" type="email" placeholder="seu@email.com" required value={formData.email} onChange={handleChange} error={errors.email} />
                                <div className="flex flex-col gap-1.5 w-full">
                                    <label className="text-sm font-medium text-[var(--text-muted)] ml-1">Gênero</label>
                                    <select
                                        name="genero"
                                        value={formData.genero}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-white focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-opacity-20"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="masculino">Masculino</option>
                                        <option value="feminino">Feminino</option>
                                        <option value="nao-binario">Não-binário</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="cpf" label="CPF" placeholder="000.000.000-00" required value={formData.cpf} onChange={handleChange} error={errors.cpf} />
                                <Input name="nascimento" label="Data de Nascimento" type="date" value={formData.nascimento} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="celular" label="Celular" placeholder="(00) 00000-0000" value={formData.celular} onChange={handleChange} />
                                <Input name="cep" label="CEP" placeholder="00000-000" value={formData.cep} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Security */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[var(--primary)] border-b pb-2 flex items-center gap-2">
                                <Lock size={18} /> Segurança
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="senha" label="Senha" type="password" required value={formData.senha} onChange={handleChange} error={errors.senha} />
                                <Input name="confirmSenha" label="Confirme a Senha" type="password" required value={formData.confirmSenha} onChange={handleChange} error={errors.confirmSenha} />
                            </div>
                        </div>

                        {/* Emergency */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-[var(--primary)] border-b pb-2">Contato de Emergência</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input name="emergenciaNome" label="Nome do Contato" placeholder="Nome" value={formData.emergenciaNome} onChange={handleChange} />
                                <Input name="emergenciaTel" label="Telefone" placeholder="(00) 00000-0000" value={formData.emergenciaTel} onChange={handleChange} />
                            </div>
                        </div>

                        {/* Terms */}
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <input
                                type="checkbox"
                                name="termos"
                                id="termos"
                                checked={formData.termos}
                                onChange={handleChange}
                                className="mt-1 w-4 h-4 text-[var(--accent)] rounded border-gray-300 focus:ring-[var(--accent)]"
                            />
                            <div className="text-sm text-[var(--text-muted)]">
                                <label htmlFor="termos" className="font-medium text-gray-700 cursor-pointer">Li e concordo com os Termos e Condições de Uso.</label>
                                <p className="text-xs mt-1 flex items-center gap-1 text-[var(--primary)]">
                                    <ShieldCheck size={12} /> Seus dados estão protegidos pela LGPD.
                                </p>
                                {errors.termos && <p className="text-red-500 text-xs mt-1">{errors.termos}</p>}
                            </div>
                        </div>

                        <Button variant="primary" type="submit" size="lg" className="w-full">
                            Continuar para Pagamento <ArrowRight size={20} />
                        </Button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
};
