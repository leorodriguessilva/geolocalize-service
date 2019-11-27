"use strict";
const CassandraGeolocalizationApiResultDao = require('./dao/CassandraGeolocalizationApiResultDao');
const RedisGeolocalizationApiResultCache = require('./dao/RedisGeolocalizationApiResultCache');

const geolocalizationApiResultDao = new CassandraGeolocalizationApiResultDao(
    env.databaseServerAddress, 
    env.databaseUser, env.databasePass);

const redisGeolocalizationApiResultCache = new RedisGeolocalizationApiResultCache(
    env.cacheServerAddress, 
    env.cacheServerPass);

const mapsApiKey = env.mapsApiKey;

const geolocalizationQuery = event.geolocalizationQuery;

var latlon = redisGeolocalizationApiResultCache.get(geolocalizationQuery);

if(latlon) {
    return latlon;
}

latlon = findLatLonInDatabase(databaseConnection, geolocalizationQuery);

if(latlon) {
    cacheConnection.add(geolocalizationQuery, latlon);
    return latlon;
}

latlon = findLatLonByExternalApi(mapsApiKey, geolocalizationQuery);

if(latlon) {
    cacheConnection.add(geolocalizationQuery, latlon);
    saveInDatabase(geolocalizationQuery, latlon[0], latlon[1]);
    geolocalizationApiResultDao.shutdown();
    return latlon;
}

function findLatLonInDatabase(geolocalizationQuery) {
    var geolocalizationApiResult = geolocalizationApiResultDao.findByQuery(geolocalizationQuery);
    return [geolocalizationApiResult.longitude, geolocalizationApiResult.latitude];
}

function saveInDatabase(geolocalizationQuery, latitude, longitude) {
    geolocalizationApiResult = {
        query: geolocalizationQuery, 
        latitude,
        longitude,
        expireAt: getDatabaseExpireAt(), 
    }
    geolocalizationApiResultDao.save(geolocalizationApiResult);
}

function getDatabaseExpireAt() {
    var current = new Date();
    var year = current.getFullYear();
    var month = current.getMonth();
    var day = current.getDate();
    var expireAt = new Date(year + env.amountYearToExpire, month + env.amountMonthToExpire, day + env.amountDayToExpire);
    return expireAt;
}