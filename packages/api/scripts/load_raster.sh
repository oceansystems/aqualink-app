# Download NOAA Climatology NETCDF file
wget -nc ftp://ftp.star.nesdis.noaa.gov/pub/sod/mecb/crw/data/5km/v3.1/climatology/nc/ct5km_climatology_v3.1.nc

# Transform into a Cloud Optimized Geotiff - https://www.cogeo.org/
gdal_translate NETCDF:"./ct5km_climatology_v3.1.nc":sst_clim_mmm sst_clim_mmm.tiff -co COMPRESS=LZW -co TILED=YES

rm ./ct5km_climatology_v3.1.nc
