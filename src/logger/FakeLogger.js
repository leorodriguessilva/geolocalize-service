'use strict';

class FakeLogger {

    log(message, ...params) { }

    log(message) { }

}

module.exports = FakeLogger;