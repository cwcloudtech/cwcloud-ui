import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentComponent from './PaymentComponent/PaymentComponent';
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function Billing() {
    return (
        <Elements stripe={stripePromise}>
            <PaymentComponent />
        </Elements>
    )
}

export default Billing