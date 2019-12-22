const TypeCacheEnum = require('../../../domain/TypeCache');

const Event = {
    queries: [
        '1600 Amphitheatre Parkway, Mountain View, CA', 
        '33 Travessa Albertina Ganzo, Centro, Florianópolis, SC', 
        '127 R. Médico Miguel Salles Cavalcanti, Abraão, Florianópolis, SC',
    ],
    typeCache: TypeCacheEnum.MEMORY_AND_PERSISTENT_CACHE,
};

module.exports = Event;