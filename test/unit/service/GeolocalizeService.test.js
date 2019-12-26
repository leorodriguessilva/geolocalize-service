'use strict';
const GeolocalizeService = require('../../../src/service/GeolocalizeService');

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
        service.geolocalize('query').then(() => {
            expect(cacheGeolocalizationResultServiceMock.findInCacheByQuery).toBeCalled();
        });
    });

    test('should invoke search in database for cache geolocalization service', () => {
        jest.spyOn(cacheGeolocalizationResultServiceMock, 'findInDatabaseByQuery');
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query').then(() => {
            expect(cacheGeolocalizationResultServiceMock.findInDatabaseByQuery).toBeCalled();
        });
    });

    test('should invoke search in database for cache geolocalization service', () => {
        jest.spyOn(cacheGeolocalizationResultServiceMock, 'findInDatabaseByQuery');
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query').then(() => {
            expect(cacheGeolocalizationResultServiceMock.findInDatabaseByQuery).toBeCalled();
        });
    });

    test('should invoke search in geocode api for geocode service', () => {
        jest.spyOn(geocodeServiceMock, 'geocode');
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query').then(() => {
            expect(geocodeServiceMock.geocode).toBeCalled();
        });
    });

    test('should invoke save in cache for cache geolocalization service', () => {
        jest.spyOn(cacheGeolocalizationResultServiceMock, 'saveCache');
        let data = {};
        geocodeServiceMock.geocode.mockReturnValueOnce(data);
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query').then(() => {
            expect(cacheGeolocalizationResultServiceMock.saveCache).toBeCalled();
        });
    });

    test('should invoke save in database for cache geolocalization service', () => {
        jest.spyOn(cacheGeolocalizationResultServiceMock, 'saveDatabase');
        let data = {};
        geocodeServiceMock.geocode.mockReturnValueOnce(data);
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query').then(() => {
            expect(cacheGeolocalizationResultServiceMock.saveDatabase).toBeCalled();
        });
    });

});

describe('geolocalize service returning value', () => { 
    
    test('when has in cache should return location value', () => {
        let data = [];
        cacheGeolocalizationResultServiceMock.findInCacheByQuery.mockReturnValueOnce(data);
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query').then((result) => {
            expect(result).toBeTruthy();
        });
    });

    test('when has in database should return location value', () => {
        let data = [];
        cacheGeolocalizationResultServiceMock.findInDatabaseByQuery.mockReturnValueOnce(data);
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query').then((result) => {
            expect(result).toBeTruthy();
        });
    });

    test('when has in api should return location value', () => {
        let data = {};
        geocodeServiceMock.geocode.mockReturnValueOnce(data);
        const service = new GeolocalizeService(cacheGeolocalizationResultServiceMock, geocodeServiceFactoryMock);
        service.geolocalize('query').then((result) => {
            expect(result).toBeTruthy();
        });
    });

});