function isEmpty(obj) {
    return obj.constructor !== Object || Object.entries(obj).length === 0 
}

module.exports = isEmpty;