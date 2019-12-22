'use strict';
const cassandra = require('cassandra-driver');

class CassandraGeolocalizationApiResultDao {

    constructor(hostAddress, user, pass, tableName) {
        this.tableName = tableName;
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
        const query = `INSERT INTO ${this.tableName} (query, locations, expireAt) VALUES (?, ?, ?)`; 
        const params = [ 
            geolocalizationApiResult.query, 
            geolocalizationApiResult.locations,
            geolocalizationApiResult.expireAt, 
        ];
        await this.client.execute(query, params, { prepare: true });
        return true;
    }

    async delete(query) {
        const deleteQuery = `DELETE FROM ${this.tableName} WHERE query = ?`; 
        const params = [ 
            query, 
        ];
        await this.client.execute(deleteQuery, params, { prepare: true });
        return true;
    }

    async findByQuery(geolocalizationQuery) {
        const query = `SELECT * FROM ${this.tableName} WHERE query = ?`;
        const result = await this.client.execute(query, [ geolocalizationQuery ]); 
        if(result.rowLength == 0) {
            return null;
        }
        const geolocalizationApiResult = {
            query: result.rows[0].query,
            locations: result.rows[0].locations,
            expireAt: result.rows[0].expireat.toNumber(),
        };

        return geolocalizationApiResult;
    }

    shutdown() {
        this.client.shutdown();
    }
}

module.exports = CassandraGeolocalizationApiResultDao;