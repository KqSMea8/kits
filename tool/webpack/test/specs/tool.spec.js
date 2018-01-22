import {
  roundToStr,
  numberToCommas,
  numberToShort,
} from 'common/tool.js'


describe('tool.js test case', () => {
  it('tool.roundToStr', () => {
    expect(roundToStr(1, 2)).toBe('1.00')
    expect(roundToStr(1.234, 2)).toBe('1.23')
    expect(roundToStr(1.235, 2)).toBe('1.24')
    expect(roundToStr(1.234, 1)).toBe('1.2')
    expect(roundToStr(1.25, 1)).toBe('1.3')
    expect(roundToStr(1.234, 0)).toBe('1')
    expect(roundToStr(1.5, 0)).toBe('2')
    expect(roundToStr(1.239, 2)).toBe('1.24')
    expect(roundToStr(1, 1)).toBe('1.0')
    expect(roundToStr(0, 0)).toBe('0')
    expect(roundToStr(0, 1)).toBe('0.0')
    expect(roundToStr(0, 2)).toBe('0.00')
    expect(roundToStr(0.1, 1)).toBe('0.1')
    expect(roundToStr(0.123, 2)).toBe('0.12')
    expect(roundToStr(0.125, 2)).toBe('0.13')
    expect(roundToStr(0.01557, 2)).toBe('0.02')
    expect(roundToStr(0.00057, 2)).toBe('0.00')
    expect(roundToStr('', 1)).toBe('')
    expect(roundToStr('a', 1)).toBe('a')
    expect(roundToStr(undefined, 1)).toBe(undefined)
    expect(roundToStr(NaN)).toEqual(NaN)
    expect(roundToStr(null)).toBe(null)
  })
  it('tool.numberToCommas', () => {
    expect(numberToCommas(12345678, 2)).toBe('12,345,678.00')
    expect(numberToCommas(12345678.234, 2)).toBe('12,345,678.23')
    expect(numberToCommas(12345678.235, 2)).toBe('12,345,678.24')
    expect(numberToCommas(12345678.234, 1)).toBe('12,345,678.2')
    expect(numberToCommas(12345678.25, 1)).toBe('12,345,678.3')
    expect(numberToCommas(12345678.234, 0)).toBe('12,345,678')
    expect(numberToCommas(12345678.5, 0)).toBe('12,345,679')
    expect(numberToCommas(12345678.239, 2)).toBe('12,345,678.24')
    expect(numberToCommas(12345678, 1)).toBe('12,345,678.0')
    expect(numberToCommas('', 1)).toBe('-')
    expect(numberToCommas('a', 1)).toBe('-')
    expect(numberToCommas(undefined, 1)).toBe('-')
    expect(numberToCommas(NaN)).toEqual('-')
    expect(numberToCommas(null)).toBe('-')
  })
  it('tool.numberToShort', () => {
    expect(numberToShort(12345678)).toBe('12.35M')
    expect(numberToShort(1234)).toBe('1.23K')
    expect(numberToShort('')).toBe('')
    expect(numberToShort('a')).toBe('a')
    expect(numberToShort(undefined)).toBe(undefined)
    expect(numberToShort(NaN)).toEqual(NaN)
    expect(numberToShort(null)).toBe(null)
  })
})
