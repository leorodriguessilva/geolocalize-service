'use strict';

const { getLogger } = require('../logger/LogManager');

class GeolocalizationApiResultDaoLoggerWrapper {

    constructor(wrapped) {
        this.wrapped = wrapped;
        this.logger = getLogger();
    }

    async save(geolocalizationApiResult) {
        let response = await this.wrapped.save(geolocalizationApiResult);
        if(response) {
            this.logger.log(`Added a new GeolocalizationApiResult for query ${geolocalizationApiResult.query}`);
        }
    }

    async delete(query) {    
        let response = await this.wrapped.delete(query);
        if(response) {
            this.logger.log(`Removed expired GeolocalizationApiResult for query ${query}`);
        }
    }

    async findByQuery(geolocalizationQuery) {
        const result = await this.wrapped.findByQuery(geolocalizationQuery);
        if (result) {
            this.logger.log(`Retrieved GeolocalizationApiResult from database by query ${geolocalizationQuery}`);
        }
        return result;
    }

    shutdown() { 
        this.wrapped.shutdown();
    }

}

module.exports = GeolocalizationApiResultDaoLoggerWrapper;