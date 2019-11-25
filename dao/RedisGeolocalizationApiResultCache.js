"use strict";
var redis = require("redis");

class RedisGeolocalizationApiResultCache {

    constructor(hostAddress, pass) {
        this.client = redis.createClient(hostAddress, {
            password: pass,
        });
    }

}
