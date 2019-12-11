function isBeforeNow(expirationDate) {
    return expirationDate < Date.now();
}

module.exports = isBeforeNow;