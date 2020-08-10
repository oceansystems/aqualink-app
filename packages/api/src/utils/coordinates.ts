export type Extent = [number, number, number, number];

export function pointToPixel(
  long: number,
  lat: number,
  boundingBox: Extent,
  width: number,
  height: number,
) {
  const [minLong, minLat, maxLong, maxLat] = boundingBox;

  const geoWidth = Math.abs(maxLong - minLong);
  const geoHeight = Math.abs(maxLat - minLat);

  const tempLong = ((long - minLong) % 360) + minLong;
  const tempLat = ((lat - minLat) % 180) + minLat;

  // Pixel (0, 0) is the top left corner.
  const pixelX = Math.round(((tempLong - minLong) / geoWidth) * width);
  const pixelY = height - Math.round(((tempLat - minLat) / geoHeight) * height);

  return { pixelX, pixelY };
}
