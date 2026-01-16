// backend/lookupTicket.js
// This is your backend cloud function for Wix ticket lookup

const { createClient, OAuthStrategy } = require('@wix/sdk');
const { checkout } = require('@wix/events');

const wixClient = createClient({
  modules: { checkout },
  auth: OAuthStrategy({ clientId: '<YOUR_OAUTH_APP_ID>' }) // replace with your OAuth App ID
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
