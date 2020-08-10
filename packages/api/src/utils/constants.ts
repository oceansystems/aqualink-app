// dotenv is a dev dependency, so conditionally import it (don't need it in Prod).
try {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  require('dotenv').config();
} catch {
  // Pass
}

// Sofar API urls and token
export const { SOFAR_API_TOKEN } = process.env;
export const SOFAR_MARINE_URL =
  'https://api.sofarocean.com/marine-weather/v1/models/';
export const SOFAR_SPOTTER_URL = 'https://api.sofarocean.com/api/wave-data';
