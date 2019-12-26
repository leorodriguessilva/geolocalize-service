'use strict';

const NoDatabaseGeolocalizationApiResultDao = require('./NoDatabaseGeolocalizationApiResultDao');
const CassandraGeolocalizationApiResultDao = require('./CassandraGeolocalizationApiResultDao');
const DynamoDBGeolocalizationApiResultDao = require('./DynamoDBGeolocalizationApiResultDao');
const GeolocalizationApiResultDaoLogger = require('./GeolocalizationApiResultDaoLogger');
const TypeCacheEnum = require('../domain/TypeCache');

class DaoFactory {

    constructor(typeCache, environmentConfig) {
        this.typeCache = typeCache;
        this.environmentConfig = environmentConfig;
    }

    create() {
        if (this.typeCache == TypeCacheEnum.MEMORY_AND_PERSISTENT_CACHE 
            || this.typeCache == TypeCacheEnum.ONLY_PERSISTENT_CACHE) {
            return this._createPersistentDao();
        }
        return this._createNoPersistentDao();
    }

    _createNoPersistentDao() {
        if (this.geolocalizationApiResultDao) {
            return this.geolocalizationApiResultDao;
        }
        this.geolocalizationApiResultDao = new NoDatabaseGeolocalizationApiResultDao();
        return this.geolocalizationApiResultDao;
    }

    _createPersistentDao() {
        if (this.geolocalizationApiResultDao) {
            return this.geolocalizationApiResultDao;
        }
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

        if (this.environmentConfig.logPersistentCache) {
            this.geolocalizationApiResultDao = new GeolocalizationApiResultDaoLogger(wrapped);
            return this.geolocalizationApiResultDao;
        }
        this.geolocalizationApiResultDao = wrapped;
        return this.geolocalizationApiResultDao;
    }
}

module.exports = DaoFactory;