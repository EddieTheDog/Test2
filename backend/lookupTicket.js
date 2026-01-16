// Cloudflare Worker backend for Wix ticket lookup
// Deploy this on Cloudflare Workers

import { createClient, OAuthStrategy } from '@wix/sdk';
import { wixEvents } from '@wix/events';

const WIX_CLIENT_ID = 'f28ff436-ab00-4e0a-977b-8cfdc70f258b'; // Your Wix Headless Client ID

// Create Wix SDK client
const wixClient = createClient({
  modules: { wixEvents },
  auth: OAuthStrategy({ clientId: WIX_CLIENT_ID })
});

// Worker handler
export default {
  async fetch(request) {
    if (request.method === 'POST') {
      try {
        const { barcode, eventId } = await request.json();

        // List all tickets for the event
        const ticketsResponse = await wixClient.wixEvents.listTickets({
          eventId,
          limit: 100
        });

        const ticket = ticketsResponse.tickets.find(t => t.barcode === barcode);

        return new Response(JSON.stringify(ticket || { error: 'Ticket not found' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }
    } else {
      return new Response('Method not allowed', { status: 405 });
    }
  }
};
