const AWS = require('aws-sdk');

class DynamoDBGeolocalizationApiResultDao {
    
    constructor (awsRegion, tableName) {
        AWS.config.update({ region: awsRegion });
        AWS.config.logger = console;
        this.tableName = tableName;
        this.client = new AWS.DynamoDB.DocumentClient();
    }

    _getTableName() {
        return this.tableName;
    }

    async save(geolocalizationApiResult) { 
        const params = {
            TableName: this._getTableName(),
            Item: {
              query :  geolocalizationApiResult.query ,
              latitude : geolocalizationApiResult.latitude,
              longitude : geolocalizationApiResult.longitude,
              expireAt : geolocalizationApiResult.expireAt.toISOString(),
            }
        };
        
        let response = true;
        try {
            await this.client.put(params).promise();
        } catch(err) {
            response = false;
            console.log("Error", err);
        }
        return response;
    }

    async delete(query) { 
        const params = {
            TableName: this._getTableName(),
            Key: {
                query
            }
        };
        
        let response = true;
        try {
            await this.client.delete(params).promise();
        } catch(err) {
            response = false;
            console.log("Error", err);
        }
        return response;
    }

    async findByQuery(geolocalizationQuery) { 
        const params = {
            TableName: this._getTableName(),
            Key: {
              query: geolocalizationQuery
            },
        };

        let response = null;
        try {
            response = await this.client.get(params).promise();
        } catch(err) {
            console.log("Error", err);
        }
        return response;
    }

    shutdown() { }
}

module.exports = DynamoDBGeolocalizationApiResultDao;