const express = require('express');
const webpush = require('web-push');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from the parent directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const PORT = 8002;

app.use(cors());
app.use(bodyParser.json());

// Supabase Setup
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// VAPID Setup
const publicVapidKey = process.env.VAPID_PUBLIC_KEY;
const privateVapidKey = process.env.VAPID_PRIVATE_KEY;

webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL}`,
  publicVapidKey,
  privateVapidKey
);

// Subscribe Endpoint
app.post('/subscribe', async (req, res) => {
  const subscription = req.body;
  
  try {
    const data = {
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth
    };
    
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(data, { onConflict: 'endpoint' });

    if (error) throw error;
    
    res.status(201).json({ status: 'success' });
    console.log('New subscription saved:', subscription.endpoint.substring(0, 30) + '...');
  } catch (err) {
    console.error('Subscription error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Action Response Endpoint
app.post('/response', async (req, res) => {
  const { plan_id, action } = req.body;
  
  try {
    const statusUpdate = {
      notification_status: `processed_${action}`,
      user_response: action,
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('initial_plan')
      .update(statusUpdate)
      .eq('id', plan_id);

    if (error) throw error;
    
    res.json({ status: 'updated' });
    console.log(`Plan ${plan_id} responded with: ${action}`);
  } catch (err) {
    console.error('Response error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Realtime Listener
async function startRealtimeListener() {
  console.log("Connecting to Supabase Realtime...");
  
  const channel = supabase
    .channel('initial-plan-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'initial_plan' },
      async (payload) => {
        console.log('--- CHANGE DETECTED ---');
        console.log('Event Type:', payload.eventType);
        
        const newRow = payload.new;
        if (!newRow) return;

        const pushPayload = JSON.stringify({
          title: newRow.title || 'New Investment Plan',
          body: newRow.plan || 'A new plan is ready for your review.',
          plan_id: newRow.id
        });

        // Fetch all subscriptions
        const { data: subscriptions, error } = await supabase
          .from('push_subscriptions')
          .select('*');

        if (error) {
          console.error('Error fetching subscriptions:', error);
          return;
        }

        console.log(`Sending push to ${subscriptions.length} devices...`);

        subscriptions.forEach(sub => {
          const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
                p256dh: sub.p256dh,
                auth: sub.auth
            }
          };

          webpush.sendNotification(pushSubscription, pushPayload)
            .then(() => console.log('Successfully sent push!'))
            .catch(err => {
              console.error('Push Error:', err.statusCode);
              if (err.statusCode === 410) {
                supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint).then();
              }
            });
        });

        // Update status to 'sent'
        await supabase
          .from('initial_plan')
          .update({ notification_status: 'sent' })
          .eq('id', newRow.id);
      }
    );

  channel.subscribe((status) => {
    console.log('Realtime Status:', status);
    if (status === 'CHANNEL_ERROR') {
      console.error('Realtime Channel Error. Verify RLS and Publication settings.');
    }
  });
}

startRealtimeListener();

app.listen(PORT, () => {
  console.log(`AuraCash Notification Server running on port ${PORT}`);
});
