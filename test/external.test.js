const { JSDOM } = require('jsdom');
const { window } = new JSDOM('');
global.window = window;
global.document = window.document;

const {transformNumber} = require('../static/external.js');

describe('transformNumber Function', () => {
    test('transfer 0 to 00', () => {
        expect(transformNumber(0)).toBe('00');
    });
    test('transfer 5 to 05', () => {
        expect(transformNumber(5)).toBe('05');
    });
    test('transfer 10 to 10', () => {
        expect(transformNumber(10)).toBe('10');
    });
    test('transfer 12 to 12', () => {
        expect(transformNumber(12)).toBe('12');
    });
});