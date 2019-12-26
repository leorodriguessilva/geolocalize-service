'use strict';

const GeolocalizeEventHandler = require('../../../src/handler/GeolocalizeEventHandler');
const TypeCache = require('../../../src/domain/TypeCache');
const { RESPONSE_OK } = require('../../../src/constants/GeolocalizeConstants');

const serviceMock = {
    geolocalize: jest.fn(),
    shutdown: jest.fn(),
};

const serviceFactoryMock = {
    create: () => { 
        return serviceMock;
    }, 
};

describe('instantiating geolocalize handler', () => {
    
    test('is expected no error', () => {
        expect(() => new GeolocalizeEventHandler(serviceFactoryMock, 1)).not.toThrow();
    });

});

describe('geolocalize handler dependencies', () => {
    
    test('geolocalize service factory should have create function invoked', () => {
        jest.spyOn(serviceFactoryMock, 'create');
        const handler = new GeolocalizeEventHandler(serviceFactoryMock, 1);
        handler.geolocalize({
            typeCache: TypeCache.NO_CACHE,
            queries: []
        });
        expect(serviceFactoryMock.create).toBeCalled();
    });
    
    test('geolocalize service should have geolocalize function invoked to translate lat lng from query', () => {
        const spy = jest.spyOn(serviceMock, 'geolocalize');
        const handler = new GeolocalizeEventHandler(serviceFactoryMock, 1);
        handler.geolocalize({
            typeCache: TypeCache.NO_CACHE,
            queries: [ 'geolocalize' ]
        });
        expect(spy).toBeCalled();
        spy.mockClear();
    });
    
    test('geolocalize service should have geolocalize function invoked ten times to translate lat lng from ten queries', () => {
        const spy = jest.spyOn(serviceMock, 'geolocalize');
        serviceMock.geolocalize.mockReturnValue([
            { 
                lat: 0,
                lng: 0,
            }
        ]);
        const handler = new GeolocalizeEventHandler(serviceFactoryMock, 10);
        handler.geolocalize({
            typeCache: TypeCache.NO_CACHE,
            queries: [ 
                'query1',
                'query2',
                'query3',
                'query4',
                'query5',
                'query6',
                'query7',
                'query8',
                'query9',
                'query10',
            ]
        }).then(() => {
            expect(spy).toHaveBeenCalledTimes(10);
            spy.mockClear();
        });
    });
    
    test('geolocalize service should have shutdown function invoked to close open resources', () => {
        jest.spyOn(serviceMock, 'shutdown');
        const handler = new GeolocalizeEventHandler(serviceFactoryMock, 1);
        handler.geolocalize({
            typeCache: TypeCache.NO_CACHE,
            queries: []
        });
        expect(serviceMock.shutdown).toBeCalled();
    });

});


describe('geolocalize handler response', () => {

    test('geolocalizing one query should return 200 ok response', () => {
        serviceMock.geolocalize.mockReturnValue([
            { 
                lat: 0,
                lng: 0,
            }
        ]);
        const handler = new GeolocalizeEventHandler(serviceFactoryMock, 1);
        handler.geolocalize({
            typeCache: TypeCache.NO_CACHE,
            queries: [ 'query' ]
        }).then((response) => {
            expect(response.statusCode).toBe(RESPONSE_OK);
        });
    });

    test('geolocalizing one query should return a list with one element', () => {
        serviceMock.geolocalize.mockReturnValue([
            { 
                lat: 0,
                lng: 0,
            }
        ]);
        const handler = new GeolocalizeEventHandler(serviceFactoryMock, 1);
        handler.geolocalize({
            typeCache: TypeCache.NO_CACHE,
            queries: [ 'query' ]
        }).then((response) => {
            expect(response.resultQueries.size).toBe(1);
        });
    });

    test('geolocalizing ten query should return a list with ten elements', () => {
        serviceMock.geolocalize.mockReturnValue([
            { 
                lat: 0,
                lng: 0,
            }
        ]);
        const handler = new GeolocalizeEventHandler(serviceFactoryMock, 10);
        handler.geolocalize({
            typeCache: TypeCache.NO_CACHE,
            queries: [ 
                'query1',
                'query2',
                'query3',
                'query4',
                'query5',
                'query6',
                'query7',
                'query8',
                'query9',
                'query10',
            ]
        }).then((response) => {
            expect(response.resultQueries.size).toBe(10);
        });
    });
});