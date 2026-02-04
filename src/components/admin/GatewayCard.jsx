import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../lib/supabase';
import { Check, X, Eye, EyeOff, Save, Loader2, Key } from 'lucide-react';

export const GatewayCard = ({ gateway, onUpdate }) => {
    const [secretKey, setSecretKey] = useState(gateway.secret_key || '');
    const [publicKey, setPublicKey] = useState(gateway.public_key || '');
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [showPublicKey, setShowPublicKey] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toggling, setToggling] = useState(false);

    // Check if this gateway needs a public key (like Slimpay)
    const needsPublicKey = gateway.name === 'slimpay';

    const handleSaveKeys = async () => {
        setSaving(true);
        try {
            const updateData = {
                secret_key: secretKey,
                updated_at: new Date().toISOString()
            };

            // Add public_key if this gateway needs it
            if (needsPublicKey) {
                updateData.public_key = publicKey;
            }

            const { error } = await supabase
                .from('payment_gateways')
                .update(updateData)
                .eq('id', gateway.id);

            if (error) throw error;
            onUpdate();
        } catch (err) {
            console.error('Error saving keys:', err);
            alert('Erro ao salvar as chaves');
        } finally {
            setSaving(false);
        }
    };

    const handleToggleActive = async () => {
        // Validate keys before activating
        if (!gateway.is_active) {
            if (!secretKey) {
                alert('Configure a Secret Key antes de ativar');
                return;
            }
            if (needsPublicKey && !publicKey) {
                alert('Configure a Public Key antes de ativar');
                return;
            }
        }

        setToggling(true);
        try {
            // First, deactivate all gateways if we're activating this one
            if (!gateway.is_active) {
                await supabase
                    .from('payment_gateways')
                    .update({ is_active: false, updated_at: new Date().toISOString() })
                    .neq('id', gateway.id);
            }

            const { error } = await supabase
                .from('payment_gateways')
                .update({ is_active: !gateway.is_active, updated_at: new Date().toISOString() })
                .eq('id', gateway.id);

            if (error) throw error;
            onUpdate();
        } catch (err) {
            console.error('Error toggling gateway:', err);
            alert('Erro ao alterar status');
        } finally {
            setToggling(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-lg border-2 transition-colors ${gateway.is_active ? 'border-green-500' : 'border-gray-200'
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${gateway.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <h3 className="font-bold text-lg text-[#003366]">{gateway.display_name}</h3>
                </div>
                <button
                    onClick={handleToggleActive}
                    disabled={toggling}
                    className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors ${gateway.is_active
                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                        } disabled:opacity-50`}
                >
                    {toggling ? (
                        <Loader2 className="animate-spin" size={16} />
                    ) : gateway.is_active ? (
                        <>
                            <X size={16} /> Desativar
                        </>
                    ) : (
                        <>
                            <Check size={16} /> Ativar
                        </>
                    )}
                </button>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        API URL
                    </label>
                    <input
                        type="text"
                        value={gateway.api_url}
                        disabled
                        className="w-full px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 text-sm"
                    />
                </div>

                {/* Public Key (only for gateways that need it) */}
                {needsPublicKey && (
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                            <Key size={14} className="inline mr-1" />
                            Public Key (x-public-key)
                        </label>
                        <div className="relative">
                            <input
                                type={showPublicKey ? 'text' : 'password'}
                                value={publicKey}
                                onChange={(e) => setPublicKey(e.target.value)}
                                placeholder="Cole sua public key aqui..."
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPublicKey(!showPublicKey)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPublicKey ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>
                )}

                {/* Secret Key */}
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        <Key size={14} className="inline mr-1" />
                        Secret Key {needsPublicKey ? '(x-secret-key)' : '(Bearer Token)'}
                    </label>
                    <div className="relative">
                        <input
                            type={showSecretKey ? 'text' : 'password'}
                            value={secretKey}
                            onChange={(e) => setSecretKey(e.target.value)}
                            placeholder="Cole sua secret key aqui..."
                            className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#003366] focus:border-transparent outline-none text-sm"
                        />
                        <button
                            type="button"
                            onClick={() => setShowSecretKey(!showSecretKey)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showSecretKey ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <button
                    onClick={handleSaveKeys}
                    disabled={saving}
                    className="w-full px-4 py-3 bg-[#003366] text-white rounded-lg hover:bg-[#002244] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 font-medium"
                >
                    {saving ? (
                        <Loader2 className="animate-spin" size={18} />
                    ) : (
                        <Save size={18} />
                    )}
                    Salvar Configurações
                </button>

                {gateway.is_active && (
                    <div className="flex items-center gap-2 text-green-600 text-sm font-medium bg-green-50 p-3 rounded-lg">
                        <Check size={16} />
                        Este gateway está ativo e processando pagamentos
                    </div>
                )}
            </div>
        </motion.div>
    );
};
