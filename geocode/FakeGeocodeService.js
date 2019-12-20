class FakeGeocodeService {

    constructor(randomLocationMaxSize) {
        if(!randomLocationMaxSize) {
            randomLocationMaxSize = 1;
        }
        this.randomLocationMaxSize = randomLocationMaxSize;
    }

    async geocode(query) {
        let results = [];
        let amountOfLocations = Math.random() * (this.randomLocationMaxSize - 1) + 1;
        for(var i = 0; i < amountOfLocations; i++) {
            results.push(this._generateRandomLatLng());
        }
        return results;
    }

    _generateRandomLatLng() {  
        var lat = Math.random() * (180 - 1) + 1;
        var lng = Math.random() * (180 - 1) + 1;
        return {
            lat,
            lng
        }
    }
}

module.exports = FakeGeocodeService;
