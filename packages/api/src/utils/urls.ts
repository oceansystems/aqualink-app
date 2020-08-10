// Use require because of TS issues...
// https://github.com/niieani/hashids.js/issues/210
const Hashids = require('hashids/cjs');

const hasher = new Hashids(process.env.URL_SALT || process.env.APP_SECRET, 10);

export const hashId = (id: number) => hasher.encode(id);
export const idFromHash = (hash: string) => hasher.decode(hash)[0];
// Check to see if an id is valid - basically it must be an integer string with no extra characters
export const isValidId = (id: string) => id.match(/^[0-9]+$/);
