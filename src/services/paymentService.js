import { supabase } from '../lib/supabase';

/**
 * Payment Service - Handles all payment gateway interactions via Supabase Edge Function
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

/**
 * Create a Pix payment using the Edge Function (no CORS issues)
 * @param {Object} params - Payment parameters
 * @param {number} params.amount - Amount in cents
 * @param {string} params.buyerName - Buyer's full name
 * @param {string} params.buyerEmail - Buyer's email
 * @param {string} params.buyerDocument - Buyer's CPF (without dots/dashes)
 * @param {string} params.buyerPhone - Buyer's phone (with 55 prefix)
 */
export const createPixPayment = async ({ amount, buyerName, buyerEmail, buyerDocument, buyerPhone }) => {
    try {
        const response = await fetch(`${SUPABASE_URL}/functions/v1/create-pix-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount,
                buyerName,
                buyerEmail,
                buyerDocument,
                buyerPhone
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Erro HTTP ${response.status}`);
        }

        return {
            success: true,
            externalId: data.externalId,
            pixCode: data.pixCode,
            qrcodeBase64: data.qrcodeBase64,
            transactionId: data.transactionId
        };

    } catch (error) {
        console.error('Payment creation error:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Check payment status
 */
export const checkPaymentStatus = async (externalId) => {
    const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('external_id', externalId)
        .single();

    if (error) {
        console.error('Error checking payment:', error);
        return null;
    }

    return data;
};

/**
 * Get the currently active gateway (for display purposes)
 */
export const getActiveGateway = async () => {
    const { data, error } = await supabase
        .from('payment_gateways')
        .select('name, display_name, is_active')
        .eq('is_active', true)
        .single();

    if (error) {
        return null;
    }

    return data;
};
