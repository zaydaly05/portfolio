const fs = require('fs');
const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// Clean up stale session lock files if present
const sessionDir = path.join(__dirname, '..', '.wwebjs_auth', 'session');
if (fs.existsSync(sessionDir)) {
  const lockFiles = ['SingletonLock', 'SingletonSocket', 'SingletonCookie', 'lockfile'];
  lockFiles.forEach(file => {
    const filePath = path.join(sessionDir, file);
    if (fs.existsSync(filePath)) {
      try { fs.unlinkSync(filePath); } catch {}
    }
  });
}

const WHATSAPP_PHONE = process.env.WHATSAPP_PHONE || '201017741741';
const formattedNumber = WHATSAPP_PHONE.replace(/[^0-9]/g, '') + '@c.us';

console.log("==================================================");
console.log("🚀 STARTING TERMINAL WHATSAPP BOT ENGINE...");
console.log("==================================================");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  }
});

client.on('qr', (qr) => {
  console.log('\n📱 SCAN THIS QR CODE WITH YOUR PHONE WHATSAPP (Linked Devices):\n');
  qrcode.generate(qr, { small: true });
  console.log('\n📌 Open WhatsApp on your phone -> Settings/Menu -> Linked Devices -> Link a Device\n');
});

client.on('ready', async () => {
  console.log('✅ WHATSAPP TERMINAL BOT IS ONLINE & AUTHENTICATED!');
  
  const testMessage = process.env.BOT_MSG || '🚀 Zayd Portfolio Terminal WhatsApp Bot is now fully connected & online!';
  try {
    console.log(`📤 Sending message to ${WHATSAPP_PHONE}...`);
    await client.sendMessage(formattedNumber, testMessage);
    console.log('🎉 Message delivered successfully to your phone!');
  } catch (err) {
    console.error('❌ Delivery Error:', err.message);
  }
});

client.on('authenticated', () => {
  console.log('🔐 Session authenticated successfully!');
});

client.on('auth_failure', msg => {
  console.error('❌ Authentication failed:', msg);
});

client.on('message', async msg => {
  if (msg.body === '!ping') {
    msg.reply('pong 🚀 Zayd Portfolio Bot Active!');
  }
});

client.initialize();
