'use strict';
const geocodeClientFactory = require('@google/maps');
const { RESPONSE_OK } = require('../constants/GeolocalizeConstants');

class GoogleGeocodeService {

    constructor(mapsApiKey) {
        this.client = geocodeClientFactory.createClient({
            key: mapsApiKey,
            Promise: Promise
        });
    }

    async geocode(query) {
        let response = null;
        try {
            response = await this.client.geocode({
                address: query
            }).asPromise();
        } catch(err) {
            console.log("Error when calling google geocode service", err);
        }
        return this._parseResponse(response);
    }

    _parseResponse(response) {
        let results = [];
        if(response && response.status == RESPONSE_OK) {
            response.json.results.forEach(place => {
                results.push(place.geometry.location);
            });
        }
        return results;
    }
}

module.exports = GoogleGeocodeService;