"use strict";

class GeolocalizeService {

    constructor(geolocalizationApiResultDao, redisGeolocalizationApiResultCache, mapsApiKey, dateExpirationConfig) {
        this.geolocalizationApiResultDao = geolocalizationApiResultDao;
        this.redisGeolocalizationApiResultCache = redisGeolocalizationApiResultCache;
        this.mapsApiKey = mapsApiKey;
        this.dateExpirationConfig = {
            amountYears: dateExpirationConfig.amountYears,
            amountMonths: dateExpirationConfig.amountMonths,
            amountDays: dateExpirationConfig.amountDays,
        }
    }
    
    geolocalize(geolocalizationQuery) {
        var latlonRes = this.redisGeolocalizationApiResultCache.get(geolocalizationQuery);
        
        var latlon = null;

        latlonRes.then(response => {
            latlon = response;
        
            latlon = findLatLonInDatabase(geolocalizationQuery);
            
            if(latlon) {
                cacheConnection.add(geolocalizationQuery, latlon);
            }
            
            latlon = findLatLonByExternalApi(geolocalizationQuery);
            
            if(latlon) {
                cacheConnection.add(geolocalizationQuery, latlon);
                saveInDatabase(geolocalizationQuery, latlon[0], latlon[1]);
            }

            if(latlon) {
                return latlon;
            }
        });

        if(latlon) {
            return latlon;
        }
    }

    findLatLonByExternalApi(geolocalizationQuery) {
        var latitude = Math.random() * (max - min) + min;
        var longitude = Math.random() * (max - min) + min;
        return {
            latitude,
            longitude
        }
    }

    shutdown() {
        this.geolocalizationApiResultDao.shutdown();
        this.redisGeolocalizationApiResultCache.shutdown();
    }
    
    findLatLonInDatabase(geolocalizationQuery) {
        var geolocalizationApiResult = this.geolocalizationApiResultDao.findByQuery(geolocalizationQuery);
        return {
            longitude: geolocalizationApiResult.longitude, 
            latitude: geolocalizationApiResult.latitude
        };
    }
    
    saveInDatabase(geolocalizationQuery, latitude, longitude) {
        geolocalizationApiResult = {
            query: geolocalizationQuery, 
            latitude,
            longitude,
            expireAt: getDatabaseExpireAt(), 
        }
        this.geolocalizationApiResultDao.save(geolocalizationApiResult);
    }
    
    getDatabaseExpireAt() {
        var current = new Date();
        var year = current.getFullYear() + this.dateExpirationConfig.amountYears;
        var month = current.getMonth() + this.dateExpirationConfig.amountMonths;
        var day = current.getDate() + this.dateExpirationConfig.amountDays;
        var expireAt = new Date(year, month, day);
        return expireAt;
    }
}

module.exports = GeolocalizeService;