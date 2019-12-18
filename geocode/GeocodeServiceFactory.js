const GoogleGeocodeService = require('./GoogleGeocodeService');
const FakeGeocodeService = require('./FakeGeocodeService');
const GeocodeProviderEnum = require('../domain/GeocodeProvider');

class GeocodeServiceFactory {

    constructor(geocodeProvider, env) {
        this.geocodeProvider = geocodeProvider;
        this.providerApiKey = env.mapsApiKey;
        this.randomLocationMaxSize = env.randomLocationMaxSize;
    }

    create() {
        if(this.geocodeProvider == GeocodeProviderEnum.GOOGLE) {
            return new GoogleGeocodeService(this.providerApiKey);
        }
        return new FakeGeocodeService(this.randomLocationMaxSize);
    }
}

module.exports = GeocodeServiceFactory;