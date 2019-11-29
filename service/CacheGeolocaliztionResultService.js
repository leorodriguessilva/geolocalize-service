class CacheGeolocaliztionResultService {
    
    constructor(
        geolocalizationApiResultDao, 
        redisGeolocalizationApiResultCache) {
        this.geolocalizationApiResultDao = geolocalizationApiResultDao;
        this.redisGeolocalizationApiResultCache = redisGeolocalizationApiResultCache;
    }

}