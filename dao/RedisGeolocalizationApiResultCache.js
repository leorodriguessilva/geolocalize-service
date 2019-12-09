"use strict";
const RedisClient = require("redis");
const { promisify } = require('util');

class RedisGeolocalizationApiResultCache {

    constructor(hostAddress, hostPort, pass, expireTimeSeconds) {
        this.expireTimeSeconds = expireTimeSeconds;
        this.client = RedisClient.createClient(hostAddress + ":" + hostPort);
        this.client.on("connect", function () {
            console.log("Connected to the cache server");
        });
        this.client.on("error", function (err) {
            console.log("Error: " + err);
        });
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.addAsync = promisify(this.client.set).bind(this.client);
    }

    async get(key) {
        try {
            return await this.getAsync(key);
        } catch(ex) {
            console.log(ex);
        }
    }

    async add(key, value) {
        try {
            await this.addAsync(key, value, 'EX', this.expireTimeSeconds);
        } catch(ex) {
            console.log(ex);
        }
    }

    shutdown() {
        this.client.quit();
    }

}

module.exports = RedisGeolocalizationApiResultCache;
