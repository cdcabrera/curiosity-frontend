import { dynamicReactReduxHooks } from '../useDynamicReactRedux';
import { store } from '../../store';

describe('useDynamicReactRedux', () => {
  it('should return specific properties', () => {
    expect(dynamicReactReduxHooks).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for useDispatch', async () => {
    const mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
    const { result: dispatch } = await renderHook(dynamicReactReduxHooks.useDynamicDispatch);

    dispatch([
      {
        type: 'lorem',
        data: 'ipsum'
      },
      {
        dynamicType: 'dolor',
        data: 'sit'
      },
      {
        dynamicType: 'hello',
        payload: {
          data: 'world'
        }
      }
    ]);

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch');
    mockDispatch.mockClear();
  });

  it('should apply a hook for single selectors with useSelector', () => {
    const mockSelector = jest.fn();
    const mockUseSelector = callback => callback();
    const params = [mockSelector, 'loremIpsum', { equality: 'dolorSit', useSelector: mockUseSelector }];

    dynamicReactReduxHooks.useDynamicSelector(...params);

    expect(mockSelector).toHaveBeenCalledTimes(1);
    mockSelector.mockClear();
  });

  it('should apply a hook for multiple selectors with useSelectors', () => {
    // const mockSelectorOne = jest.fn();
    // const mockSelectorTwo = jest.fn();
    const mockSelectors = ['mockSelectorOne', 'mockSelectorTwo'];
    const mockUseSelector = callback => callback();
    const params = [mockSelectors, 'loremIpsum', { equality: 'dolorSit', useSelector: mockUseSelector }];

    dynamicReactReduxHooks.useDynamicSelectors(...params);

    // expect(mockSelectorOne).toHaveBeenCalledTimes(1);
    // expect(mockSelectorTwo).toHaveBeenCalledTimes(1);

    // mockSelectorOne.mockClear();
    // mockSelectorTwo.mockClear();
  });
});
