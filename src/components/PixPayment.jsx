import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Copy, Check, QrCode, Loader2, AlertCircle, CheckCircle2, Clock, Upload, X, FileImage } from 'lucide-react';
import { createPixPayment } from '../services/paymentService';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const POLLING_INTERVAL = 5000;

export const PixPayment = ({ amount, buyerName, buyerEmail, buyerDocument, buyerPhone }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentData, setPaymentData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('pending');
    const [checkingStatus, setCheckingStatus] = useState(false);

    // Receipt upload states
    const [showReceiptUpload, setShowReceiptUpload] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);
    const [receiptUploaded, setReceiptUploaded] = useState(false);

    // Check payment status
    const checkPaymentStatus = useCallback(async (externalId) => {
        if (!externalId) return;

        setCheckingStatus(true);
        try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/check-payment-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ externalId })
            });

            const data = await response.json();

            if (data.status === 'paid') {
                setPaymentStatus('paid');
                setTimeout(() => navigate('/upsell-fila', { state: { externalId } }), 2000);
            } else if (data.status === 'pending_review') {
                setPaymentStatus('pending_review');
                setReceiptUploaded(true);
            }
        } catch (error) {
            console.error('Error checking payment status:', error);
        } finally {
            setCheckingStatus(false);
        }
    }, [navigate]);

    // Generate Pix on mount
    useEffect(() => {
        const generatePix = async () => {
            setLoading(true);
            setError(null);

            const amountInCents = Math.round(amount * 100);

            const result = await createPixPayment({
                amount: amountInCents,
                buyerName: buyerName || 'Cliente',
                buyerEmail: buyerEmail || 'cliente@email.com',
                buyerDocument: buyerDocument,
                buyerPhone: buyerPhone
            });

            if (result.success) {
                setPaymentData(result);
            } else {
                setError(result.error || 'Erro ao gerar pagamento');
            }

            setLoading(false);
        };

        generatePix();
    }, [amount, buyerName, buyerEmail, buyerDocument, buyerPhone]);

    // Polling
    useEffect(() => {
        if (!paymentData?.externalId || paymentStatus === 'paid' || receiptUploaded) return;

        checkPaymentStatus(paymentData.externalId);

        const intervalId = setInterval(() => {
            checkPaymentStatus(paymentData.externalId);
        }, POLLING_INTERVAL);

        return () => clearInterval(intervalId);
    }, [paymentData?.externalId, paymentStatus, receiptUploaded, checkPaymentStatus]);

    const handleCopy = () => {
        if (paymentData?.pixCode) {
            navigator.clipboard.writeText(paymentData.pixCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                alert('Arquivo muito grande. Máximo 10MB.');
                return;
            }
            setSelectedFile(file);
        }
    };

    const handleUploadReceipt = async () => {
        if (!selectedFile || !paymentData?.externalId) return;

        setUploadingReceipt(true);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('externalId', paymentData.externalId);

            const response = await fetch(`${SUPABASE_URL}/functions/v1/upload-receipt`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setReceiptUploaded(true);
                setShowReceiptUpload(false);
            } else {
                alert(data.error || 'Erro ao enviar comprovante');
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Erro ao enviar comprovante');
        } finally {
            setUploadingReceipt(false);
        }
    };

    // Paid state
    if (paymentStatus === 'paid') {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-green-50 p-8 rounded-2xl border-2 border-green-500 shadow-lg text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                >
                    <CheckCircle2 className="text-green-500 mx-auto mb-4" size={80} />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h3>
                <p className="text-green-600 mb-4">Seu acesso está sendo liberado...</p>
                <Loader2 className="animate-spin text-green-500 mx-auto" size={24} />
            </motion.div>
        );
    }

    // Receipt uploaded state
    if (receiptUploaded) {
        return (
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-500 shadow-lg text-center"
            >
                <CheckCircle2 className="text-blue-500 mx-auto mb-4" size={60} />
                <h3 className="text-xl font-bold text-blue-700 mb-2">Comprovante Enviado!</h3>
                <p className="text-blue-600 mb-4">Estamos verificando seu pagamento. Você receberá uma confirmação em breve.</p>
                <p className="text-sm text-gray-500">ID: {paymentData?.externalId}</p>
            </motion.div>
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
                <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="animate-spin text-[#003366] mb-4" size={48} />
                    <p className="text-gray-500">Gerando código Pix...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-red-200 shadow-sm text-center">
                <div className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="text-red-500 mb-4" size={48} />
                    <h3 className="text-lg font-bold text-red-600 mb-2">Erro ao gerar Pix</h3>
                    <p className="text-sm text-gray-600 mb-4">{error}</p>
                    <Button variant="primary" onClick={() => window.location.reload()}>
                        Tentar Novamente
                    </Button>
                </div>
            </div>
        );
    }

    const qrCodeUrl = paymentData?.qrcodeBase64
        ? (paymentData.qrcodeBase64.startsWith('data:') ? paymentData.qrcodeBase64 : `data:image/png;base64,${paymentData.qrcodeBase64}`)
        : `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentData?.pixCode || '')}`;

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-center">
            <h3 className="text-xl font-bold text-[#003366] mb-4 flex items-center justify-center gap-2">
                <QrCode /> Pagamento via Pix
            </h3>

            <div className="mb-6">
                <div className="text-sm text-gray-500 mb-2">Escaneie o QR Code abaixo:</div>
                <div className="bg-gray-100 w-48 h-48 mx-auto rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden">
                    <img src={qrCodeUrl} alt="QR Code Pix" className="w-full h-full object-contain p-2" />
                </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-xl mb-4">
                <div className="text-xs text-[#003366] font-bold uppercase mb-1">Total a Pagar</div>
                <div className="text-3xl font-bold text-[#003366]">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(amount)}
                </div>
            </div>

            <div className="relative mb-4">
                <input
                    readOnly
                    value={paymentData?.pixCode || ''}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 text-xs text-gray-500 mb-4 font-mono truncate"
                />
                <Button
                    variant={copied ? "success" : "primary"}
                    className={`w-full ${copied ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    onClick={handleCopy}
                >
                    {copied ? <><Check size={18} /> Código Copiado!</> : <><Copy size={18} /> Copiar Código Pix</>}
                </Button>
            </div>

            {/* "Já paguei" Button */}
            <AnimatePresence>
                {!showReceiptUpload ? (
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowReceiptUpload(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-[#003366] hover:text-[#003366] transition-colors flex items-center justify-center gap-2"
                    >
                        <Upload size={18} />
                        Já paguei - Enviar comprovante
                    </motion.button>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-2 border-[#003366] rounded-xl p-4"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-[#003366]">Enviar Comprovante</h4>
                            <button onClick={() => setShowReceiptUpload(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>

                        {!selectedFile ? (
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#003366] transition-colors">
                                    <FileImage className="mx-auto text-gray-400 mb-2" size={40} />
                                    <p className="text-sm text-gray-500">Clique para selecionar ou arraste o comprovante</p>
                                    <p className="text-xs text-gray-400 mt-1">Todos os formatos aceitos (máx. 10MB)</p>
                                </div>
                                <input
                                    type="file"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                            </label>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg">
                                    <FileImage className="text-[#003366]" size={24} />
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-gray-700 truncate">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500">
                                        <X size={18} />
                                    </button>
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full"
                                    onClick={handleUploadReceipt}
                                    disabled={uploadingReceipt}
                                >
                                    {uploadingReceipt ? (
                                        <><Loader2 className="animate-spin" size={18} /> Enviando...</>
                                    ) : (
                                        <><Upload size={18} /> Enviar Comprovante</>
                                    )}
                                </Button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Status indicator */}
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                {checkingStatus ? <Loader2 className="animate-spin" size={16} /> : <Clock size={16} />}
                <span>Aguardando pagamento...</span>
            </div>

            <p className="text-xs text-gray-400 mt-2">
                O status será atualizado automaticamente após o pagamento.
            </p>

            {paymentData?.externalId && (
                <p className="text-xs text-gray-400 mt-2">ID: {paymentData.externalId}</p>
            )}
        </div>
    );
};
