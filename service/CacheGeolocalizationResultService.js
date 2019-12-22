const TypeCacheEnum = require('../domain/TypeCache');
const DynamoDBGeolocalizationApiResultDao = require('../dao/DynamoDBGeolocalizationApiResultDao');
const CassandraGeolocalizationApiResultDao = require('../dao/CassandraGeolocalizationApiResultDao');
const RedisGeolocalizationApiResultCache = require('../dao/RedisGeolocalizationApiResultCache');
const GeolocalizationApiResultDaoLogger = require('../dao/GeolocalizationApiResultDaoLogger');
const NoDatabaseGeolocalizationApiResultDao = require('../dao/NoDatabaseGeolocalizationApiResultDao');
const NoGeolocalizationApiResultCache = require('../dao/NoGeolocalizationApiResultCache');
const isBeforeNow = require('../util/Util');

class CacheGeolocalizationResultService {

    constructor(
        environmentConfig,
        typeCache) {
        this.environmentConfig = environmentConfig;
        var connectionCreations = this.mapDatabaseAndCacheByType();
        var daoCreationCallback = connectionCreations.get(typeCache);
        daoCreationCallback(this);
    }

    async saveCache(geolocalizationQuery, latlon) { 
        this.geolocalizationApiResultCache.add(geolocalizationQuery, JSON.stringify(latlon));
    }

    async findInCacheByQuery(geolocalizationQuery) { 
        var response = await this.geolocalizationApiResultCache.get(geolocalizationQuery);
        if(response) {
            return JSON.parse(response);
        }
        return null;
    }

    async saveDatabase(geolocalizationQuery, locations) {
        const geolocalizationApiResult = {
            query: geolocalizationQuery, 
            locations,
            expireAt: this.getDatabaseExpireAt(), 
        };
        await this.geolocalizationApiResultDao.save(geolocalizationApiResult);
    }

    async findInDatabaseByQuery(geolocalizationQuery) { 
        var geolocalizationApiResult = await this.geolocalizationApiResultDao.findByQuery(geolocalizationQuery);
        if(!geolocalizationApiResult) {
            return null;
        }
        
        if(isBeforeNow(geolocalizationApiResult.expireAt)) {
            this.geolocalizationApiResultDao.delete(geolocalizationApiResult);
            return null;
        }
        
        return geolocalizationApiResult.locations;
    }

    shutdown() {
        this.geolocalizationApiResultCache.shutdown();
        this.geolocalizationApiResultDao.shutdown(); 
    }
    
    getDatabaseExpireAt() {
        var expireAt = new Date();
        expireAt.setYear(expireAt.getFullYear() + this.environmentConfig.expireDatabaseYears);
        expireAt.setMonth((expireAt.getMonth() + 1) + this.environmentConfig.expireDatabaseMonths);
        expireAt.setDate(expireAt.getDate() + this.environmentConfig.expireDatabaseDays);
        return expireAt.getTime();
    }

    mapDatabaseAndCacheByType() {
        var connectionCreations = new Map();
        connectionCreations.set(TypeCacheEnum.NO_CACHE, this.createNoCachedDao);
        connectionCreations.set(TypeCacheEnum.ONLY_MEMORY_CACHE, this.createMemoryCachedDao);
        connectionCreations.set(TypeCacheEnum.ONLY_PERSISTENT_CACHE, this.createPersistentCachedDao);
        connectionCreations.set(TypeCacheEnum.MEMORY_AND_PERSISTENT_CACHE, this.createMemoryAndPersistentCachedDao);
        return connectionCreations;
    }

    createNoCachedDao(caller) {
        console.log('Using no cache for this call');
        caller.createNoCachedAccess();
        caller.createNoPersistentDao();
    }

    createMemoryCachedDao(caller) {
        console.log('Using only in memory cache for this call');
        caller.createCachedAccess();
        caller.createNoPersistentDao();
    }

    createPersistentCachedDao(caller) {
        console.log('Using only in persistent cache for this call');
        caller.createNoCachedAccess();
        caller.createPersistentDao();
    }

    createMemoryAndPersistentCachedDao(caller) {
        console.log('Using in memory and persistent cache for this call');
        caller.createCachedAccess();
        caller.createPersistentDao();
    }

    createNoPersistentDao() {
        this.geolocalizationApiResultDao = new NoDatabaseGeolocalizationApiResultDao();
    }

    createNoCachedAccess() {
        this.geolocalizationApiResultCache = new NoGeolocalizationApiResultCache();
    }

    createCachedAccess() {
        this.geolocalizationApiResultCache = new RedisGeolocalizationApiResultCache(
            this.environmentConfig.cacheServerAddress, 
            this.environmentConfig.cacheServerPort, 
            this.environmentConfig.cacheServerPass,
            this.environmentConfig.cacheExpirationInSeconds);
    }

    createPersistentDao() {
        let wrapped = new CassandraGeolocalizationApiResultDao(
            this.environmentConfig.databaseServerAddress, 
            this.environmentConfig.databaseUser, 
            this.environmentConfig.databasePass,
            this.environmentConfig.persistentCacheTable);
        if (this.environmentConfig.useDynamoDB) {
            wrapped = new DynamoDBGeolocalizationApiResultDao(
                this.environmentConfig.AWS_DEFAULT_REGION, 
                this.environmentConfig.persistentCacheTable);
        }
        this.geolocalizationApiResultDao = new GeolocalizationApiResultDaoLogger(wrapped);
    }
}

module.exports = CacheGeolocalizationResultService;