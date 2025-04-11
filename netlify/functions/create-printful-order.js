// Netlify Function: create-printful-order.js
// Updated to optionally include a sticker

export async function handler(event) {
  try {
    const data = JSON.parse(event.body);

    const {
      quoteText,
      customerName,
      email,
      addressLine1,
      city,
      state,
      zip,
      country = "US",
      imageUrl,
      wantsSticker = false
    } = data;

    if (!quoteText || !customerName || !addressLine1 || !city || !state || !zip || !imageUrl) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" })
      };
    }

    const variantIdMug = 16895; // White 11oz Mug
    const variantIdSticker = 45250; // Replace with your actual Printful Sticker variant ID

    const items = [
      {
        variant_id: variantIdMug,
        quantity: 1,
        name: `Misfortune Mug`,
        files: [
          {
            url: imageUrl
          }
        ]
      }
    ];

    if (wantsSticker) {
      items.push({
        variant_id: variantIdSticker,
        quantity: 1,
        name: `Misfortune Sticker`,
        files: [
          {
            url: imageUrl
          }
        ]
      });
    }

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
      items
    };

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

