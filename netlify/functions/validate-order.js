// Netlify Function: validate-order.js
// Validates presence of order token passed via PayPal return URL

export async function handler(event) {
  const { queryStringParameters } = event;
  const orderToken = queryStringParameters.order;

  if (!orderToken) {
    return {
      statusCode: 302,
      headers: {
        Location: '/index.html'
      },
      body: ''
    };
  }

  // Simulate validation (later: check real DB/cache/file/API)
  const validTestTokens = ['abc123', 'xyz999', 'demo-token'];

  if (!validTestTokens.includes(orderToken)) {
    return {
      statusCode: 302,
      headers: {
        Location: '/index.html'
      },
      body: ''
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ valid: true })
  };
}
