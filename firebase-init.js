// GTTC-24 | Secure Cloud Engine (Online-Only 🔥)
// Optimized for Real-time Data Integrity & Maximum Security

const firebaseConfig = {
  apiKey: "AIzaSyAPP0HuNBSHNRTykEgexzERdT6ntxgNor0",
  authDomain: "gttc-24.firebaseapp.com",
  projectId: "gttc-24",
  storageBucket: "gttc-24.firebasestorage.app",
  messagingSenderId: "314962618124",
  appId: "1:314962618124:web:35d966408077cefdc44b29",
  measurementId: "G-W20HBFV818"
};

// Initialize Core Services
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);

  // 🛡️ ENFORCED SECURITY & LIVE-ONLY SYNC
  firebase.firestore().settings({
    cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED,
    experimentalAutoDetectLongPolling: true, // Smarter than forced long polling
    ignoreUndefinedProperties: true
  });
}

// 🔑 GLOBAL INSTANCES (Safe Access)
var db, auth, storage;

try {
  if (typeof firebase !== 'undefined' && firebase.apps.length) {
    db = firebase.firestore();
    auth = firebase.auth();
    storage = firebase.storage();

    // Attach to window for absolute global certainty
    window.db = db;
    window.auth = auth;
    window.storage = storage;
  }
} catch (e) {
  console.error("Firebase Instance Error:", e);
}

// ⏳ DB READY HELPER
window.dbReady = async function (maxWait = 4000) {
  const start = Date.now();
  while (!window.db && (Date.now() - start < maxWait)) {
    await new Promise(r => setTimeout(r, 100));
  }
  return !!window.db;
};

// 📡 REAL-TIME CONNECTIVITY FIREWALL
window.isOnline = navigator.onLine;

function toggleConnectivityUI(offline) {
  let overlay = document.getElementById('gttc-offline-block');
  if (offline) {
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'gttc-offline-block';
      overlay.innerHTML = `
                <div style="background: #0F1623; color: white; height: 100vh; width: 100vw; position: fixed; top:0; left:0; z-index: 99999; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; font-family: 'Inter', sans-serif; padding: 20px;">
                    <div style="background: white; padding: 10px 20px; border-radius: 12px; margin-bottom: 25px;">
                        <img src="gttc-logo.png" style="height: 60px; width: auto; object-fit: contain;">
                    </div>
                    <h2 style="font-size: 24px; font-weight: 900; color: #2979FF; letter-spacing: 1px;">CONNECTION LOST 🛰️</h2>
                    <p style="color: #B0BEC5; font-size: 13px; margin-top: 10px; line-height: 1.6;">Cloud Sync Inactive. This portal requires a live internet connection for departmental security.</p>
                    <div style="margin-top: 30px; padding: 12px 24px; background: rgba(255, 67, 54, 0.1); border: 1.5px solid #F44336; color: #F44336; border-radius: 30px; font-weight: 800; font-size: 11px; letter-spacing: 2px;">OFFLINE MODE BLOCKED</div>
                </div>`;
      document.body.appendChild(overlay);
    }
  } else {
    if (overlay) overlay.remove();
  }
}

// Global Listeners
window.addEventListener('online', () => {
  window.isOnline = true;
  toggleConnectivityUI(false);
  db.enableNetwork();
});
window.addEventListener('offline', () => {
  window.isOnline = false;
  toggleConnectivityUI(true);
  db.disableNetwork();
});

// Initial Load Check
document.addEventListener('DOMContentLoaded', () => {
  if (!navigator.onLine) toggleConnectivityUI(true);
});
