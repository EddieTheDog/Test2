// backend/lookupTicket.js
// This is your backend cloud function for Wix ticket lookup

const { createClient, OAuthStrategy } = require('@wix/sdk');
const { checkout } = require('@wix/events');

const wixClient = createClient({
  modules: { checkout },
  auth: OAuthStrategy({ clientId: '4510e9a0-412a-41ac-9ebc-9ebe24b94dcb' }) // replace with your OAuth App ID
});

// Cloud function entry
exports.main = async function(event) {
  const barcode = event.barcode;
  const eventId = event.eventId;

  try {
    // Fetch available tickets
    const response = await wixClient.checkout.listAvailableTickets({
      eventId,
      limit: 100
    });

    // Find ticket matching barcode
    const ticket = response.definitions.find(t => t.barcode === barcode);

    return ticket || { error: "Ticket not found" };
  } catch(err) {
    return { error: err.message };
  }
};
