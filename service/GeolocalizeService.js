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
    
    async geolocalize(geolocalizationQuery) {
        var latlon = await this.getFromCache(geolocalizationQuery);
        
        if(latlon) {
            return latlon;
        }

        latlon = await this.findLatLonInDatabase(geolocalizationQuery);
        
        if(latlon) {
            await this.addToCache(geolocalizationQuery, latlon);
            return latlon;
        }
        
        latlon = this.findLatLonByExternalApi(geolocalizationQuery);
        
        if(latlon) {
            await this.addToCache(geolocalizationQuery, latlon);
            await this.saveInDatabase(geolocalizationQuery, latlon.latitude, latlon.longitude);
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
        this.geolocalizationApiResultDao.shutdown();
        this.redisGeolocalizationApiResultCache.shutdown();
    }
    
    async findLatLonInDatabase(geolocalizationQuery) {
        var geolocalizationApiResult = await this.geolocalizationApiResultDao.findByQuery(geolocalizationQuery);
        if(!geolocalizationApiResult) {
            return null;
        }
        return {
            longitude: geolocalizationApiResult.longitude, 
            latitude: geolocalizationApiResult.latitude
        };
    }
    
    async saveInDatabase(geolocalizationQuery, latitude, longitude) {
        const geolocalizationApiResult = {
            query: geolocalizationQuery, 
            latitude,
            longitude,
            expireAt: this.getDatabaseExpireAt(), 
        }
        await this.geolocalizationApiResultDao.save(geolocalizationApiResult);
    }
    
    getDatabaseExpireAt() {
        var expireAt = new Date();
        expireAt.setYear(expireAt.getFullYear() + this.dateExpirationConfig.amountYears);
        expireAt.setMonth((expireAt.getMonth() + 1) + this.dateExpirationConfig.amountMonths);
        expireAt.setDate(expireAt.getDate() + this.dateExpirationConfig.amountDays);
        return expireAt;
    }
    
    async addToCache(geolocalizationQuery, latlon) {
        await this.redisGeolocalizationApiResultCache.add(geolocalizationQuery, JSON.stringify(latlon));
    }

    async getFromCache(geolocalizationQuery) {
        var response = await this.redisGeolocalizationApiResultCache.get(geolocalizationQuery);
        if(response) {
            return JSON.parse(response);
        }
        return null;
    }
}

module.exports = GeolocalizeService;

