/**
 * Centralized API Key & Secrets Registry for zayd-portfolio
 *
 * Stores all API keys and credentials in one file and allows calling any key
 * by its Name (e.g. "KAPSO_API_KEY") or ID/Alias (e.g. "kapso").
 */

const fs = require("fs");
const path = require("path");

// 1. Auto-load environment variables from .env.local or .env if present
function loadEnvFiles() {
  const envFiles = [".env.local", ".env"];
  for (const envFile of envFiles) {
    const envPath = path.resolve(process.cwd(), envFile);
    const altEnvPath = path.join(__dirname, envFile);
    const targetPath = fs.existsSync(envPath) ? envPath : fs.existsSync(altEnvPath) ? altEnvPath : null;

    if (targetPath) {
      try {
        const content = fs.readFileSync(targetPath, "utf8");
        content.split("\n").forEach((line) => {
          const match = line.match(/^\s*([\w.-]+)\s*=\s*"?([^"\r\n]+)"?\s*$/);
          if (match && !process.env[match[1]]) {
            process.env[match[1]] = match[2];
          }
        });
      } catch {
        // Silently skip if unreadable
      }
    }
  }
}

// Initial environment scan
loadEnvFiles();

/**
 * Master Registry of all API Keys and Credentials
 */
const KEY_REGISTRY = [
  {
    id: "kapso",
    name: "KAPSO_API_KEY",
    aliases: ["KAPSO_API_KEY", "WHATSAPP_TOKEN", "kapso_key", "kapso"],
    defaultValue: "",
    description: "Kapso WhatsApp Cloud API Key"
  },
  {
    id: "whatsapp_phone_id",
    name: "WHATSAPP_PHONE_NUMBER_ID",
    aliases: ["WHATSAPP_PHONE_NUMBER_ID", "PHONE_NUMBER_ID", "whatsapp_phone_id", "phone_id"],
    defaultValue: "",
    description: "WhatsApp Business Phone Number ID"
  },
  {
    id: "whatsapp_verify",
    name: "WHATSAPP_VERIFY_TOKEN",
    aliases: ["WHATSAPP_VERIFY_TOKEN", "VERIFY_TOKEN", "whatsapp_verify", "verify_token"],
    defaultValue: "",
    description: "WhatsApp Webhook Verification Token"
  },
  {
    id: "webhook_secret",
    name: "KAPSO_WEBHOOK_SECRET",
    aliases: ["KAPSO_WEBHOOK_SECRET", "WEBHOOK_SECRET", "webhook_secret", "kapso_secret"],
    defaultValue: "",
    description: "Kapso Webhook HMAC Secret"
  },
  {
    id: "admin_api_key",
    name: "ADMIN_API_KEY",
    aliases: ["ADMIN_API_KEY", "ADMIN_KEY", "admin_api_key", "admin_key"],
    defaultValue: "",
    description: "Secret key the private admin mobile app sends to manage the portfolio (min 20 chars)"
  },
  {
    id: "cv_build_key",
    name: "CV_BUILD_KEY",
    aliases: ["CV_BUILD_KEY", "cv_build_key"],
    defaultValue: "",
    description: "Secret shared with the GitHub Action that compiles the CV (min 20 chars)"
  },
  {
    id: "cron_secret",
    name: "CRON_SECRET",
    aliases: ["CRON_SECRET", "cron_secret"],
    defaultValue: "",
    description: "Secret Vercel Cron sends to trigger scheduled jobs (min 20 chars)"
  },
  {
    id: "mongodb",
    name: "MONGODB_URI",
    aliases: ["MONGODB_URI", "MONGODB_URL", "MONGO_URI", "mongodb_uri", "mongodb", "mongo"],
    defaultValue: "",
    description: "MongoDB Atlas Connection URI"
  },
  {
    id: "cloudinary",
    name: "CLOUDINARY_URL",
    aliases: ["CLOUDINARY_URL", "CLOUDINARY", "cloudinary_url", "cloudinary"],
    defaultValue: "",
    description: "Cloudinary CDN Configuration URL"
  },
  {
    id: "github",
    name: "GITHUB_TOKEN",
    aliases: ["GITHUB_TOKEN", "GH_TOKEN", "github_token", "github"],
    defaultValue: "",
    description: "GitHub Personal Access Token for Portfolio Auto-Sync"
  },
  {
    id: "whatsapp_phone",
    name: "WHATSAPP_PHONE",
    aliases: ["WHATSAPP_PHONE", "RECIPIENT_PHONE", "ADMIN_PHONE", "whatsapp_phone", "admin_phone"],
    defaultValue: "",
    description: "Admin WhatsApp Target Phone Number"
  },
  {
    id: "vercel_oidc",
    name: "VERCEL_OIDC_TOKEN",
    aliases: ["VERCEL_OIDC_TOKEN", "VERCEL_TOKEN", "vercel_oidc_token", "vercel_oidc"],
    defaultValue: "",
    description: "Vercel Deployment OIDC Token"
  },
  {
    id: "kapso_base_url",
    name: "KAPSO_BASE_URL",
    aliases: ["KAPSO_BASE_URL", "WHATSAPP_BASE_URL", "kapso_base_url", "base_url"],
    defaultValue: "https://api.kapso.ai/meta/whatsapp",
    description: "Kapso WhatsApp API Proxy Base URL"
  },
  {
    id: "pushbullet",
    name: "PUSHBULLET_TOKEN",
    aliases: ["PUSHBULLET_TOKEN", "PUSHBULLET", "pushbullet_token", "pushbullet"],
    defaultValue: "",
    description: "Pushbullet Access Token for Mobile Push Notifications"
  },
  {
    id: "port",
    name: "PORT",
    aliases: ["PORT", "SERVER_PORT", "port"],
    defaultValue: "3000",
    description: "Server Listen Port"
  }
];

