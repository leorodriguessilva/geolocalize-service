const geolocalize = require("../../Geolocalize");
const Event = require('./domain/MockedEvent');
const Environment = require('./domain/MockedEnvironment');

const env = Environment;

const event = Event;

process.env = { ...env};

var typeCache = process.argv[2];
var localizationQueries = process.argv[3];

if(localizationQueries) {
    event.queries = JSON.parse(localizationQueries);
}

if(typeCache) {
    event.typeCache = parseInt(typeCache);
}

geolocalize(event).then(resultQueries => {
    console.log(JSON.stringify(resultQueries));
});