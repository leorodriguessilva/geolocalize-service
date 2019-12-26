'use strict';

const NoGeolocalizationApiResultCache = require('./NoGeolocalizationApiResultCache');
const RedisGeolocalizationApiResultCache = require('./RedisGeolocalizationApiResultCache');
const TypeCacheEnum = require('../domain/TypeCache');

class CacheFactory {

    constructor(typeCache, redisClientFactory, cacheExpirationInSeconds) {
        this.typeCache = typeCache;
        this.redisClientFactory = redisClientFactory;
        this.cacheExpirationInSeconds = cacheExpirationInSeconds;
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
            this.redisClientFactory,
            this.cacheExpirationInSeconds, 
            );
        this.geolocalizationApiResultCache.connect();
        return this.geolocalizationApiResultCache;
    }

}

module.exports = CacheFactory;