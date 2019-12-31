'use strict';

const { getLogger } = require('../logger/LogManager');

class GeolocalizeEventHandler {
    
    constructor(geolocalizeServiceFactory, amountQueriesProcessing) {
        this.geolocalizeServiceFactory = geolocalizeServiceFactory;
        this.amountQueriesProcessing = amountQueriesProcessing;
    }
    
    async geolocalize(event) {    
        const geolocalizeService = this.geolocalizeServiceFactory.create(event);
    
        const geolocalizationQueries = event.queries;
        const resultQueries = new Map();
        const queriesNotProcessed = [];
        
        for (var i = 0; i < geolocalizationQueries.length; i++) {
            const geolocalizationQuery = geolocalizationQueries[i];
            if (i >= this.amountQueriesProcessing) {
                queriesNotProcessed[i] = geolocalizationQuery;
                continue;
            }
    
            var locations = await geolocalizeService.geolocalize(geolocalizationQuery);
            resultQueries.set(geolocalizationQuery, locations);
        }
    
        geolocalizeService.shutdown();
    
        if(queriesNotProcessed.length > 0) {
            getLogger().log(`Reached max limit of queries of ${amountQueriesProcessing} ignoring queries ${JSON.stringify(queriesNotProcessed)}`);
        }
    
        const response = {
            statusCode: 200,
            resultQueries,
        };
    
        return response;
    }
}

module.exports = GeolocalizeEventHandler;