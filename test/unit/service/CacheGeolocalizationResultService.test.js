const CacheGeolocalizationResultService = require('../../../service/CacheGeolocalizationResultService');

const mockedEnvConfig = {
    expireDatabaseYears: 1,
    expireDatabaseMonths: 2,
    expireDatabaseDays: 3,
};

const daoMock = {
    save: jest.fn(),
    delete: jest.fn(),
    findByQuery: jest.fn(),
    shutdown: jest.fn(),
};

const cacheMock = {
    add: jest.fn(),
    get: jest.fn(),
    shutdown: jest.fn(),
};

const daoFactoryMock = {
    create: () => {
        return daoMock;
    }
};

const cacheFactoryMock = {
    create: () => {
        return cacheMock;
    }
};

describe('instantiate cache geolocalization result service', () => {

    test('should call create function from dao factory ', () => {
        const daoFactory = jest.mock();
        daoFactory.create = jest.fn();
        jest.spyOn(daoFactory, 'create');
        new CacheGeolocalizationResultService(mockedEnvConfig, daoFactory, cacheFactoryMock);
        expect(daoFactory.create).toHaveBeenCalledTimes(1);
    });

    test('should call create function from cache factory ', () => {
        const cacheFactory = jest.mock();
        cacheFactory.create = jest.fn();
        jest.spyOn(cacheFactory, 'create');
        new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactory);
        expect(cacheFactory.create).toHaveBeenCalledTimes(1);
    });

});

describe('invoking cache geolocalization result service functions', () => {

    test('when saving in database should call dao save database function', () => {
        jest.spyOn(daoMock, 'save');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.saveDatabase({});
        expect(daoMock.save).toBeCalled();
    });

    test('when saving in cache should call cache save database function', () => {
        jest.spyOn(cacheMock, 'add');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.saveCache('query', {});
        expect(cacheMock.add).toBeCalled();
    });

    test('when searching in database should call dao search database function', () => {
        jest.spyOn(daoMock, 'findByQuery');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInDatabaseByQuery('query');
        expect(daoMock.findByQuery).toBeCalled();
    });

    test('when searching in cache should call cache search database function', () => {
        jest.spyOn(cacheMock, 'get');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInCacheByQuery('query');
        expect(cacheMock.get).toBeCalled();
    });

    test('when expired geolocalization result is found searching database should call dao delete function', () => {    
        jest.spyOn(daoMock, 'delete');
        let currentDate = new Date();
        daoMock.findByQuery.mockReturnValueOnce({
            query: 'query',
            locations: [],
            expireAt: new Date(
                currentDate.getFullYear() - mockedEnvConfig.expireDatabaseYears,
                (currentDate.getMonth() + 1) - mockedEnvConfig.expireDatabaseMonths,
                currentDate.getDate() - mockedEnvConfig.expireDatabaseDays).getTime(),
        });
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInDatabaseByQuery('query').then(() => {
            expect(daoMock.delete).toBeCalled();
        });
    });

    test('invoking shutdown should invoke shutdown on dao', () => {
        jest.spyOn(daoMock, 'shutdown');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.shutdown();
        expect(daoMock.shutdown).toBeCalled();
    });

    test('invoking shutdown should invoke shutdown on cache', () => {
        jest.spyOn(cacheMock, 'shutdown');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.shutdown();
        expect(cacheMock.shutdown).toBeCalled();
    });

});

describe('searching for query', () => {

    test('when passing an inexistent query to search in the cache, should return null', () => {
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInCacheByQuery('query').then((result) => {
            expect(result).toBeNull();
        });
    });

    test('when passing an existent query to search in the cache, should return an object', () => {
        let result = {
            query: 'query1',
            locations: [],
            expireAt: new Date().getTime(),
        };
        cacheMock.get.mockReturnValueOnce(result);
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInCacheByQuery('query1').then((result) => {
            expect(result).toBeTruthy();
        });
    });

    test('when passing an inexistent query to search in the database, should return null', () => {
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInDatabaseByQuery('query').then((result) => {
            expect(result).toBeNull();
        });
    });

    test('when passing an existent query to search in the database, should return an object', () => {
        let result = {
            query: 'query1',
            locations: [],
            expireAt: new Date().getTime(),
        };
        daoMock.findByQuery.mockReturnValueOnce(result);
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInDatabaseByQuery('query1').then((result) => {
            expect(result).toBeTruthy();
        });
    });

});