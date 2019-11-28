"use strict";
const redis = require("redis");
const { promisify } = require('util');

class RedisGeolocalizationApiResultCache {

    constructor(hostAddress, pass) {
        this.client = redis.createClient(hostAddress, {
            password: pass,
        });
        this.client.on("error", function (err) {
            console.log("Error: " + err);
        });
        this.getAsync = promisify(this.client.get).bind(this.client);
        this.addAsync = promisify(this.client.set).bind(this.client);
    }

    async get(key) {
        const res = await this.getAsync(key);
        return res;
    }

    async add(key, value) {
        await this.addAsync(key, value, redis.print);
    }

    shutdown() {
        this.client.quit();
    }

}

module.exports = RedisGeolocalizationApiResultCache;
