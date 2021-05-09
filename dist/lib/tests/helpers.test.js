"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
const chai_1 = require("chai");
const helpers_1 = require("../helpers");
describe('helpers', () => {
    describe('getBundleSizes', () => {
        it('should return bundle sizes', async () => {
            const actual = await helpers_1.getBundleSizes();
            const expected = {
                ios: '',
                android: ''
            };
            chai_1.assert.equal(actual, expected);
        });
    });
});
//# sourceMappingURL=helpers.test.js.map