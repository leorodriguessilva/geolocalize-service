'use strict';

const RedisClient = require('redis');
const { getLogger } = require('../../logger/LogManager');

class RedisClientFactory {

    constructor(envConfig) {
        this.hostAddress = envConfig.cacheServerAddress;
        this.hostPort = envConfig.cacheServerPort;
        this.pass = envConfig.cacheServerPass;
        this.logger = getLogger();
    }

    create() {
        this.client = RedisClient.createClient(`${this.hostAddress}:${this.hostPort}`);
        this.client.on('connect', this._onConnect.bind(this));
        this.client.on('error', this._onConnectError.bind(this));
        return this.client;
    }

    _onConnect() {
        this.logger.log('Connected to the cache server');
    }

    _onConnectError (err) {
        this.logger.log('Error: ' + err);
    }
}

module.exports = RedisClientFactory;