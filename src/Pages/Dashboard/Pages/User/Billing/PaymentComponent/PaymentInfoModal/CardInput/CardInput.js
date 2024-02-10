import React, { useContext } from 'react';
import { CardElement } from '@stripe/react-stripe-js';
import GlobalContext from '../../../../../../../../Context/GlobalContext';
import colors from '../../../../../../../../Context/Colors';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            'color': '#32325d',
            'iconColor' : '#32325d',
            'fontFamily': '"Helvetica Neue", Helvetica, sans-serif',
            'fontSmoothing': 'antialiased',
            'fontSize': '16px',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
};

export default function CardInput() {
    const _mode = useContext(GlobalContext).mode
    CARD_ELEMENT_OPTIONS.style.base.color = colors.stripe[_mode];
    CARD_ELEMENT_OPTIONS.style.base.iconColor = colors.stripeIcon[_mode];
    return (
        <CardElement options={CARD_ELEMENT_OPTIONS} />
    );
}