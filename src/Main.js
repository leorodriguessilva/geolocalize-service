'use strict';

const GeolocalizationServiceFactory = require('./service/GeolocalizationServiceFactory');
const GeolocalizeEventHandler = require('./handler/GeolocalizeEventHandler');
const { initializeLogger } = require('./logger/LogManager');

initializeLogger(process.env.loggerType);
const serviceFactory = new GeolocalizationServiceFactory(process.env);
const handler = new GeolocalizeEventHandler(serviceFactory, process.env.amountQueriesProcessing);

module.exports.handler = (event) => { 
    return handler.geolocalize(event);
}