const isBeforeNow = require('../util/Util');

class CacheGeolocalizationResultService {

    constructor(
        environmentConfig,
        daoFactory,
        cacheFactory) {
        this.environmentConfig = environmentConfig;
        this.geolocalizationApiResultDao = daoFactory.create();
        this.geolocalizationApiResultCache = cacheFactory.create();
    }

    async saveCache(geolocalizationQuery, latlon) { 
        this.geolocalizationApiResultCache.add(geolocalizationQuery, JSON.stringify(latlon));
    }

    async findInCacheByQuery(geolocalizationQuery) { 
        var response = await this.geolocalizationApiResultCache.get(geolocalizationQuery);
        if(response) {
            return JSON.parse(response);
        }
        return null;
    }

    async saveDatabase(geolocalizationQuery, locations) {
        const geolocalizationApiResult = {
            query: geolocalizationQuery, 
            locations,
            expireAt: this.getDatabaseExpireAt(), 
        };
        await this.geolocalizationApiResultDao.save(geolocalizationApiResult);
    }

    async findInDatabaseByQuery(geolocalizationQuery) { 
        var geolocalizationApiResult = await this.geolocalizationApiResultDao.findByQuery(geolocalizationQuery);
        if(!geolocalizationApiResult) {
            return null;
        }
        
        if(isBeforeNow(geolocalizationApiResult.expireAt)) {
            this.geolocalizationApiResultDao.delete(geolocalizationApiResult);
            return null;
        }
        
        return geolocalizationApiResult.locations;
    }

    shutdown() {
        this.geolocalizationApiResultCache.shutdown();
        this.geolocalizationApiResultDao.shutdown(); 
    }
    
    getDatabaseExpireAt() {
        var expireAt = new Date();
        expireAt.setYear(expireAt.getFullYear() + this.environmentConfig.expireDatabaseYears);
        expireAt.setMonth((expireAt.getMonth() + 1) + this.environmentConfig.expireDatabaseMonths);
        expireAt.setDate(expireAt.getDate() + this.environmentConfig.expireDatabaseDays);
        return expireAt.getTime();
    }

}

module.exports = CacheGeolocalizationResultService;