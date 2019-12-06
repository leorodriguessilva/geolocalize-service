"use strict";

class GeolocalizationApiResultDaoLoggerWrapper {

    constructor(wrapped) {
        this.wrapped = wrapped;
    }

    async save(geolocalizationApiResult) {
        this.wrapped.save(geolocalizationApiResult);
        console.log(`Added a new GeolocalizationApiResult for query ${geolocalizationApiResult.query}`);
    }

    async delete(query) {    
        this.wrapped.delete(query);
        console.log(`Removed expired GeolocalizationApiResult for query ${query}`);
    }

    async findByQuery(geolocalizationQuery) {
        const result = this.wrapped.findByQuery(geolocalizationQuery);
        if (result) {
            console.log(`Retrieved GeolocalizationApiResult from database by query ${geolocalizationQuery.query}`);
        }
        return result;
    }

    shutdown() { 
        this.wrapped.shutdown();
    }

}

module.exports = GeolocalizationApiResultDaoLoggerWrapper;