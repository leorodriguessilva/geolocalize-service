"use strict";
const redis = require("redis");
const { promisify } = require('util');

class RedisGeolocalizationApiResultCache {

    constructor(hostAddress, pass) {
        this.client = redis.createClient({
            host: hostAddress,
            password: pass,
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
            await this.addAsync(key, value, 'EX', 60);
        } catch(ex) {
            console.log(ex);
        }
    }

    shutdown() {
        this.client.quit();
    }

}

module.exports = RedisGeolocalizationApiResultCache;
