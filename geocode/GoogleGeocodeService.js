const geocodeClientFactory = require('@google/maps');
const { RESPONSE_OK } = require('../constants/GeolocalizeConstants');

class GoogleGeocodeService {

    constructor(mapsApiKey) {
        this.client = geocodeClientFactory.createClient({
            key: mapsApiKey
        });
    }

    async geocode(query) {
        let response = null;
        try {
            response = await this.client.geocode({
                address: query
            });
        } catch(err) {
            console.log("Error when calling google geocode service", err);
        }
        return response.json.results;
    }

    _parseResponse(response) {
        let results = [];
        if(response.status === RESPONSE_OK) {
            response.json.results.forEach(place => {
                results.push(place.geometry.location);
            });
        }
        return results;
    }
}

module.exports = GoogleGeocodeService;