const GeocodeServiceFactory = require('../../../geocode/GeocodeServiceFactory');
const FakeGeocodeService = require('../../../geocode/FakeGeocodeService');
const GoogleGeocodeService = require('../../../geocode/GoogleGeocodeService');
const GeocodeProvider = require('../../../domain/GeocodeProvider');

describe('instantiate geocode service factory', () => {

    test('when providing fake geocode provider no error should happen', () => {
        expect(() => new GeocodeServiceFactory(GeocodeProvider.FAKE, {})).not.toThrow();
    });

    test('when providing google geocode provider no error should happen', () => {
        expect(() => new GeocodeServiceFactory(GeocodeProvider.GOOGLE, {})).not.toThrow();
    });

});

describe('creating geocode service using factory', () => {

    test('when providing fake geocode provider should create fake implementation', () => {
        const factory = new GeocodeServiceFactory(GeocodeProvider.FAKE, {});
        const geocodeService = factory.create();
        expect(geocodeService).toBeInstanceOf(FakeGeocodeService);
    });

    test('when providing google geocode provider should create google implementation', () => {
        const factory = new GeocodeServiceFactory(GeocodeProvider.GOOGLE, {});
        const geocodeService = factory.create();
        expect(geocodeService).toBeInstanceOf(GoogleGeocodeService);
    });

});