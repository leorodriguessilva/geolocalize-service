"use strict";
const GeocodeServiceFactory = require('../geocode/GeocodeServiceFactory');

class GeolocalizeService {

    constructor(cacheGeolocalizationResultService, env) {
        this.cacheGeolocalizationResultService = cacheGeolocalizationResultService;
        this.geocodeService = new GeocodeServiceFactory(env.geocodeProvider, env).create();
    }
    
    async geolocalize(geolocalizationQuery) {
        var locations = await this.cacheGeolocalizationResultService.findInCacheByQuery(geolocalizationQuery);
        
        if(locations) {
            return locations;
        }

        locations = await this.cacheGeolocalizationResultService.findInDatabaseByQuery(geolocalizationQuery);
        
        if(locations) {
            await this.cacheGeolocalizationResultService.saveCache(geolocalizationQuery, locations);
            return locations;
        }
        
        locations = this.findLocationsByExternalApi(geolocalizationQuery);
        
        if(locations) {
            await this.cacheGeolocalizationResultService.saveCache(geolocalizationQuery, locations);
            await this.cacheGeolocalizationResultService.saveDatabase(geolocalizationQuery, locations.latitude, locations.longitude);
        }

        return locations;
    }

    async findLocationsByExternalApi(geolocalizationQuery) {
        return await this.geocodeService.geocode(geolocalizationQuery);
    }

    shutdown() {
        this.cacheGeolocalizationResultService.shutdown();
    }
}

module.exports = GeolocalizeService;

