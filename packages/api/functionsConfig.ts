try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('dotenv').config();
} catch {
  // Pass
}

export const functionsConfig = {
  slack: {
    token: process.env.SLACK_BOT_TOKEN,
    channel: process.env.SLACK_BOT_CHANNEL,
  },
  sofar_api: {
    token: process.env.SOFAR_API_TOKEN,
  },
  front: {
    base_url: process.env.FRONT_END_BASE_URL,
  },
  api: {
    base_url: process.env.BACKEND_BASE_URL,
  },
  google: {
    api_key: process.env.FIREBASE_KEY,
  },
  database: {
    url: process.env.DATABASE_URL,
  },
};

const stringifiedConfigsBySection = Object.entries(functionsConfig)
  .map(([service, keys]) => {
    return Object.entries(keys)
      .map(([key, value]) => {
        return `${service}.${key}=${value}`;
      })
      .join(' ');
  })
  .join(' ');

// eslint-disable-next-line no-console
console.log(stringifiedConfigsBySection);
