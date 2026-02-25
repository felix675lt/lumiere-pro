import React, { useState, useEffect } from 'react';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise } from '../src/utils/stripe';

interface StripePaymentProps {
    amount: number;
    onSuccess: () => void;
    onError: (error: string) => void;
}

const CheckoutForm: React.FC<{ onSuccess: () => void; onError: (error: string) => void }> = ({ onSuccess, onError }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: window.location.href,
            },
            redirect: 'if_required',
        });

        if (error) {
            setErrorMessage(error.message || 'An unexpected error occurred.');
            onError(error.message || 'An unexpected error occurred.');
            setIsLoading(false);
        } else {
            onSuccess();
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <PaymentElement />
            {errorMessage && <div className="text-red-500 text-sm mt-2">{errorMessage}</div>}
            <button
                type="submit"
                disabled={!stripe || isLoading}
                className="w-full mt-4 bg-[#B8860B] text-white py-3 rounded-lg font-serif hover:bg-[#8B6508] transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Processing...' : 'Pay Now'}
            </button>
        </form>
    );
};

export const StripePayment: React.FC<StripePaymentProps> = ({ amount, onSuccess, onError }) => {
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        fetch('/api/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amount * 100, currency: 'usd' }), // Amount in cents
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.clientSecret) {
                    setClientSecret(data.clientSecret);
                } else {
                    onError('Failed to initialize payment.');
                }
            })
            .catch((err) => {
                console.error(err);
                onError('Failed to initialize payment.');
            });
    }, [amount, onError]);

    if (!clientSecret) {
        return <div className="text-white">Loading payment details...</div>;
    }

    const options = {
        clientSecret,
        appearance: {
            theme: 'night' as const,
            variables: {
                colorPrimary: '#B8860B',
            },
        },
    };

    return (
        <Elements options={options} stripe={stripePromise}>
            <CheckoutForm onSuccess={onSuccess} onError={onError} />
        </Elements>
    );
};
