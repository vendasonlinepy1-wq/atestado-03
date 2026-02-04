import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { GatewayCard } from '../../components/admin/GatewayCard';
import { LogOut, CreditCard, RefreshCw, Loader2, Users, FileText, CheckCircle2, ExternalLink, Download } from 'lucide-react';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [gateways, setGateways] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('gateways'); // gateways, transactions

    const fetchData = async () => {
        setLoading(true);
        setLoadingTransactions(true);
        try {
            // Fetch Gateways
            const { data: gatewayData, error: gatewayError } = await supabase
                .from('payment_gateways')
                .select('*')
                .order('name');
            if (gatewayError) throw gatewayError;
            setGateways(gatewayData || []);

            // Fetch Transactions
            const { data: txData, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(50);
            if (txError) throw txError;
            setTransactions(txData || []);

        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
            setLoadingTransactions(false);
        }
    };

    const handleConfirmPayment = async (externalId) => {
        if (!window.confirm('Deseja confirmar o pagamento desta transação?')) return;

        try {
            const { error } = await supabase
                .from('transactions')
                .update({ status: 'paid', updated_at: new Date().toISOString() })
                .eq('external_id', externalId);

            if (error) throw error;
            fetchData();
        } catch (err) {
            alert('Erro ao confirmar pagamento');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();

        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val / 100);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'paid':
                return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">PAGO</span>;
            case 'pending_review':
                return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">EM REVISÃO</span>;
            case 'failed':
                return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">FALHOU</span>;
            default:
                return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-bold">PENDENTE</span>;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-[#003366] text-white shadow-lg sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <CreditCard size={24} />
                        <h1 className="text-xl font-bold">Admin - Consultas24h</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-blue-200 hidden md:block">{user?.email}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm"
                        >
                            <LogOut size={16} />
                            Sair
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 flex gap-8">
                    <button
                        onClick={() => setActiveTab('gateways')}
                        className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'gateways' ? 'border-[#003366] text-[#003366]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Configurações Gateways
                    </button>
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`py-4 px-2 font-medium text-sm transition-colors border-b-2 ${activeTab === 'transactions' ? 'border-[#003366] text-[#003366]' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        Transações e Comprovantes
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {activeTab === 'gateways' ? (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key="gateways"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[#003366]">Gateways de Pagamento</h2>
                                <p className="text-gray-500 text-sm mt-1">Configure suas integrações. Apenas um ativo por vez.</p>
                            </div>
                            <button
                                onClick={fetchData}
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors text-sm font-medium"
                            >
                                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                                Atualizar
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-20 text-gray-400">
                                <Loader2 className="animate-spin mr-2" /> Carregando config...
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {gateways.map((gateway) => (
                                    <GatewayCard
                                        key={gateway.id}
                                        gateway={gateway}
                                        onUpdate={fetchData}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        key="transactions"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[#003366]">Transações Recentes</h2>
                                <p className="text-gray-500 text-sm mt-1">Acompanhe vendas e valide comprovantes manualmente.</p>
                            </div>
                            <button
                                onClick={fetchData}
                                disabled={loadingTransactions}
                                className="flex items-center gap-2 px-4 py-2 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors text-sm font-medium"
                            >
                                <RefreshCw size={16} className={loadingTransactions ? 'animate-spin' : ''} />
                                Atualizar
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Data</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Valor</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Comprovante</th>
                                            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {loadingTransactions ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                                    <Loader2 className="animate-spin inline mr-2" /> Carregando transações...
                                                </td>
                                            </tr>
                                        ) : transactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                                    Nenhuma transação encontrada.
                                                </td>
                                            </tr>
                                        ) : (
                                            transactions.map((tx) => (
                                                <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {new Date(tx.created_at).toLocaleDateString('pt-BR')} <br />
                                                        <span className="text-xs text-gray-400">{new Date(tx.created_at).toLocaleTimeString('pt-BR')}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm font-medium text-gray-900">{tx.buyer_name}</div>
                                                        <div className="text-xs text-gray-500">{tx.buyer_email}</div>
                                                        <div className="text-xs text-gray-400">{tx.buyer_phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                                        {formatCurrency(tx.amount)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {getStatusBadge(tx.status)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {tx.receipt_url ? (
                                                            <a
                                                                href={tx.receipt_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                                                            >
                                                                <FileText size={16} />
                                                                Ver Arquivo
                                                                <ExternalLink size={14} />
                                                            </a>
                                                        ) : (
                                                            <span className="text-gray-300 text-sm italic">Nenhum</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {tx.status !== 'paid' && (
                                                            <button
                                                                onClick={() => handleConfirmPayment(tx.external_id)}
                                                                className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-bold hover:bg-green-600 transition-colors shadow-sm"
                                                            >
                                                                <CheckCircle2 size={14} />
                                                                CONFIRMAR
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    );
};
