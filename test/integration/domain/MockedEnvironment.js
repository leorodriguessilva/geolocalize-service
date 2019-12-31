const Environment = {
    databaseServerAddress: '127.0.0.1',
    databaseUser: 'user',
    databasePass: 'pass',
    cacheServerAddress: 'redis://127.0.0.1',
    cacheServerPass: 'pass',
    mapsApiKey: 'key',
    cacheExpirationInSeconds: 60,
    expireDatabaseYears: 1,
    expireDatabaseMonths: 2,
    expireDatabaseDays: 3,
    amountQueriesProcessing: 100,
    persistentCacheTable: 'geolocalizationApiResult',
    randomLocationMaxSize: 3,
    geocodeProvider: 0,
    loggerType: 1,
}

module.exports = Environment;