'use strict';

const { initializeLogger } = require('../../../src/logger/LogManager');
const LoggerType = require('../../../src/logger/LoggerType');
const DaoFactory = require('../../../src/dao/DaoFactory');
const CassandraGeolocalizationApiResultDao = require('../../../src/dao/CassandraGeolocalizationApiResultDao');
const DynamoDBGeolocalizationApiResultDao = require('../../../src/dao/DynamoDBGeolocalizationApiResultDao');
const NoDatabaseGeolocalizationApiResultDao = require('../../../src/dao/NoDatabaseGeolocalizationApiResultDao');
const GeolocalizationApiResultDaoLogger = require('../../../src/dao/GeolocalizationApiResultDaoLogger');
const TypeCache = require('../../../src/domain/TypeCache');

const mockedEnvConfig = {
    databaseServerAddress: '127.0.0.1', 
    databaseUser: 'user', 
    databasePass: 'pass',
    persistentCacheTable: 'testTable',
    useDynamoDB: false,
    AWS_DEFAULT_REGION: 'region-test',
    logPersistentCache: false,
};

beforeEach(() => {
    initializeLogger(LoggerType.FAKE);
});

describe('instantiating dao factory', () => {

    test('should expect no error', () => {
        expect(() => new DaoFactory(TypeCache.ONLY_PERSISTENT_CACHE, mockedEnvConfig)).not.toThrow();
    });

});

describe('creating cassandra dao access using factory', () => {

    test('passing only persistent cache should expect cassandra dao implementation', () => {
        const factory = new DaoFactory(TypeCache.ONLY_PERSISTENT_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(CassandraGeolocalizationApiResultDao);
    });

    test('passing persistent and memory cache should expect cassandra dao implementation', () => {
        const factory = new DaoFactory(TypeCache.MEMORY_AND_PERSISTENT_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(CassandraGeolocalizationApiResultDao);
    });

    test('passing only memory cache should expect no dao implementation', () => {
        const factory = new DaoFactory(TypeCache.ONLY_MEMORY_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(NoDatabaseGeolocalizationApiResultDao);
    });

    test('passing no cache should expect no dao implementation', () => {
        const factory = new DaoFactory(TypeCache.NO_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(NoDatabaseGeolocalizationApiResultDao);
    });

});

describe('creating dynamodb dao access using factory', () => {

    test('passing only persistent cache should expect dynamodb dao implementation', () => {
        mockedEnvConfig.useDynamoDB = true;
        const factory = new DaoFactory(TypeCache.ONLY_PERSISTENT_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(DynamoDBGeolocalizationApiResultDao);
    });

    test('passing persistent and memory cache should expect dynamodb dao implementation', () => {
        mockedEnvConfig.useDynamoDB = true;
        const factory = new DaoFactory(TypeCache.MEMORY_AND_PERSISTENT_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(DynamoDBGeolocalizationApiResultDao);
    });

    test('passing only memory cache should expect no dao implementation', () => {
        mockedEnvConfig.useDynamoDB = true;
        const factory = new DaoFactory(TypeCache.ONLY_MEMORY_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(NoDatabaseGeolocalizationApiResultDao);
    });

    test('passing no cache should expect no dao implementation', () => {
        mockedEnvConfig.useDynamoDB = true;
        const factory = new DaoFactory(TypeCache.NO_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(NoDatabaseGeolocalizationApiResultDao);
    });

});

describe('creating cassandra dao logger access using factory', () => {

    test('passing only persistent cache should expect dao logger implementation', () => {
        mockedEnvConfig.logPersistentCache = true;
        const factory = new DaoFactory(TypeCache.ONLY_PERSISTENT_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(GeolocalizationApiResultDaoLogger);
    });

    test('passing persistent and memory cache should expect dao logger implementation', () => {
        mockedEnvConfig.logPersistentCache = true;
        const factory = new DaoFactory(TypeCache.MEMORY_AND_PERSISTENT_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(GeolocalizationApiResultDaoLogger);
    });

    test('passing only memory cache should expect no dao implementation', () => {
        mockedEnvConfig.logPersistentCache = true;
        const factory = new DaoFactory(TypeCache.ONLY_MEMORY_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(NoDatabaseGeolocalizationApiResultDao);
    });

    test('passing no cache should expect no dao implementation', () => {
        mockedEnvConfig.logPersistentCache = true;
        const factory = new DaoFactory(TypeCache.NO_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(NoDatabaseGeolocalizationApiResultDao);
    });

});

describe('creating dynamodb dao logger access using factory', () => {

    test('passing only persistent cache should expect dao logger implementation', () => {
        mockedEnvConfig.useDynamoDB = true;
        mockedEnvConfig.logPersistentCache = true;
        const factory = new DaoFactory(TypeCache.ONLY_PERSISTENT_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(GeolocalizationApiResultDaoLogger);
    });

    test('passing persistent and memory cache should expect dao logger implementation', () => {
        mockedEnvConfig.useDynamoDB = true;
        mockedEnvConfig.logPersistentCache = true;
        const factory = new DaoFactory(TypeCache.MEMORY_AND_PERSISTENT_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(GeolocalizationApiResultDaoLogger);
    });

    test('passing only memory cache should expect no dao implementation', () => {
        mockedEnvConfig.useDynamoDB = true;
        mockedEnvConfig.logPersistentCache = true;
        const factory = new DaoFactory(TypeCache.ONLY_MEMORY_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(NoDatabaseGeolocalizationApiResultDao);
    });

    test('passing no cache should expect no dao implementation', () => {
        mockedEnvConfig.useDynamoDB = true;
        mockedEnvConfig.logPersistentCache = true;
        const factory = new DaoFactory(TypeCache.NO_CACHE, mockedEnvConfig);
        const daoAccess = factory.create();
        expect(daoAccess).toBeInstanceOf(NoDatabaseGeolocalizationApiResultDao);
    });

});