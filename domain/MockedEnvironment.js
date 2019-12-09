const Environment = {
    databaseServerAddress: '127.0.0.1',
    databaseUser: 'user',
    databasePass: 'pass',
    cacheServerAddress: '127.0.0.1',
    cacheServerPass: 'pass',
    mapsApiKey: 'key',
    cacheExpirationInSeconds: 60,
    expireDatabaseYears: 1,
    expireDatabaseMonths: 2,
    expireDatabaseDays: 3,
    amountQueriesProcessing: 100,
    GEOLOCALIZATION_API_RESULT_TABLE: 'geolocalizationApiResult'
}

module.exports = Environment;