function isBeforeNow(expirationTime) {
    return expirationTime < Date.now();
}

module.exports = isBeforeNow;