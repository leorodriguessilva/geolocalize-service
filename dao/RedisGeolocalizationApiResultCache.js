"use strict";
var redis = require("redis");

class RedisGeolocalizationApiResultCache {

    constructor(hostAddress, pass) {
        this.client = redis.createClient(hostAddress, {
            password: pass,
        });
    }

    get(key) {
        return this.client.get(key);
    }

    add(key, value) {
        return this.client.set(key, value);
    }

}
