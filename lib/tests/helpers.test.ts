/* eslint-disable no-undef */
import { assert } from 'chai'
import { getBundleSizes } from '../helpers'

describe('helpers', () => {
  describe('getBundleSizes', () => {
    it('should return bundle sizes', async () => {
      const actual = await getBundleSizes()
      const expected = {
        ios: '',
        android: ''
      }
      assert.equal(actual, expected)
    })
  })
})
