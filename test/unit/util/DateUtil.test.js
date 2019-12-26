'use strict';
const isBeforeNow = require('../../../src/util/DateUtil');

describe('function to detect if given time from date is before time from now', () => {

    test('when using a date representing tomorrow the result should be falsy', () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        expect(isBeforeNow(tomorrow)).toBeFalsy();
    });

    test('when using a date representing today the result should be falsy', () => {
        const today = new Date();
        expect(isBeforeNow(today)).toBeFalsy();
    });

    test('when using a date representing yesterday the result should be truthy', () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        expect(isBeforeNow(yesterday)).toBeTruthy();
    });

});