const geolocalize = require("./Geolocalize");
const Event = require('./domain/MockedEvent');
const Environment = require('./domain/MockedEnvironment');

const env = Environment;

const event = Event;

var typeCache = process.argv[2];
var localizationQueries = JSON.parse(process.argv[3]);

if(localizationQueries) {
    event.queries = localizationQueries;
}

if(typeCache) {
    event.typeCache = parseInt(typeCache);
}

geolocalize(event, env).then(resultQueries => {
    console.log(Object.entries(resultQueries));
});