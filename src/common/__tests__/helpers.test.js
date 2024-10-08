import { helpers } from '../helpers';

describe('Helpers', () => {
  it('should have specific functions', () => {
    expect(helpers).toMatchSnapshot('helpers');
  });

  it('should support generated IDs', () => {
    expect(helpers.generateId()).toBe('generatedid-');
    expect(helpers.generateId('lorem')).toBe('lorem-');
  });

  it('should determine a date', () => {
    expect(helpers.isDate(new Date('broken'))).toBe(true);
    expect(helpers.isDate(Date)).toBe(false);
    expect(helpers.isDate(1)).toBe(false);
    expect(helpers.isDate('lorem')).toBe(false);
  });

  it('should determine a promise', () => {
    expect(helpers.isPromise(Promise.resolve())).toBe(true);
    expect(helpers.isPromise(async () => {})).toBe(true);
    expect(helpers.isPromise(() => 'lorem')).toBe(false);
  });

  it('should apply a number display function', () => {
    expect(helpers.numberDisplay(null)).toBe(null);
    expect(helpers.numberDisplay(undefined)).toBe(undefined);
    expect(helpers.numberDisplay(NaN)).toBe(NaN);
    expect(helpers.numberDisplay(11)).toMatchSnapshot('number display function result');
  });

  it('should expose a window object', () => {
    helpers.browserExpose({ lorem: 'ipsum' });
    expect(window[helpers.UI_WINDOW_ID]).toMatchSnapshot('window object');

    helpers.browserExpose({ dolor: 'sit' }, { limit: true });
    expect(window[helpers.UI_WINDOW_ID]).toMatchSnapshot('limited window object');
  });
});
