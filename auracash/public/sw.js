const BACKEND_URL = 'http://127.0.0.1:8002';

self.addEventListener('install', event => {
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('push', event => {
    const data = event.data.json();
    console.log('Push Received:', data);

    const title = data.title;
    const options = {
        body: data.body,
        icon: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png',
        badge: 'https://cdn-icons-png.flaticon.com/512/2830/2830305.png',
        data: {
            plan_id: data.plan_id
        },
        actions: [
            { action: 'approve', title: '1. ✅ Approve' },
            { action: 'discuss', title: '2. 💬 Discuss' },
            { action: 'reject', title: '3. ❌ Reject' }
        ],
        vibrate: [200, 100, 200],
        requireInteraction: true
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});

self.addEventListener('notificationclick', event => {
    const action = event.action;
    const plan_id = event.notification.data.plan_id;
    event.notification.close();

    // Logic to focus existing tab or open new one
    const urlToOpen = new URL('/notifications', self.location.origin).href;
    const promiseChain = clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients) => {
        let matchingClient = null;
        for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen) {
                matchingClient = client;
                break;
            }
        }
        if (matchingClient) {
            return matchingClient.focus();
        } else {
            return clients.openWindow(urlToOpen);
        }
    });

    if (action) {
        event.waitUntil(
            Promise.all([
                promiseChain,
                fetch(`${BACKEND_URL}/response`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ plan_id, action })
                })
            ])
        );
    } else {
        event.waitUntil(promiseChain);
    }
});
