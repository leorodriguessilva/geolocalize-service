"use strict";
const CassandraGeolocalizationApiResultDao = require('./dao/CassandraGeolocalizationApiResultDao');


const geolocalizationApiResultDao = new CassandraGeolocalizationApiResultDao(env.databaseServerAddress, env.user, env.pass);
const cacheConnection = getCacheConnection(env.cacheServerAddress);
const mapsApiKey = env.mapsApiKey;

const geolocalizationQuery = event.geolocalizationQuery;

var latlon = cacheConnection.get(geolocalizationQuery);

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
    saveInDatabase(databaseConnection, geolocalizationQuery, latlon);
    geolocalizationApiResultDao.shutdown();
    return latlon;
}

function findLatLonInDatabase(geolocalizationQuery) {
    var geolocalizationApiResult = geolocalizationApiResultDao.findByQuery(geolocalizationQuery);
    return [geolocalizationApiResult.longitude, geolocalizationApiResult.latitude];
}