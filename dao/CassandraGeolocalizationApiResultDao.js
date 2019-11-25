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

    save(geolocalizationApiResult) {
        const query = 'INSERT INTO GeolocalizationApiResult (query, longitude, latidude, expireAt) VALUES (?, ?, ?, ?)'; 
        const params = [ 
            geolocalizationApiResult.query, 
            geolocalizationApiResult.longitude,
            geolocalizationApiResult.latitude,
            geolocalizationApiResult.expireAt, 
        ];
        this.client.execute(query, params, { prepare: true })
        .then(() => console.log(`Added a new GeolocalizationApiResult for query ${geolocalizationApiResult.query}`));
    }

    findByQuery(geolocalizationQuery) {
        const query = 'SELECT * FROM GeolocalizationApiResult WHERE query = ?';
        return this.client.execute(query, [ geolocalizationQuery ])
        .then(result => {
            var geolocalizationApiResult = {
                query: result.rows[0].query,
                longitude: result.rows[0].longitude,
                latitude: result.rows[0].latitude,
                expireAt: result.rows[0].expireAt,
            };
            return geolocalizationApiResult;
        });
    }

    shutdown() {
        this.client.shutdown();
    }

}