export const mimetypes: Record<string, string[]> = {
  image: ['image/jpeg', 'image/png', 'image/tiff'],
  video: ['video/x-msvideo', 'video/mpeg'],
};

export function validateMimetype(mimetype: string): string | undefined {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(mimetypes)) {
    const belongs = value.findIndex((m) => m === mimetype) !== -1;
    if (belongs) {
      return key;
    }
  }
  return undefined;
}
