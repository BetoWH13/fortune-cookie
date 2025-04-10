// Netlify Function: create-printful-order.js
// This function receives buyer data + quote and creates an order via Printful API

export async function handler(event) {
  try {
    const data = JSON.parse(event.body);

    // Extract order data
    const {
      quoteText,
      customerName,
      email,
      addressLine1,
      city,
      state,
      zip,
      country = "US",
      imageUrl // final mug design as a hosted PNG URL or base64-encoded string
    } = data;

    // Make sure we have the bare minimum to fulfill
    if (!quoteText || !customerName || !addressLine1 || !city || !state || !zip || !imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }

    // Define the product (11oz white mug)
    const variantId = 16895; // Change if using a different mug size/model

    const orderPayload = {
      recipient: {
        name: customerName,
        address1: addressLine1,
        city,
        state_code: state,
        zip,
        country_code: country,
        email
      },
      items: [
        {
          variant_id: variantId,
          quantity: 1,
          name: `Misfortune Mug`,
          files: [
            {
              url: imageUrl
            }
          ]
        }
      ]
    };

    // Send request to Printful API
    const response = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`
      },
      body: JSON.stringify(orderPayload)
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: result })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, printfulOrder: result })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error", details: err.message })
    };
  }
}
