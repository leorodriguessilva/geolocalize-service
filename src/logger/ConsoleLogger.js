'use strict';

class ConsoleLogger {

    log(message, ...params) { 
        console.log(message, params);
    }

    log(message) { 
        console.log(message);
    }

}

module.exports = ConsoleLogger;