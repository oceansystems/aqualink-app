// Use require because of TS issues...
// https://github.com/niieani/hashids.js/issues/210
const Hashids = require('hashids/cjs');

const hasher = new Hashids(process.env.URL_SALT || process.env.APP_SECRET, 10);

export const hashId = (id: number) => hasher.encode(id);
export const idFromHash = (hash: string) => hasher.decode(hash)[0];
// Check to see if an id is valid - basically it must be an integer string with no extra characters
export const isValidId = (id: string) => id.match(/^[0-9]+$/);

// Get YouTube ID from various YouTube URL
// Same as function `getYouTubeVideoId` in `packages/website/src/helpers/video.ts`
// Works for the following url format:
// - https://www.youtube.com/embed/videoID/?someArgs
export const getYouTubeVideoId = (url: string) => {
  const urlParts = url?.split('?')[0]?.split('/embed/');

  // For an expected video url format we expect the url to be split in 2 parts
  // E.g. ["https://www.youtube.com", "videoID/"]
  if (urlParts.length !== 2) {
    return undefined;
  }

  // Remove any trailing forward slash '/'
  return urlParts[1].replace('/', '');
};
