'use strict';
const DaoFactory = require('./dao/DaoFactory');
const CacheFactory = require('./dao/CacheFactory');
const GeocodeServiceFactory = require('./geocode/GeocodeServiceFactory');
const GeolocalizeService = require('./service/GeolocalizeService');
const CacheGeolocalizationResultService = require('./service/CacheGeolocalizationResultService');

async function geolocalize(event) {
    const daoFactory = new DaoFactory(event.typeCache);
    const cacheFactory = new CacheFactory(event.typeCache);
    const cacheGeolocaliztionResultService = new CacheGeolocalizationResultService(process.env, daoFactory, cacheFactory);

    const geocodeServiceFactory = new GeocodeServiceFactory(process.env.geocodeProvider, process.env);

    const geolocalizeService = new GeolocalizeService(
        cacheGeolocaliztionResultService, 
        geocodeServiceFactory);

    const amountQueriesProcessing = process.env.amountQueriesProcessing;
    const geolocalizationQueries = event.queries;
    const resultQueries = [];
    const queriesNotProcessed = [];
    
    for (var i = 0; i < geolocalizationQueries.length; i++) {
        const geolocalizationQuery = geolocalizationQueries[i];
        if (i >= amountQueriesProcessing) {
            queriesNotProcessed[i] = geolocalizationQuery;
            continue;
        }

        var locations = await geolocalizeService.geolocalize(geolocalizationQuery);
        resultQueries[geolocalizationQuery] = locations;
    }

    geolocalizeService.shutdown();

    if(queriesNotProcessed.length > 0) {
        console.log(`Reached max limit of queries of ${amountQueriesProcessing} ignoring queries ${JSON.stringify(queriesNotProcessed)}`);
    }

    const response = {
        statusCode: 200,
        ...resultQueries,
    };

    return response;
}

module.exports.handler = geolocalize;
module.exports = geolocalize;