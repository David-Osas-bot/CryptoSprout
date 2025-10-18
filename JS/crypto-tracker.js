// API endpoint from CoinGecko: fetch top 10 cryptos in USD with market data 
const API = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1';

// Get references to DOM elements
const grid = document.getElementById('grid');
const refreshBtn = document.getElementById('refreshBtn');
const notifyBtn = document.getElementById('notifyBtn');
const alertList = document.getElementById('alertList');
const clearAlertBtn = document.getElementById('clearAlerts');

// Variables to store crypto data and alerts
let coins = [];
let alerts = JSON.parse(localStorage.getItem('crypto_alerts') || '{}');
let notificationEnabled = false;

// Fetch data crypto from API
async function fetchData() {
    try {
        const res = await fetch(API);
        coins = await res.json();
        render();
        checkAlerts();
    } catch (err) {
        console.error('Fetch error', err);
    }
}

// Render Crypto cards in the Grid 
function render() {
    grid.innerHTML = '';
    coins.forEach(coin => {
        const card = document.createElement('div');
        card.className = 'card';

        card.innerHTML = `
        <div class="row">
            <div class="coin-img"><img src="${coin.image}" alt="${coin.symbol}" width="36" height="36"></div>
            <div style="flex: 1;">
                <div style="display: flex; justify-content: space-between; align-items: center">
                    <div>
                        <div class="coin-name">${coin.name}</div>
                        <div class="small">${coin.symbol.toUpperCase()}</div>
                    </div>
                    
                    <div style="text-align: right">
                        <div class="price">$${Number(coin.current_price).toLocaleString()}</div>
                        <div class="change ${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                            ${coin.price_change_percentage_24h !== null ? coin.price_change_percentage_24h.toFixed(2) : 'N/A'}%
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin-top: 10px; display:flex; gap: 8px; align-items:center">
          
            <div class="small" style="margin-left:auto">Market Cap: $${Number(coin.market_cap).toLocaleString()}</div>
        </div>
        `;
        grid.appendChild(card);
    });
    attachSetAlertHandlers();
    renderAlertList();
}

// Add event handlers for alert buttons
function attachSetAlertHandlers() {
    document.querySelectorAll('button.btn[data-coin]').forEach(btn => {
        btn.onclick = () => {
            const coinId = btn.dataset.coin;
            const field = document.getElementById(btn.dataset.priceField);
            const val = Number(field.value);

            if (!val || val <= 0) {
                alert('Enter a valid alert price');
                return;
            }

            alerts[coinId] = val;
            localStorage.setItem('crypto_alerts', JSON.stringify(alerts));
            renderAlertList();
            field.value = '';
        };
    });
}

// Render active alerts list
function renderAlertList() {
    alertList.innerHTML = '';
    const entries = Object.entries(alerts);
    if (entries.length === 0) {
        alertList.innerHTML = '<div class="small">No active alerts</div>';
        return;
    }
    entries.forEach(([coinId, price]) => {
        const coin = coins.find(c => c.id === coinId);
        const name = coin ? coin.name : coinId;
        const el = document.createElement('div');
        el.className = 'alert-item';
        el.innerHTML = `
            <div>${name} - $${price}</div>
            <div><button class="btn" data-remove="${coinId}">Remove</button></div>
        `;
        alertList.appendChild(el);
    });

    document.querySelectorAll('button[data-remove]').forEach(b => {
        b.onclick = () => {
            delete alerts[b.dataset.remove];
            localStorage.setItem('crypto_alerts', JSON.stringify(alerts));
            renderAlertList();
        };
    });
}

// // Check if any alerts are triggered
// function checkAlerts() {
//     Object.entries(alerts).forEach(([coinId, target]) => {
//         const coin = coins.find(c => c.id === coinId);
//         if (!coin) return;
//         const current = coin.current_price;
//         if (current <= target) {
//             notify(`${coin.name} hit $${current} (target $${target})`);
//             delete alerts[coinId];
//             localStorage.setItem('crypto_alerts', JSON.stringify(alerts));
//             renderAlertList();
//         }
//     });
// }

// // Show notifications [browser or alert popup]
// function notify(message) {
//     if ('Notification' in window && Notification.permission === 'granted' && notificationEnabled) {
//         new Notification('Crypto Alert', { body: message });
//     } else {
//         alert(message);
//     }
// }

// // Button events
// refreshBtn.addEventListener('click', fetchData);

// clearAlertBtn.addEventListener('click', () => {
//     alerts = {};
//     localStorage.setItem('crypto_alerts', JSON.stringify(alerts));
//     renderAlertList();
// });

// notifyBtn.addEventListener('click', async () => {
//     if (!('Notification' in window)) return alert('Browser notifications not supported');
//     const perm = await Notification.requestPermission();
//     notificationEnabled = perm === 'granted';
//     notifyBtn.textContent = notificationEnabled ? 'Notifications Enabled' : 'Enable Notification';
// });

// Initial fetch + auto refresh
fetchData();
setInterval(fetchData, 5000);
