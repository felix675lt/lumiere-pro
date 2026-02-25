import { loadStripe } from '@stripe/stripe-js';

// Make sure to set VITE_STRIPE_PUBLIC_KEY in your .env file
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');
