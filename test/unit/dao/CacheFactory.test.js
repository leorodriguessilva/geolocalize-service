'use strict';

const CacheFactory = require('../../../src/dao/CacheFactory');
const RedisGeolocalizationApiResultCache = require('../../../src/dao/RedisGeolocalizationApiResultCache');
const NoGeolocalizationApiResultCache = require('../../../src/dao/NoGeolocalizationApiResultCache');
const TypeCache = require('../../../src/domain/TypeCache');
const LoggerType = require('../../../src/logger/LoggerType');
const { initializeLogger } = require('../../../src/logger/LogManager');
const RedisClientFactoryMock = require('./redis/RedisClientFactoryMock');

beforeEach(() => {
    initializeLogger(LoggerType.FAKE);
});

describe('instantiating cache factory', () => {

    test('should expect no error', () => {
        expect(() => new CacheFactory(TypeCache.ONLY_MEMORY_CACHE, new RedisClientFactoryMock(), 1)).not.toThrow();
    });

});

describe('creating cache access using factory', () => {

    test('passing only memory cache should expect redis cache implementation', () => {
        const factory = new CacheFactory(TypeCache.ONLY_MEMORY_CACHE, new RedisClientFactoryMock(), 1);
        const cacheAccess = factory.create();
        expect(cacheAccess).toBeInstanceOf(RedisGeolocalizationApiResultCache);
    });

    test('passing database and memory cache should expect redis cache implementation', () => {
        const factory = new CacheFactory(TypeCache.MEMORY_AND_PERSISTENT_CACHE, new RedisClientFactoryMock(), 1);
        const cacheAccess = factory.create();
        expect(cacheAccess).toBeInstanceOf(RedisGeolocalizationApiResultCache);
    });

    test('passing only persistent cache should expect no cache implementation', () => {
        const factory = new CacheFactory(TypeCache.ONLY_PERSISTENT_CACHE, new RedisClientFactoryMock(), 1);
        const cacheAccess = factory.create();
        expect(cacheAccess).toBeInstanceOf(NoGeolocalizationApiResultCache);
    });

    test('passing no cache should expect no cache implementation', () => {
        const factory = new CacheFactory(TypeCache.NO_CACHE, new RedisClientFactoryMock(), 1);
        const cacheAccess = factory.create();
        expect(cacheAccess).toBeInstanceOf(NoGeolocalizationApiResultCache);
    });

});