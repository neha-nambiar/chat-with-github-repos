export const config = {
    runtime: 'edge'
  };
  
  export default function handler(request) {
    return new Response(
      JSON.stringify({ message: "Hello from the API!" }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }