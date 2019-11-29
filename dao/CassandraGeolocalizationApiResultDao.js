"use strict";
const cassandra = require('cassandra-driver');

class CassandraGeolocalizationApiResultDao {

    constructor(hostAddress, user, pass) {
        this.client = new cassandra.Client(
            { 
                contactPoints: [hostAddress], 
                localDataCenter: 'datacenter1', 
                keyspace: 'stage_global_cache',
                credentials: {
                    username: user,
                    password: pass,
                }
            }
        );
    }

    async save(geolocalizationApiResult) {
        const query = 'INSERT INTO GeolocalizationApiResult (query, longitude, latitude, expireAt) VALUES (?, ?, ?, ?)'; 
        const params = [ 
            geolocalizationApiResult.query, 
            geolocalizationApiResult.longitude,
            geolocalizationApiResult.latitude,
            geolocalizationApiResult.expireAt, 
        ];
        await this.client.execute(query, params, { prepare: true });
        console.log(`Added a new GeolocalizationApiResult for query ${geolocalizationApiResult.query}`);
    }

    async findByQuery(geolocalizationQuery) {
        const query = 'SELECT * FROM GeolocalizationApiResult WHERE query = ?';
        const result = await this.client.execute(query, [ geolocalizationQuery ]); 
        if(result.rowLength == 0) {
            return null;
        }
        const geolocalizationApiResult = {
            query: result.rows[0].query,
            longitude: result.rows[0].longitude,
            latitude: result.rows[0].latitude,
            expireAt: result.rows[0].expireAt,
        };
        console.log(`Retrieved GeolocalizationApiResult from database by query ${geolocalizationApiResult.query}`);
        return geolocalizationApiResult;
    }

    shutdown() {
        this.client.shutdown();
    }

}

module.exports = CassandraGeolocalizationApiResultDao;