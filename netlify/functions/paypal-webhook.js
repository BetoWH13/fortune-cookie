// Netlify Function: paypal-webhook.js
// Handles PayPal IPN webhook and triggers Printful order automatically

import { handler as createPrintfulOrder } from './create-printful-order.js';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
};

export async function handler(event) {
  try {
    const params = new URLSearchParams(event.body);

    const paymentStatus = params.get('payment_status');
    const rawCustom = params.get('custom') || "";
    const [quote, stickerFlag] = rawCustom.split("||");
    const wantsSticker = (stickerFlag === "sticker");

    const payerEmail = params.get('payer_email');
    const fullName = `${params.get('first_name')} ${params.get('last_name')}`;
    const address1 = params.get('address_street');
    const city = params.get('address_city');
    const state = params.get('address_state');
    const zip = params.get('address_zip');
    const country = params.get('address_country_code') || 'US';

    if (paymentStatus !== 'Completed') {
      return { statusCode: 200, headers: corsHeaders, body: 'Payment not completed — skipping order.' };
    }

    const imageUrl = `https://via.placeholder.com/1000x1000.png?text=${encodeURIComponent(quote)}`;

    const orderPayload = {
      quoteText: quote,
      customerName: fullName,
      email: payerEmail,
      addressLine1: address1,
      city,
      state,
      zip,
      country,
      imageUrl,
      wantsSticker
    };

    // Direct function call instead of fetch
    const result = await createPrintfulOrder({
      body: JSON.stringify(orderPayload)
    });

    return {
      statusCode: result.statusCode,
      headers: corsHeaders,
      body: result.body
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal error in PayPal webhook', details: err.message })
    };
  }
}
