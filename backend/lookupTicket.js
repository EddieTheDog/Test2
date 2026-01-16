// backend/lookupTicket.js
// Node.js backend for Wix ticket lookup
// Requires: npm install @wix/sdk @wix/events express body-parser

import express from 'express';
import bodyParser from 'body-parser';
import { createClient, OAuthStrategy } from '@wix/sdk';
import { wixEvents } from '@wix/events';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('../frontend')); // serve frontend files

// ==== Wix Client ====
const wixClient = createClient({
  modules: { wixEvents },
  auth: OAuthStrategy({ clientId: 'f28ff436-ab00-4e0a-977b-8cfdc70f258b' }) // Your Headless Client ID
});

// ===== Lookup ticket endpoint =====
app.post('/lookupTicket', async (req, res) => {
  const { barcode, eventId } = req.body;

  try {
    // Fetch all tickets for the event
    const response = await wixClient.wixEvents.listTickets({ eventId, limit: 100 });
    // Find the ticket matching barcode
    const ticket = response.tickets.find(t => t.barcode === barcode);
    res.json(ticket || { error: 'Ticket not found' });
  } catch (err) {
    console.error(err);
    res.json({ error: err.message });
  }
});

// ===== Test server connection endpoint =====
app.get('/testConnection', async (req, res) => {
  try {
    res.json({ status: 'ok', message: 'Server running and backend ready!' });
  } catch(err) {
    res.json({ status: 'error', message: err.message });
  }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
