import React from 'react';
import { FilterIcon } from '@patternfly/react-icons';
import {
  Select,
  formatEvent,
  formatOptions,
  SelectButtonVariant,
  SelectVariant,
  SelectDirection,
  SelectPosition,
  setSelectElements,
  updateDataAttributes,
  updateOptions,
  updateSelectedOptions,
  useOnSelect
} from '../select';
// import { helpers } from '../../../common';

describe('Select Component', () => {
  it('should render a basic component', () => {
    const props = {
      id: 'test',
      options: [
        { title: 'lorem', value: 'ipsum' },
        { title: 'hello', value: 'world', selected: true }
      ]
    };

    const component = renderComponent(<Select {...props} />);
    expect(component).toMatchSnapshot('basic component');
  });

  it('should render a checkbox select', () => {
    const props = {
      id: 'test',
      options: [
        { title: 'lorem', value: 'ipsum' },
        { title: 'hello', value: 'world', selected: true }
      ],
      selectedOptions: ['world', 'ipsum'],
      variant: SelectVariant.checkbox,
      placeholder: 'multiselect test'
    };

    const component = renderComponent(<Select {...props} />);
    expect(component).toMatchSnapshot('checkbox select');
  });

  /*
   *it('should apply patternfly select props based on wrapper props', () => {
   *  const props = {};
   *
   *  expect(formatSelectProps(props)).toMatchSnapshot('select props, disabled');
   *
   *  props.options = [];
   *  expect(formatSelectProps(props)).toMatchSnapshot('select props, no options, disabled');
   *
   *  props.options = ['lorem', 'ipsum'];
   *  props.isDisabled = true;
   *  expect(formatSelectProps(props)).toMatchSnapshot('select props, options, disabled');
   *
   *  props.placeholder = 'dolor sit';
   *  props.isDisabled = false;
   *  expect(formatSelectProps(props)).toMatchSnapshot('select props, placeholder');
   *});
   */
  /*
   *it('should apply patternfly dropdown props based on wrapper props', () => {
   *  const props = {};
   *
   *  expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, disabled');
   *
   *  props.options = [];
   *  expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, no options, disabled');
   *
   *  props.options = ['lorem', 'ipsum'];
   *  props.isDisabled = true;
   *  expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, options, disabled');
   *
   *  props.placeholder = 'dolor sit';
   *  props.isDisabled = false;
   *  expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, placeholder');
   *
   *  props.toggle = { variant: SelectButtonVariant.plain };
   *  props.splitButtonVariant = SplitButtonVariant.checkbox;
   *  expect(formatButtonProps(props)).toMatchSnapshot('dropdown props, button variants');
   *});
   */

  it('should allow alternate array and object options', async () => {
    const props = {
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum']
    };

    expect(formatOptions(props).options).toMatchSnapshot('string array');

    props.options = { lorem: 'ipsum', hello: 'world' };
    props.selectedOptions = ['world', 'ipsum'];

    expect(formatOptions(props).options).toMatchSnapshot('key value object');

    props.options = [
      { title: 'lorem', value: 'ipsum' },
      { title: () => 'hello', value: 'world' }
    ];
    props.selectedOptions = ['world', 'ipsum'];

    expect(formatOptions(props).options).toMatchSnapshot('key value object');

    props.options = undefined;
    props.selectedOptions = [];

    expect(formatOptions(props).options).toMatchSnapshot('undefined options');
  });

  it('should allow plain objects as values, and be able to select options based on values within the object', async () => {
    const props = {
      options: [
        { title: 'lorem', value: { dolor: 'sit' } },
        { title: 'dolor', value: { lorem: 'ipsum' } },
        { title: 'hello', value: { hello: 'world' } }
      ],
      selectedOptions: ['world']
    };

    expect(formatOptions(props).options).toMatchSnapshot('select when option values are objects');
  });

  /*
   *it('should allow selected options to match value or title', async () => {
   *  const props = {
   *    options: { lorem: 'ipsum', hello: 'world', dolor: 'set' },
   *    selectedOptions: ['world', 'lorem', 'fail'],
   *    variant: SelectVariant.checkbox
   *  };
   *
   *  expect(formatOptions(props).options).toMatchSnapshot('value or title match');
   *});
   */

  it('should return an emulated onchange event', () => {
    const mockOnSelect = jest.fn();
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum'],
      onSelect: mockOnSelect
    };

    const component = renderComponent(<Select {...props} />);
    const firstButton = component.find('button');
    component.fireEvent.click(firstButton);

    const anotherButton = component.find('button.curiosity-select-pf__option');
    component.fireEvent.click(anotherButton);

    expect(mockOnSelect).toHaveBeenCalledTimes(1);
    expect(mockOnSelect.mock.calls).toMatchSnapshot('default emulated event');
  });

  it('should return an emulated onchange event, checklist variant', () => {
    const mockOnSelect = jest.fn();
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world'],
      selectedOptions: ['ipsum'],
      onSelect: mockOnSelect,
      variant: SelectVariant.checkbox
    };

    const component = renderComponent(<Select {...props} />);
    const firstButton = component.find('button');
    component.fireEvent.click(firstButton);

    const firstCheckbox = component.find('label.curiosity-select-pf__option input');
    component.fireEvent.click(firstCheckbox, { target: { checked: true } });

    expect(mockOnSelect).toHaveBeenCalledTimes(1);

    const secondCheckbox = component.querySelectorAll('label.curiosity-select-pf__option input')?.[1];
    component.fireEvent.click(secondCheckbox, { target: { checked: true } });

    expect(mockOnSelect).toHaveBeenCalledTimes(2);
    expect(mockOnSelect.mock.calls).toMatchSnapshot('checklist emulated event, last item checked');
  });

  it('should render an expanded select', () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum', 'hello', 'world']
    };

    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));
    expect(component.find('ul')).toMatchSnapshot('expanded');
  });

  it('should disable toggle text', () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum'],
      toggle: { icon: <FilterIcon />, isToggleIconOnly: true }
    };

    const component = renderComponent(<Select {...props} />);
    expect(component.find('button')).toMatchSnapshot('disabled text');
  });

  /*
  it('should allow alternate direction and position options', () => {
    const props = {
      id: 'test',
      options: ['lorem', 'ipsum'],
      alignment: {
        direction: SelectDirection.up
      }
    };

    const component = renderComponent(<Select {...props} />);
    const upLeftProps = component.find('.curiosity-select-pf');
    expect(upLeftProps).toMatchSnapshot('direction up');

    const posRight = component.setProps({
      alignment: { direction: SelectDirection.down, position: SelectPosition.right }
    });
    const downRightProps = posRight.find('.curiosity-select-pf');
    expect(downRightProps).toMatchSnapshot('position right');
  });
  */

  it('should allow being disabled with missing options', () => {
    const component = renderComponent(<Select options={undefined} />);
    component.fireEvent.click(component.find('button'));
    expect(component).toMatchSnapshot('no options');

    const componentNoOptions = renderComponent(<Select options={[]} />);
    componentNoOptions.fireEvent.click(componentNoOptions.find('button'));
    expect(componentNoOptions).toMatchSnapshot('options, but no content');

    const componentDisabled = renderComponent(<Select options={['lorem', 'ipsum', 'hello', 'world']} isDisabled />);
    componentDisabled.fireEvent.click(componentDisabled.find('button'));
    expect(componentDisabled).toMatchSnapshot('options, but disabled');
  });

  it('should allow disabled options', () => {
    const props = {
      id: 'test',
      options: ['lorem', { value: 'ipsum', isDisabled: true }, 'hello', { value: 'world', isDisabled: true }]
    };

    const component = renderComponent(<Select {...props} />);
    component.fireEvent.click(component.find('button'));
    expect(component.find('ul')).toMatchSnapshot('disabled options');
  });

  it('should allow data- props', () => {
    const props = {
      'data-lorem': 'ipsum',
      'data-dolor-sit': 'dolor sit'
    };

    const component = renderComponent(<Select {...props} />);
    expect(component.find('button')).toMatchSnapshot('data- attributes');
  });

  it('should emulate pf dropdown', () => {
    const props = {
      variant: SelectVariant.dropdown,
      toggle: { variant: SelectButtonVariant.secondary },
      options: ['lorem', 'ipsum', 'hello', 'world']
    };

    const component = renderComponent(<Select {...props} />);
    expect(component).toMatchSnapshot('emulated dropdown');
  });
});
