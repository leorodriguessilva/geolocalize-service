'use strict';

const GeolocalizeEventHandler = require('../../src/handler/GeolocalizeEventHandler');
const GeolocalizeServiceFactory = require('../../src/service/GeolocalizationServiceFactory');
const { initializeLogger } = require('../../src/logger/LogManager');
const Event = require('./domain/MockedEvent');
const Environment = require('./domain/MockedEnvironment');

const env = Environment;

const event = Event;

process.env = { ...env};

var typeCache = process.argv[2];
var localizationQueries = process.argv[3];

if(localizationQueries) {
    event.queries = JSON.parse(localizationQueries);
}

if(typeCache) {
    event.typeCache = parseInt(typeCache);
}

initializeLogger(process.env.loggerType);
const serviceFactory = new GeolocalizeServiceFactory(process.env);
const handler = new GeolocalizeEventHandler(serviceFactory, process.env.amountQueriesProcessing);

handler.geolocalize(event).then(resultQueries => {
    console.log(JSON.stringify(resultQueries));
});