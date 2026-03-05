
/**
 * GTTC 24 PROFESSIONAL FEATURES ENGINE
 * Author: ImranShek24
 * Features: Splash Screen, Voice Commands, Global Notifications, Pro UI
 */

(function () {
    // 1. SPLASH SCREEN INJECTION
    const splashHTML = `
    <div id="gttc-splash" style="position:fixed; inset:0; background:#050a14; z-index:99999; display:flex; flex-direction:column; align-items:center; justify-content:center; transition: opacity 0.6s ease-out;">
        <div style="position:relative; width:120px; height:120px; display:flex; align-items:center; justify-content:center; margin-bottom:20px;">
            <div style="position:absolute; inset:0; border:4px solid #2979FF; border-radius:30px; animation: splashPulse 2s infinite ease-in-out;"></div>
            <img src="gttc-logo.png" style="width:80px; height:80px; object-fit:contain; border-radius:10px;">
        </div>
        <h1 style="color:#fff; font-size:32px; font-weight:950; letter-spacing:4px; margin:0; text-shadow:0 0 20px rgba(41,121,255,0.4);">GTTC 24</h1>
        <p style="color:rgba(41,121,255,0.8); font-size:12px; font-weight:800; letter-spacing:2px; margin-top:10px; text-transform:uppercase;">Build by ImranShek24</p>
        
        <style>
            @keyframes splashPulse {
                0% { transform: scale(1); opacity: 0.5; box-shadow: 0 0 0 0 rgba(41,121,255,0.4); }
                50% { transform: scale(1.1); opacity: 1; box-shadow: 0 0 30px 10px rgba(41,121,255,0.2); }
                100% { transform: scale(1); opacity: 0.5; box-shadow: 0 0 0 0 rgba(41,121,255,0.4); }
            }
        </style>
    </div>
    `;

    // 2. NOTIFICATION SYSTEM MODAL INJECTION
    const notifHTML = `
    <div id="notif-panel" style="display:none; position:fixed; inset:0; background:rgba(0,0,0,0.8); z-index:90000; align-items:flex-start; justify-content:flex-end; padding:20px;">
        <div id="notif-content" style="background:#0a1120; border:1px solid rgba(255,255,255,0.1); border-radius:24px; width:100%; max-width:400px; max-height:80vh; overflow:hidden; display:flex; flex-direction:column; box-shadow:0 20px 50px rgba(0,0,0,0.5); animation: slideInRight 0.4s cubic-bezier(0.22,1,0.36,1);">
            <div style="padding:20px; border-bottom:1px solid rgba(255,255,255,0.05); display:flex; align-items:center; justify-content:space-between; background:linear-gradient(to right, rgba(41,121,255,0.1), transparent);">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:36px; height:36px; border-radius:10px; background:rgba(41,121,255,0.2); display:flex; align-items:center; justify-content:center; color:#2979FF;">
                        <i class="fas fa-bell"></i>
                    </div>
                    <span style="font-weight:800; color:#fff; font-size:16px;">Notifications</span>
                </div>
                <button onclick="closeNotifPanel()" style="background:none; border:none; color:rgba(255,255,255,0.4); font-size:20px; cursor:pointer;">&times;</button>
            </div>
            <div id="notif-list" style="flex:1; overflow-y:auto; padding:10px;">
                <div style="padding:40px 20px; text-align:center; color:rgba(255,255,255,0.3);">
                    <i class="fas fa-bell-slash" style="font-size:30px; display:block; margin-bottom:10px;"></i>
                    <p style="font-size:12px; font-weight:700;">No new notifications</p>
                </div>
            </div>
        </div>
    </div>
    <style>
        @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    </style>
    `;

    // 3. VOICE ENGINE
    window.GTTCVoice = {
        speak: function (text) {
            if ('speechSynthesis' in window) {
                // Cancel current speech to avoid queue buildup
                window.speechSynthesis.cancel();

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.rate = 0.95; // Slightly faster for professional feel
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                const voices = window.speechSynthesis.getVoices();
                // Prefer Google UK English Male or Female if possible for "Professional" feel
                const profVoice = voices.find(v => v.lang.includes('en-GB') || (v.lang.includes('en-US') && v.name.includes('Natural')));
                if (profVoice) utterance.voice = profVoice;

                window.speechSynthesis.speak(utterance);
            }
        },
        playNotifSound: function () {
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
            audio.volume = 0.4;
            audio.play().catch(e => { /* silent skip */ });
        },
        errorAlert: function (fieldId, messageType, customText = "") {
            const messages = {
                "wrong_password": "Aapne galat password dala hai, kripya check karein.",
                "invalid_email": "Email address sahi nahi hai.",
                "empty": "Ye jagah khali nahi chodi ja sakti.",
                "mobile": "Kripya 10 digit ka sahi mobile number bhariye.",
                "invalid_id": "Kripya sahi registration id bhariye."
            };

            const speechText = messages[messageType] || customText || "Kripya sahi jaankari bhariye.";
            this.speak(speechText);

            if (fieldId) {
                const el = document.getElementById(fieldId);
                if (el) {
                    el.focus();
                    el.style.borderColor = "#F44336";
                    el.style.boxShadow = "0 0 10px rgba(244, 67, 54, 0.4)";
                    el.classList.add('shake-error');

                    // Remove error styling after 3 seconds
                    setTimeout(() => {
                        el.style.borderColor = "";
                        el.style.boxShadow = "";
                        el.classList.remove('shake-error');
                    }, 4000);
                }
            }
        }
    };


    // 4. TOKEN REFRESH UI
    window.showTokenRefreshToast = function (msg = "YouTube Authorization Refreshed") {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            background: rgba(0, 230, 118, 0.9); color: #000;
            padding: 10px 20px; border-radius: 30px; font-weight: 850; font-size: 11px;
            letter-spacing: 1px; z-index: 999999; display: flex; align-items: center; gap: 10px;
            box-shadow: 0 10px 30px rgba(0, 230, 118, 0.3); animation: slideDownIn 0.5s ease forwards;
        `;
        toast.innerHTML = `<i class="fas fa-rotate"></i> <span>${msg.toUpperCase()}</span>`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideUpOut 0.5s ease forwards';
            setTimeout(() => toast.remove(), 500);
        }, 3500);
    };

    // CSS for Token Toast
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideDownIn { from { transform: translate(-50%, -100px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        @keyframes slideUpOut { from { transform: translate(-50%, 0); opacity: 1; } to { transform: translate(-50%, -100px); opacity: 0; } }
    `;
    document.head.appendChild(style);

    // 5. INITIALIZATION
    document.addEventListener('DOMContentLoaded', async function () {
        const hasGreeted = sessionStorage.getItem('gttc_greeted');

        // Always inject Notification Panel
        document.body.insertAdjacentHTML('beforeend', notifHTML);

        if (!hasGreeted) {
            // Inject Splash Screen ONLY on first entry of session
            document.body.insertAdjacentHTML('afterbegin', splashHTML);

            // Remove splash after 3 seconds
            setTimeout(() => {
                const splash = document.getElementById('gttc-splash');
                if (splash) {
                    splash.style.opacity = '0';
                    setTimeout(() => splash.remove(), 600);
                }
            }, 3000);

            // 🔊 VOICE: Chrome Autoplay Policy - must trigger on FIRST USER CLICK
            const voiceGreet = () => {
                if (!sessionStorage.getItem('gttc_greeted')) {
                    GTTCVoice.speak("Welcome to GTTC 24. Safe and Secure GTTC.");
                    sessionStorage.setItem('gttc_greeted', 'true');
                }
                document.removeEventListener('click', voiceGreet);
                document.removeEventListener('touchstart', voiceGreet);
            };
            document.addEventListener('click', voiceGreet, { once: true });
            document.addEventListener('touchstart', voiceGreet, { once: true });
        }

        // 🔥 Wait for Firebase db (replaces Supabase)
        let ready = false;
        for (let i = 0; i < 30; i++) {
            if (window.db) { ready = true; break; }
            await new Promise(r => setTimeout(r, 200));
        }
        if (ready) initNotificationListener();
    });

    window.openNotifPanel = function () {
        document.getElementById('notif-panel').style.display = 'flex';
        loadNotifications();
    };

    window.closeNotifPanel = function () {
        document.getElementById('notif-panel').style.display = 'none';
    };

    function initNotificationListener() {
        if (!window.db) return;
        // 🔥 Firebase Firestore Realtime listener for new notices
        window.db.collection('notices')
            .orderBy('timestamp', 'desc')
            .limit(1)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type === 'added') {
                        const savedId = localStorage.getItem('last_notice_id');
                        const newId = change.doc.id;
                        if (savedId !== newId) {
                            GTTCVoice.playNotifSound();
                            updateBellBadge(true);
                            localStorage.setItem('last_notice_id', newId);
                        }
                    }
                });
            }, err => console.warn('Notice listener error:', err));
    }

    async function loadNotifications() {
        const listContainer = document.getElementById('notif-list');
        if (!window.db) return;

        try {
            const snapshot = await window.db.collection('notices')
                .orderBy('timestamp', 'desc')
                .limit(15)
                .get();

            if (snapshot.empty) {
                listContainer.innerHTML = '<div style="padding:40px; text-align:center; color:rgba(255,255,255,0.3); font-size:12px;">No updates found.</div>';
                return;
            }

            let html = '';
            snapshot.forEach(doc => {
                const notice = doc.data();
                const date = notice.timestamp ? new Date(notice.timestamp.toDate ? notice.timestamp.toDate() : notice.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently';
                html += `
                <div style="padding:15px; border-bottom:1px solid rgba(255,255,255,0.03); display:flex; gap:12px; cursor:pointer;" onclick="window.location.href='student-list.html'">
                    <div style="width:10px; height:10px; border-radius:50%; background:#2979FF; margin-top:5px; flex-shrink:0; box-shadow:0 0 10px #2979FF;"></div>
                    <div style="flex:1;">
                        <div style="font-size:13px; font-weight:700; color:#eee; margin-bottom:4px; line-height:1.4;">${notice.title || 'New Notice'}</div>
                        <div style="font-size:10px; color:rgba(255,255,255,0.4); font-weight:600;">${date} • ${notice.type || 'Announcement'}</div>
                    </div>
                </div>
                `;
            });
            listContainer.innerHTML = html;
            updateBellBadge(false);
        } catch (e) {
            console.error("Notif load error:", e);
        }
    }

    function updateBellBadge(show) {
        const badge = document.getElementById('global-badge');
        if (badge) badge.style.display = show ? 'flex' : 'none';
        const bell = document.getElementById('global-bell-icon');
        if (bell && show) bell.classList.add('notif-shake');
        else if (bell) bell.classList.remove('notif-shake');
    }

})();

// Export for other scripts
window.GTTCVoice = window.GTTCVoice || {};

// Ensure voice loads
if ('speechSynthesis' in window) {
    window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function () {
        window.speechSynthesis.getVoices();
    };
}
