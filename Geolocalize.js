"use strict";
const GeolocalizeService = require('./service/GeolocalizeService');
const CacheGeolocaliztionResultService = require('./service/CacheGeolocaliztionResultService');

async function geolocalize(event) {
    const mapsApiKey = process.env.mapsApiKey;

    const cacheGeolocaliztionResultService = new CacheGeolocaliztionResultService(process.env, event.typeCache);

    const geolocalizeService = new GeolocalizeService(
        cacheGeolocaliztionResultService, 
        mapsApiKey);

    const amountQueriesProcessing = process.env.amountQueriesProcessing;
    const geolocalizationQueries = event.queries;
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

    const response = {
        statusCode: 200,
        ...resultQueries,
    }

    return response;
}

module.exports.handler = geolocalize;
