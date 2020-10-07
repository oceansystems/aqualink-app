import * as GeoTIFF from 'geotiff';
import { pointToPixel } from './coordinates';

const MMMFileUrl =
  'https://storage.googleapis.com/reef_climatology/sst_clim_mmm.tiff';

/**
 * Corals start to become stressed when the SST is 1°C warmer than the maxiumum monthly mean temperature (MMM).
 * The MMM is the highest temperature out of the monthly mean temperatures over the year (warmest summer month)
 * 1°C above the MMM is called the "bleaching threshhold"
 * When the SST is warmer than the bleaching threshold temperature, the corals will experience heat stress. This heat stress is the main cause of mass coral bleaching.
 * The HotSpot highlights the areas where the SST is above the MMM.
 * The DHW shows how much heat stress has accumulated in an area over the past 12 weeks (3 months). The units for DHW are "degree C-weeks"
 * The DHW adds up the Coral Bleaching HotSpot values whenever the temperature exceeds the bleaching threshold.
 * Bleaching Alerts:
 *      No Stress (no heat stress or bleaching is present): HotSpot of less than or equal to 0.
 *      Bleaching Watch (low-level heat stress is present): HotSpot greater than 0 but less than 1; SST below bleaching threshhold.
 *      Bleaching Warning (heat stress is accumulating, possible coral bleaching): HotSpot of 1 or greater; SST above bleaching threshold; DHW greater than 0 but less than 4.
 *      Bleaching Alert Level 1 (significant bleaching likely): HotSpot of 1 or greater; SST above bleaching threshold; DHW greater than or equal to 4 but less than 8.
 *      Bleaching Alert Level 2 (severe bleaching and significant mortality likely): HotSpot of 1 or greater; SST above bleaching threshold; DHW greater than or equal to 8.
 *
 * DHW = (1/7)*sum[1->84](HS(i) if HS(i) >= 1C)
 * */

export async function getMMM(long: number, lat: number) {
  const tiff = await GeoTIFF.fromUrl(MMMFileUrl);
  const image = await tiff.getImage();

  const gdalNoData = image.getGDALNoData();
  const boundingBox = image.getBoundingBox();
  const width = image.getWidth();
  const height = image.getHeight();

  const { pixelX, pixelY } = pointToPixel(
    long,
    lat,
    boundingBox,
    width,
    height,
  );

  const data: number[][] = await image.readRasters({
    window: [pixelX, pixelY, pixelX + 10, pixelY + 10],
  });

  const filteredData = data.map((row) =>
    row.filter((value) => value !== gdalNoData),
  );

  return filteredData[0][0] ? filteredData[0][0] / 100 : undefined;
}

/**
 * Calculates the Degree Heating Days of a reef location using 12 weeks of data.
 *
 * HS = SST(daily) - MMM if SST(daily) > MMM
 * HS = 0                if SST(daily) <= MMM
 * HS > 1C               bleaching threshold
 *
 * @param {float[]}    seaSurfaceTemperatures        list of seaSurfaceTemperatures
 * @param {float}      maximumMonthlyMean            maximumMonthlyMean for this location
 *
 * @return {float}     degreeHeatingDays             Degree Heating Days
 */

export function calculateDegreeHeatingDays(
  seaSurfaceTemperatures: number[],
  maximumMonthlyMean: number,
) {
  if (seaSurfaceTemperatures.length !== 84) {
    throw new Error(
      'Calculating Degree Heating Days requires exactly 84 days of data.',
    );
  }

  return seaSurfaceTemperatures.reduce((sum, value) => {
    // Calculate deviation.
    const degreeDeviation = value - maximumMonthlyMean;
    // Add degree deviation for days above bleaching threshold (MMM + 1 degree).
    return sum + (degreeDeviation >= 1 ? value - maximumMonthlyMean : 0);
  }, 0);
}
