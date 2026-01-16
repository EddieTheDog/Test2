// backend/lookupTicket.js
// Node.js / Cloudbase backend function

import { createClient, OAuthStrategy } from '@wix/sdk';
import { wixEvents } from '@wix/events';

// Replace with your OAuth App ID
const myWixClient = createClient({
  modules: { wixEvents },
  auth: OAuthStrategy({ clientId: 'f28ff436-ab00-4e0a-977b-8cfdc70f258b' })
});

// Cloud function entry point
export async function main(event) {
  const { barcode, eventId } = event;

  try {
    // List tickets for the event
    const ticketResponse = await myWixClient.wixEvents.listTickets({
      eventId,
      limit: 100
    });

    // Find the ticket matching the scanned barcode
    const ticket = ticketResponse.tickets.find(t => t.barcode === barcode);

    return ticket || { error: "Ticket not found" };
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
}

// Optional: test server connection
export async function testConnection(eventId) {
  try {
    const response = await myWixClient.wixEvents.listTickets({ eventId, limit: 1 });
    return { status: "ok", totalTickets: response.tickets.length };
  } catch (err) {
    return { status: "error", message: err.message };
  }
}
