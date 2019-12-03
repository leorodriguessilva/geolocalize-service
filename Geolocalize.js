"use strict";
const GeolocalizeService = require('./service/GeolocalizeService');
const CacheGeolocaliztionResultService = require('./service/CacheGeolocaliztionResultService');
const Event = require('./domain/MockedEvent');
const Environment = require('./domain/MockedEnvironment');

async function geolocalize(event, env) {
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

const env = Environment;

const event = Event;

var localizationQuery = process.argv[2];
var typeCache = process.argv[3];

if(localizationQuery) {
    event.geolocalizationQuery = localizationQuery;
}

if(typeCache) {
    event.typeCache = new Number(typeCache);
}

module.exports.handler = geolocalize;

geolocalize(event, env).then(latlon => {
    console.log(JSON.stringify(latlon));
});