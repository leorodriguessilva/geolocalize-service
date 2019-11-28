"use strict";
const GeolocalizeService = require('./service/GeolocalizeService');
const CassandraGeolocalizationApiResultDao = require('./dao/CassandraGeolocalizationApiResultDao');
const RedisGeolocalizationApiResultCache = require('./dao/RedisGeolocalizationApiResultCache');

function geolocalize(env, event) {
    const geolocalizationApiResultDao = new CassandraGeolocalizationApiResultDao(
        env.databaseServerAddress, 
        env.databaseUser, env.databasePass);

    const redisGeolocalizationApiResultCache = new RedisGeolocalizationApiResultCache(
        env.cacheServerAddress, 
        env.cacheServerPass);
        
    const mapsApiKey = env.mapsApiKey;

    const geolocalizeService = new GeolocalizeService(
        geolocalizationApiResultDao, 
        redisGeolocalizationApiResultCache,
        mapsApiKey,
        {
            amountYear: 1,
            amountMonths: 2,
            amountDays: 3,
        });

    const geolocalizationQuery = event.geolocalizationQuery;

    const latlon = geolocalizeService.geolocalize(geolocalizationQuery);
    geolocalizeService.shutdown();

    return latlon;
}

const env = {
    databaseServerAddress: '127.0.0.1',
    databaseUser: 'user',
    databasePass: 'pass',
    cacheServerAddress: '127.0.0.1',
    cacheServerPass: 'pass',
    mapsApiKey: 'key',
}

const event = {
    geolocalizationQuery: process.argv[2],
}

var latlon = geolocalize(env, event);
console.log(JSON.stringify(latlon));