"use strict";
const GeolocalizeService = require('./service/GeolocalizeService');
const CacheGeolocaliztionResultService = require('./service/CacheGeolocaliztionResultService');
const TypeCacheEnum = require('./domain/TypeCache');

async function geolocalize(env, event) {
    const mapsApiKey = env.mapsApiKey;

    const cacheGeolocaliztionResultService = new CacheGeolocaliztionResultService(env, event.typeCache);

    const geolocalizeService = new GeolocalizeService(
        cacheGeolocaliztionResultService, 
        mapsApiKey);

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
    cacheExpirationInSeconds: 60,
    expireDatabaseYears: 1,
    expireDatabaseMonths: 2,
    expireDatabaseDays: 3,
}

var localizationQuery = process.argv[2];

if(!localizationQuery) {
    localizationQuery = '?query';
}

const event = {
    geolocalizationQuery: localizationQuery,
    typeCache: TypeCacheEnum.MEMORY_AND_PERSISTENT_CACHE,
}

geolocalize(env, event).then(latlon => {
    console.log(JSON.stringify(latlon));
});