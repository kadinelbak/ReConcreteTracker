// IMPORTANT: Before modifying this file, please update CHANGELOG.md with a summary of your changes. Also, make clear comments about every change in this file and what it was replacing so that we don't end up trying the same fixes repeatedly.

import { loadStripe } from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing Stripe public key in environment variables');
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY.startsWith('pk_')) {
  console.error('Invalid Stripe public key format');
  throw new Error('Invalid Stripe public key format');
}

export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
