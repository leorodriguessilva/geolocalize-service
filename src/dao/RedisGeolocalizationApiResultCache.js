'use strict';

const { getLogger } = require('../logger/LogManager');
const { promisify } = require('util');

class RedisGeolocalizationApiResultCache {

    constructor(redisClientFactory, expireTimeSeconds) {
        this.redisClientFactory = redisClientFactory;
        this.expireTimeSeconds = expireTimeSeconds;
        this.logger = getLogger();
    }

    async get(key) {
        try {
            return await this.getAsync(key);
        } catch(ex) {
            this.logger.log(ex);
        }
    }

    async add(key, value) {
        try {
            await this.addAsync(key, value, 'EX', this.expireTimeSeconds);
        } catch(ex) {
            this.logger.log(ex);
        }
    }

    connect() {
        this.client = this.redisClientFactory.create();
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.addAsync = promisify(this.client.set).bind(this.client);
    }

    shutdown() {
        this.client.quit();
    }

}

module.exports = RedisGeolocalizationApiResultCache;
