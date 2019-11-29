"use strict";
const GeolocalizeService = require('./service/GeolocalizeService');
const CassandraGeolocalizationApiResultDao = require('./dao/CassandraGeolocalizationApiResultDao');
const RedisGeolocalizationApiResultCache = require('./dao/RedisGeolocalizationApiResultCache');

async function geolocalize(env, event) {
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
            amountYears: 1,
            amountMonths: 2,
            amountDays: 3,
        });

    const geolocalizationQuery = event.geolocalizationQuery;

    var latlon = await geolocalizeService.geolocalize(geolocalizationQuery);
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

var localizationQuery = process.argv[2];

if(!localizationQuery) {
    localizationQuery = '?query';
}

const event = {
    geolocalizationQuery: localizationQuery,
}

geolocalize(env, event).then(latlon => {
    console.log(JSON.stringify(latlon));
});