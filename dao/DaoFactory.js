const NoDatabaseGeolocalizationApiResultDao = require('./NoDatabaseGeolocalizationApiResultDao');
const CassandraGeolocalizationApiResultDao = require('./CassandraGeolocalizationApiResultDao');
const TypeCacheEnum = require('../domain/TypeCache');

class DaoFactory {

    constructor(typeCache) {
        this.typeCache = typeCache;
    }

    create() {
        if (this.typeCache == TypeCacheEnum.MEMORY_AND_PERSISTENT_CACHE 
            || this.typeCache == TypeCacheEnum.ONLY_PERSISTENT_CACHE) {
            return this._createNoPersistentDao();
        }
        return this._createPersistentDao();
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
        this.geolocalizationApiResultDao = new GeolocalizationApiResultDaoLogger(wrapped);
        return this.geolocalizationApiResultDao;
    }
}

module.exports = DaoFactory;