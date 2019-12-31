'use strict';

const RedisClientFactory = require('../dao/redis/RedisClientFactory');
const DaoFactory = require('../dao/DaoFactory');
const CacheFactory = require('../dao/CacheFactory');
const CacheGeolocalizationResultService = require('./CacheGeolocalizationResultService');
const GeocodeServiceFactory = require('../geocode/GeocodeServiceFactory');
const GeolocalizeService = require('./GeolocalizeService');

class GeolocalizationServiceFactory {

    constructor(envConfig) { 
        this.envConfig = envConfig;
    }

    create(event) {
        const redisClientFactory = new RedisClientFactory(this.envConfig);
        const daoFactory = new DaoFactory(event.typeCache, this.envConfig);
        const cacheFactory = new CacheFactory(event.typeCache, redisClientFactory, this.envConfig.cacheExpirationInSeconds);
        const cacheService = new CacheGeolocalizationResultService(this.envConfig, daoFactory, cacheFactory);
        const geocodeServiceFactory = new GeocodeServiceFactory(process.env.geocodeProvider, process.env);
        return new GeolocalizeService(
            cacheService, 
            geocodeServiceFactory);
        
    }
}

module.exports = GeolocalizationServiceFactory;