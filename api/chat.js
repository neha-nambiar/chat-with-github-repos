export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers
    });
  }

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers
    });
  }

  try {
    const data = await request.json();
    
    // Test response
    return new Response(JSON.stringify({
      response: `Successfully received message for ${data.repo}: ${data.message}`
    }), {
      status: 200,
      headers
    });

  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Error processing request',
      details: error.message
    }), {
      status: 500,
      headers
    });
  }
}