// Fast lookup map cache
const lookupMap = new Map();

function buildLookupMap() {
  KEY_REGISTRY.forEach((entry) => {
    lookupMap.set(entry.id.toLowerCase(), entry);
    lookupMap.set(entry.name.toLowerCase(), entry);
    if (Array.isArray(entry.aliases)) {
      entry.aliases.forEach((alias) => {
        lookupMap.set(alias.toLowerCase(), entry);
      });
    }
  });
}

buildLookupMap();

/**
 * Retrieve an API key by Name or ID
 * @param {string} nameOrId - Key identifier (e.g. 'KAPSO_API_KEY', 'kapso', 'mongodb', 'CLOUDINARY_URL')
 * @param {string} [fallback] - Optional fallback value if key is not found or empty
 * @returns {string} The resolved API key value
 */
function getKey(nameOrId, fallback = null) {
  if (!nameOrId || typeof nameOrId !== "string") {
    return fallback || "";
  }

  const query = nameOrId.trim();
  const lowerQuery = query.toLowerCase();

  // 1. Check direct process.env match first
  if (process.env[query] && process.env[query].trim() !== "") {
    return process.env[query].trim();
  }

  // 2. Check registered mapping by ID, Name, or Aliases
  const registered = lookupMap.get(lowerQuery);
  if (registered) {
    // Check all alias environment variables
    for (const alias of [registered.name, ...registered.aliases]) {
      if (process.env[alias] && process.env[alias].trim() !== "") {
        return process.env[alias].trim();
      }
    }
    // Fall back to registered default value if env is missing
    if (registered.defaultValue) {
      return registered.defaultValue;
    }
  }

  // 3. Check case-insensitive process.env match as fallback
  for (const envKey of Object.keys(process.env)) {
    if (envKey.toLowerCase() === lowerQuery && process.env[envKey].trim() !== "") {
      return process.env[envKey].trim();
    }
  }

  return fallback !== null ? fallback : "";
}

/**
 * Alias for getKey
 */
const getApiKey = getKey;

/**
 * Check if a non-empty key exists by Name or ID
 * @param {string} nameOrId
 * @returns {boolean}
 */
function hasKey(nameOrId) {
  const value = getKey(nameOrId);
  return Boolean(value && value.trim() !== "");
}

/**
 * Set or update an API key in memory and process.env
 * @param {string} nameOrId - Key Name or ID
 * @param {string} value - New key value
 */
function setKey(nameOrId, value) {
  if (!nameOrId) return;
  const lowerQuery = nameOrId.trim().toLowerCase();
  const registered = lookupMap.get(lowerQuery);

  const targetEnvName = registered ? registered.name : nameOrId.trim();
  process.env[targetEnvName] = value;

  if (registered) {
    registered.aliases.forEach((alias) => {
      process.env[alias] = value;
    });
  }
}

/**
 * Get all registered keys as an object
 * @param {boolean} [maskValues=true] - Hide sensitive characters (default: true)
 * @returns {Object<string, { id: string, name: string, value: string, description: string }>}
 */
function getAllKeys(maskValues = true) {
  const result = {};
  KEY_REGISTRY.forEach((entry) => {
    const rawVal = getKey(entry.id);
    let displayVal = rawVal;
    if (maskValues && rawVal) {
      if (rawVal.length > 8) {
        displayVal = `${rawVal.slice(0, 4)}...${rawVal.slice(-4)}`;
      } else {
        displayVal = "********";
      }
    }
    result[entry.id] = {
      id: entry.id,
      name: entry.name,
      value: displayVal,
      description: entry.description,
      isPresent: Boolean(rawVal)
    };
  });
  return result;
}

/**
 * Helper to get pre-structured credentials for specific services
 * @param {'kapso'|'cloudinary'|'mongodb'|'github'} serviceId
 */
function getCredentials(serviceId) {
  const id = (serviceId || "").toLowerCase();

  switch (id) {
    case "kapso":
    case "whatsapp":
      return {
        kapsoApiKey: getKey("kapso"),
        phoneNumberId: getKey("whatsapp_phone_id"),
        verifyToken: getKey("whatsapp_verify"),
        webhookSecret: getKey("webhook_secret"),
        baseUrl: getKey("kapso_base_url"),
        adminPhone: getKey("whatsapp_phone")
      };

    case "cloudinary": {
      const cloudUrl = getKey("cloudinary");
      let parsed = { url: cloudUrl };
      if (cloudUrl) {
        const match = cloudUrl.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/i);
        if (match) {
          parsed = {
            apiKey: match[1],
            apiSecret: match[2],
            cloudName: match[3],
            secure: true,
            url: cloudUrl
          };
        }
      }
      return parsed;
    }

    case "mongodb":
      return {
        uri: getKey("mongodb")
      };

    case "github":
      return {
        token: getKey("github")
      };

    default:
      return { value: getKey(serviceId) };
  }
}

module.exports = {
  getKey,
  getApiKey,
  hasKey,
  setKey,
  getAllKeys,
  getCredentials,
  KEY_REGISTRY
};
