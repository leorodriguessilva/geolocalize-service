'use strict';

class GeolocalizeService {

    constructor(cacheGeolocalizationResultService, geocodeServiceFactory) {
        this.cacheGeolocalizationResultService = cacheGeolocalizationResultService;
        this.geocodeService = geocodeServiceFactory.create();
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
        
        locations = await this.findLocationsByExternalApi(geolocalizationQuery);
        
        if(locations) {
            await this.cacheGeolocalizationResultService.saveCache(geolocalizationQuery, locations);
            await this.cacheGeolocalizationResultService.saveDatabase(geolocalizationQuery, locations);
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

