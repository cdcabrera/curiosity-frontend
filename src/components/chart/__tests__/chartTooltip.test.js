import React from 'react';
import { shallow } from 'enzyme';
import { chartTooltip } from '../chartTooltip';

describe('ChartTooltip Component', () => {
  it('should return a basic component', () => {
    const settings = {
      chartSettings: {
        padding: {},
        tooltipDataSetLookUp: {
          1: {
            tooltip: 'lorem ipsum 1'
          },
          2: {
            tooltip: 'dolor sit 2'
          }
        }
      }
    };

    const props = {
      x: 2,
      y: 3,
      datum: { x: 1 }
    };

    const Component = chartTooltip(settings);
    const updatedComponent = shallow(<Component {...props} />);

    expect(updatedComponent).toMatchSnapshot('basic');
  });

  it('should return an empty tooltip when missing content', () => {
    const settings = {
      chartSettings: {
        padding: {},
        tooltipDataSetLookUp: {
          1: {
            tooltip: undefined
          },
          2: {
            tooltip: undefined
          }
        }
      }
    };

    const props = {
      x: 2,
      y: 3,
      datum: { x: 1 }
    };

    const Component = chartTooltip(settings);
    const updatedComponent = shallow(<Component {...props} />);

    expect(updatedComponent).toMatchSnapshot('missing content');
  });

  it('should handle tooltip position', () => {
    const settings = {
      chartContainerRef: () => ({
        current: { querySelector: () => ({ getBoundingClientRect: () => ({ width: 500, height: 100 }) }) }
      }),
      chartTooltipRef: () => ({ current: { getBoundingClientRect: () => ({ width: 40, height: 15 }) } }),
      chartSettings: {
        padding: {},
        tooltipDataSetLookUp: {
          1: {
            tooltip: 'lorem ipsum 1'
          },
          2: {
            tooltip: 'dolor sit 2'
          },
          3: {
            tooltip: 'hello world 3'
          }
        }
      }
    };

    const props = {
      x: 0,
      y: 75,
      datum: { x: 1 }
    };

    const Component = chartTooltip(settings);
    const updatedComponent = shallow(<Component {...props} />);

    expect(updatedComponent).toMatchSnapshot('left tail');

    updatedComponent.setProps({
      ...props,
      x: 250,
      datum: { x: 2 }
    });

    expect(updatedComponent).toMatchSnapshot('middle tail');

    updatedComponent.setProps({
      ...props,
      x: 500,
      datum: { x: 3 }
    });

    expect(updatedComponent).toMatchSnapshot('right tail');
  });
});
