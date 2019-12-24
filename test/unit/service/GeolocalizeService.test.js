const GeolocalizeService = require('../../../service/GeolocalizeService');

const geocodeServiceMock = {
    geocode: jest.fn(),
};

const geocodeServiceFactoryMock = {
    create: () => {
        return geocodeServiceMock;
    },
}

const cacheGeolocalizationResultServiceMock = {
    saveCache: jest.fn(),
    findInCacheByQuery: jest.fn(),
    saveDatabase: jest.fn(),
    findInDatabaseByQuery: jest.fn(),
    shutdown: jest.fn(),
}

describe('instantiate geolocalize service', () => {

    test('should call create function from geocode service factory', () => {
        jest.spyOn(geocodeServiceFactoryMock, 'create');
        new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        expect(geocodeServiceFactoryMock.create).toBeCalled();
    });

});

describe('geolocalizing a query', () => {

    test('should invoke search in cache for cache geolocalization service', () => {
        jest.spyOn(cacheGeolocalizationResultServiceMock, 'findInCacheByQuery');
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query');
        expect(cacheGeolocalizationResultServiceMock.findInCacheByQuery).toBeCalled();
    });

});