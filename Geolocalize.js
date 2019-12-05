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

    const amountQueriesProcessing = env.amountQueriesProcessing;
    const geolocalizationQueries = event.geolocalizationQueries;
    const resultQueries = [];
    const queriesNotProcessed = [];
    
    for (var i = 0; i < geolocalizationQueries.length; i++) {
        const geolocalizationQuery = geolocalizationQueries[i];
        if (i >= amountQueriesProcessing) {
            queriesNotProcessed[index] = geolocalizationQuery;
            continue;
        }

        var latlon = await geolocalizeService.geolocalize(geolocalizationQuery);
        resultQueries[geolocalizationQuery] = latlon;
    }

    geolocalizeService.shutdown();

    if(queriesNotProcessed.length > 0) {
        console.log(`Reached max limit of queries of ${amountQueriesProcessing} ignoring queries ${JSON.stringify(queriesNotProcessed)}`);
    }

    return resultQueries;
}

const env = Environment;

const event = Event;

var typeCache = process.argv[2];
var localizationQueries = JSON.parse(process.argv[3]);

if(localizationQueries) {
    event.geolocalizationQueries = localizationQueries;
}

if(typeCache) {
    event.typeCache = parseInt(typeCache);
}

module.exports.handler = geolocalize;

geolocalize(event, env).then(resultQueries => {
    console.log(Object.entries(resultQueries));
});