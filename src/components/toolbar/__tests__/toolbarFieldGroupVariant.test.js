import React from 'react';
import { ToolbarFieldGroupVariant, useToolbarFieldOptions, useOnSelect } from '../toolbarFieldGroupVariant';
import { store } from '../../../redux/store';

describe('ToolbarFieldGroupVariant Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.spyOn(store, 'dispatch').mockImplementation((type, data) => ({ type, data }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render a basic component', async () => {
    const props = {
      useToolbarFieldOptions: () => [
        { title: 'lorem', value: 'lorem' },
        { title: 'ipsum', value: 'ipsum' },
        { title: 'dolor', value: 'dolor' },
        { title: 'sit', value: 'sit' }
      ]
    };
    const component = await shallowHookComponent(<ToolbarFieldGroupVariant {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should return a standalone component with toolbar', async () => {
    const props = {
      isStandalone: true,
      useToolbarFieldOptions: () => [
        { title: 'lorem', value: 'lorem' },
        { title: 'ipsum', value: 'ipsum' }
      ]
    };
    const component = await shallowHookComponent(<ToolbarFieldGroupVariant {...props} />);

    expect(component).toMatchSnapshot('standalone toolbar');
  });

  it('should return null, undefined, or empty if there are one or less options', async () => {
    const props = {
      useToolbarFieldOptions: () => [{ title: 'lorem', value: 'lorem' }]
    };
    const component = await shallowHookComponent(<ToolbarFieldGroupVariant {...props} />);

    expect(component).toMatchSnapshot('one or less');
  });

  it('should generate select options', () => {
    const { result: toolbarFieldOptions } = shallowHook(() =>
      useToolbarFieldOptions({
        useRouteDetail: () => ({
          availableVariants: ['lorem', 'ipsum', 'dolor', 'sit', '']
        })
      })
    );

    expect(toolbarFieldOptions).toMatchSnapshot('toolbarFieldOptions');
  });

  it('should handle updating through redux state with component', async () => {
    const props = {
      useToolbarFieldOptions: () => [
        {
          selected: false,
          title: 't(curiosity-toolbar.label_variant, {"context":"ipsum"})',
          value: 'ipsum'
        },
        {
          selected: false,
          title: 't(curiosity-toolbar.label_variant, {"context":"lorem"})',
          value: 'lorem'
        }
      ]
    };

    const component = await mountHookComponent(<ToolbarFieldGroupVariant {...props} />);
    component.find('button').simulate('click');
    component.update();
    component.find('button.pf-c-select__menu-item').first().simulate('click');

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, component');
  });

  it('should handle updating through redux state with hook', () => {
    const options = {
      useProduct: () => ({ productGroup: 'loremIpsum' })
    };

    const onSelect = useOnSelect(options);
    onSelect({
      value: 'dolor sit'
    });

    expect(mockDispatch.mock.calls).toMatchSnapshot('dispatch, hook');
  });
});