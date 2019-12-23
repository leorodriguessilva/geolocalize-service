const NoGeolocalizationApiResultCache = require('./NoGeolocalizationApiResultCache');
const RedisGeolocalizationApiResultCache = require('./RedisGeolocalizationApiResultCache');
const TypeCacheEnum = require('../domain/TypeCache');

class CacheFactory {

    constructor(typeCache) {
        this.typeCache = typeCache;
    }

    create() {
        if (this.typeCache == TypeCacheEnum.MEMORY_AND_PERSISTENT_CACHE 
            || this.typeCache == TypeCacheEnum.ONLY_MEMORY_CACHE) {
            return this._createCachedAccess();
        }
        return this._createNoCachedAccess();
    }

    _createNoCachedAccess() {
        if (this.geolocalizationApiResultCache) {
            return this.geolocalizationApiResultCache;
        }
        this.geolocalizationApiResultCache = new NoGeolocalizationApiResultCache();
        return this.geolocalizationApiResultCache;
    }

    _createCachedAccess() {
        if (this.geolocalizationApiResultCache) {
            return this.geolocalizationApiResultCache
        }
        this.geolocalizationApiResultCache = new RedisGeolocalizationApiResultCache(
            this.environmentConfig.cacheServerAddress, 
            this.environmentConfig.cacheServerPort, 
            this.environmentConfig.cacheServerPass,
            this.environmentConfig.cacheExpirationInSeconds);
        return this.geolocalizationApiResultCache;
    }

}

module.exports = CacheFactory;