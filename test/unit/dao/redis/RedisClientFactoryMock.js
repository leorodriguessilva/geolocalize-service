'use strict';

const RedisMock = require('redis-mock');
const { getLogger } = require('../../../../src/logger/LogManager');

class RedisClientFactoryMock {
 
    constructor() {
        this.logger = getLogger();
    }

    create() {
        const client = RedisMock.createClient();
        client.on('connect', this._onConnect.bind(this));
        client.on('error', this._onConnectError.bind(this));
        return client;
    }

    _onConnect() {
        this.logger.log('Connected to the cache server');
    }

    _onConnectError (err) {
        this.logger.log('Error: ' + err);
    }
}

module.exports = RedisClientFactoryMock;