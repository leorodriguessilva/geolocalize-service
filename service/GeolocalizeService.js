"use strict";

class GeolocalizeService {

    constructor(cacheGeolocaliztionResultService, mapsApiKey) {
        this.cacheGeolocaliztionResultService = cacheGeolocaliztionResultService;
        this.mapsApiKey = mapsApiKey;
    }
    
    async geolocalize(geolocalizationQuery) {
        var latlon = await this.cacheGeolocaliztionResultService.findInCacheByQuery(geolocalizationQuery);
        
        if(latlon) {
            return latlon;
        }

        latlon = await this.cacheGeolocaliztionResultService.findInDatabaseByQuery(geolocalizationQuery);
        
        if(latlon) {
            await this.cacheGeolocaliztionResultService.saveCache(geolocalizationQuery, latlon);
            return latlon;
        }
        
        latlon = this.findLatLonByExternalApi(geolocalizationQuery);
        
        if(latlon) {
            await this.cacheGeolocaliztionResultService.saveCache(geolocalizationQuery, latlon);
            await this.cacheGeolocaliztionResultService.saveDatabase(geolocalizationQuery, latlon.latitude, latlon.longitude);
        }

        return latlon;
    }

    findLatLonByExternalApi(geolocalizationQuery) {
        var latitude = Math.random() * (180 - 1) + 1;
        var longitude = Math.random() * (180 - 1) + 1;
        return {
            latitude,
            longitude
        }
    }

    shutdown() {
        this.cacheGeolocaliztionResultService.shutdown();
    }
}

module.exports = GeolocalizeService;

