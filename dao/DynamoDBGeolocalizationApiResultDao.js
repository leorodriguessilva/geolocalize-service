const AWS = require('aws-sdk');

class DynamoDBGeolocalizationApiResultDao {
    
    constructor (awsRegion) {
        AWS.config.update({ region: awsRegion });
        this.client = new AWS.DynamoDB({ apiVersion: '2012-08-10' });
    }

    _getTableName() {
        return "GeolocalizationApiResult";
    }

    async save(geolocalizationApiResult) { 
        const params = {
            TableName: this._getTableName(),
            Item: {
              'query' : { S: geolocalizationApiResult.query },
              'latitude' : { N: geolocalizationApiResult.latitude.toString() },
              'longitude' : { N: geolocalizationApiResult.longitude.toString() },
              'expireAt' : { S: geolocalizationApiResult.expireAt.toString() }
            }
          };

        this.client.putItem(params, function(err) {
            if (err) {
                console.log("Error", err);
            }
        });
    }

    async delete(query) { 
        const params = {
            TableName: this._getTableName(),
            Key: {
                'query': { S: query }
            }
        };
          
        this.client.deleteItem(params, function(err, data) {
            if (err) {
                console.log("Error", err);
            }
        });
    }

    async findByQuery(geolocalizationQuery) { 
        const params = {
            TableName: this._getTableName(),
            Key: {
              'query': { S: geolocalizationQuery }
            },
        };

        this.client.getItem(params, function(err, data) {
            if (err) {
              console.log("Error", err);
              return null;
            }
            return data.Item;
        });
    }

    shutdown() { }
}

module.exports = DynamoDBGeolocalizationApiResultDao;