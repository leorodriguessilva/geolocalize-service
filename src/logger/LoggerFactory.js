'use strict';

const ConsoleLogger = require('./ConsoleLogger');
const FakeLogger = require('./FakeLogger');
const LoggerType = require('./LoggerType');

class LoggerFactory {

    constructor(loggerType) {
        this.loggerType = loggerType;
    }

    create() {
        if (this.loggerType == LoggerType.CONSOLE) {
            return new ConsoleLogger();
        }
        return new FakeLogger();
    }

    static getInstance() {
        return 
    }

}

module.exports = LoggerFactory;