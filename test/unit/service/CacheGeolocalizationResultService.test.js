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
};

const cacheMock = {
    add: jest.fn(),
    get: jest.fn(),
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
        expect(daoMock.save).toHaveBeenCalledTimes(1);
    });

    test('when saving in cache should call cache save database function', () => {
        jest.spyOn(cacheMock, 'add');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.saveCache('query', {});
        expect(cacheMock.add).toHaveBeenCalledTimes(1);
    });

    test('when searching in database should call dao search database function', () => {
        jest.spyOn(daoMock, 'findByQuery');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInDatabaseByQuery('query');
        expect(daoMock.findByQuery).toHaveBeenCalledTimes(1);
    });

    test('when searching in cache should call cache search database function', () => {
        jest.spyOn(cacheMock, 'get');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInCacheByQuery('query');
        expect(cacheMock.get).toHaveBeenCalledTimes(1);
    });

    test('when expired geolocalization result when searching database should call dao delete function', () => {
        jest.spyOn(daoMock, 'delete');
        const service = new CacheGeolocalizationResultService(mockedEnvConfig, daoFactoryMock, cacheFactoryMock);
        service.findInDatabaseByQuery('query');
        expect(cacheMock.delete).toHaveBeenCalledTimes(1);
    });

});