'use strict';

const LoggerFactory = require('./LoggerFactory');
const LoggerType = require('./LoggerType');

let loggerType = LoggerType.CONSOLE;

let instance = null;

function initializeLogger(paramLoggerType) {
    loggerType = paramLoggerType;
}

function getLogger() {
    if (!instance) {
        instance = new LoggerFactory(loggerType);
    }
    return instance.create();
}

module.exports = {
    getLogger, 
    initializeLogger
};