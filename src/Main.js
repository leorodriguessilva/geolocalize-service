'use strict';

const GeolocalizeEventHandler = require('./handler/GeolocalizeEventHandler');
const GeolocalizeServiceFactory = require('./service/GeolocalizeServiceFactory');
const { initializeLogger } = require('../logger/LogManager');

initializeLogger(process.env.loggerType);
const serviceFactory = new GeolocalizeServiceFactory(process.env);
const handler = new GeolocalizeEventHandler(serviceFactory, process.env.amountQueriesProcessing);

module.exports.handler = handler.geolocalize;