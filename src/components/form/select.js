import React, { useCallback, useRef, useState } from 'react';
import {
  Badge,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  Select as PfSelect,
  SelectList as PfSelectList,
  SelectOption as PfSelectOption
} from '@patternfly/react-core';
import _cloneDeep from 'lodash/cloneDeep';
import _isPlainObject from 'lodash/isPlainObject';
import _findIndex from 'lodash/findIndex';
import { useShallowCompareEffect, useMount } from 'react-use';
import { createMockEvent } from './formHelpers';
import { helpers } from '../../common';

/**
 * A bundled wrapper for PF Select, Dropdown.
 *
 * @memberof Form
 * @module Select
 */

/**
 * Pass button variant as a select component option.
 *
 * @type {{secondary: ButtonVariant.secondary, plain: ButtonVariant.plain, tertiary:
 *     ButtonVariant.tertiary, link: ButtonVariant.link, warning: ButtonVariant.warning, control:
 *     ButtonVariant.control, danger: ButtonVariant.danger, primary: ButtonVariant.primary}}
 */
const SelectButtonVariant = { ...ButtonVariant };

/**
 * Pass select variants as a select component variant option.
 *
 * @type {{single: string, checkbox: string, dropdown: string}}
 */
const SelectVariant = {
  single: 'single',
  checkbox: 'checkbox',
  dropdown: 'dropdown'
};

/**
 * Direction as select prop option.
 *
 * @type {{up: string, down: string}}
 */
const SelectDirection = { up: 'up', down: 'down' };

/**
 * Position as select prop option.
 *
 * @type {{left: string, center: string, right: string}}
 */
const SelectPosition = { left: 'left', right: 'right', center: 'center' };

/**
 * Update list options for consumption by PF components
 *
 * @param {Array} options
 * @returns {Array}
 */
const updateOptions = options => {
  const updated = (Array.isArray(options) && helpers.memoClone(options)) || [];

  updated.forEach((option, index) => {
    let convertedOption = option;

    switch (typeof convertedOption) {
      case 'string':
      case 'number':
        convertedOption = {
          title: option,
          value: option
        };

        updated[index] = convertedOption;
        break;
    }

    if (_isPlainObject(convertedOption)) {
      convertedOption.isSelected = option.isSelected || false;
      convertedOption.index = index;
      convertedOption.key = `${helpers.generateHash(convertedOption.value)}${window.btoa(`${convertedOption.title}`)}`;
    }
  });

  return updated;
};

/**
 * A memoized response for the updateOptions function. Assigned to a property for unit testing.
 */
updateOptions.memo = helpers.memo(updateOptions);

/**
 * Update selected list options for consumption.
 *
 * @param {string|number|{value: unknown}|
 *     Array<string|number|{value: unknown
 *     }>} options
 * @returns {Array<{value: unknown, title: unknown|undefined}>}
 */
const updateSelectedOptions = options => (Array.isArray(options) && options) || (options && [options]) || [];

/**
 * Apply "data-" attributes to main PF element.
 *
 * @param {object} params
 * @param {React.ReactElement|HTMLElement} params.selectField
 * @param {object} params.props
 */
const updateDataAttributes = ({ selectField = { current: null }, ...props } = {}) => {
  const { current: domElement = {} } = selectField;
  const attributes = Object.entries(props).filter(([key]) => /^data-/i.test(key));

  if (domElement?.firstChild) {
    attributes.forEach(([key, value]) => domElement?.firstChild.setAttribute(key, value));
  }
};

/**
 * Format base/initial options, selectedOption for initial component display.
 *
 * @param {object} params
 * @param {updateOptions} params.options
 * @param {updateSelectedOptions} params.selectedOptions
 * @param {SelectVariant} params.variant
 * @returns {{options, selected}}
 */
const formatOptions = ({ options, selectedOptions, variant } = {}) => {
  const updatedOptions = updateOptions.memo(options);
  const updatedSelectedOptions = updateSelectedOptions(selectedOptions);
  let updateSelected;

  updatedOptions.forEach(({ isSelected, title, value }, index) => {
    let updateIsSelected = isSelected;

    if (updateIsSelected === true) {
      return;
    }

    if (_isPlainObject(value)) {
      updateIsSelected = _findIndex(updatedSelectedOptions, value) > -1;

      if (!isSelected) {
        updateIsSelected =
          updatedSelectedOptions.find(activeOption => Object.values(value).includes(activeOption)) !== undefined;
      }
    } else {
      updateIsSelected = updatedSelectedOptions.includes(value);
    }

    if (!updateIsSelected) {
      updateIsSelected = updatedSelectedOptions.includes(title);
    }

    updatedOptions[index].isSelected = updateIsSelected;
  });

  if (variant === SelectVariant.single) {
    updateSelected = (updatedOptions.find(opt => opt.isSelected === true) || {}).title;
  } else {
    updateSelected = updatedOptions.filter(opt => opt.isSelected === true).map(opt => opt.title);
  }

  return {
    options: updatedOptions,
    selected: updateSelected
  };
};

/**
 * Expand returned event for select responses.
 *
 * @param {object} params
 * @param {object} params.event
 * @param {Array<{ isSelected: boolean }>} params.options
 * @param {SelectVariant} params.variant
 * @returns {CustomEvent<{keyCode, currentTarget: {}, name, checked: *, id: *, persist: Function,
 *     value, target: {}, selected: unknown|Array<unknown>, selectedIndex: Array<number>,
 *     type: "select-one"|"select-multiple", value: unknown }>}
 */
const formatEvent = ({ event, options, variant } = {}) => {
  const mockUpdatedOptions = helpers.memoClone(options);
  const mockSelected =
    (variant === SelectVariant.single && mockUpdatedOptions.find(({ isSelected }) => isSelected === true)) ||
    mockUpdatedOptions.filter(({ isSelected }) => isSelected === true);

  const mockSelectedIndex = mockUpdatedOptions
    .filter(({ isSelected }) => isSelected === true)
    .map(({ index }) => index);

  return {
    ...createMockEvent(event),
    selected: mockSelected,
    selectedIndex: mockSelectedIndex,
    type: `select-${((variant === SelectVariant.single || variant === SelectVariant.dropdown) && 'one') || 'multiple'}`,
    value: (Array.isArray(mockSelected) && mockSelected.map(({ value: mockValue }) => mockValue)) || mockSelected.value
  };
};

/**
 * Set PF components.
 *
 * @param {SelectVariant} [variant]
 * @returns {{SelectList: React.FunctionComponent<DropdownList|PfSelectList>,
 *     SelectElement: React.FunctionComponent<Dropdown|PfSelect>, SelectOption:
 *     React.FunctionComponent<DropdownItem|PfSelectOption>}}
 */
const setSelectElements = variant => ({
  SelectElement: (variant === SelectVariant.dropdown && Dropdown) || PfSelect,
  SelectList: (variant === SelectVariant.dropdown && DropdownList) || PfSelectList,
  SelectOption: (variant === SelectVariant.dropdown && DropdownItem) || PfSelectOption
});

setSelectElements.memo = helpers.memo(setSelectElements);

/**
 * Hook for handling option and selected option updates.
 *
 * @param {object} options
 * @param {updateOptions} options.options
 * @param {Function} options.onSelect
 * @param {updateSelectedOptions} options.selectedOptions
 * @param {SelectVariant} options.variant
 * @returns {{options: Array, selectedTitle: undefined, onSelect: Function}}
 */
const useOnSelect = ({ options: baseOptions, onSelect, selectedOptions, variant }) => {
  const [selectedTitle, setSelectedTitle] = React.useState();
  const [options, setOptions] = useState([]);

  useShallowCompareEffect(() => {
    const { options: updatedOptions, selected: updatedSelected } = formatOptions({
      options: baseOptions,
      selectedOptions,
      variant
    });

    setOptions(updatedOptions);
    setSelectedTitle(updatedSelected);
  }, [baseOptions, selectedOptions, variant]);

  const onSelectCallback = useCallback(
    (event, key) => {
      const updatedOptions = _cloneDeep(options);
      const selectedOptionIndex = updatedOptions.findIndex(option => option.key === key);

      if (options[selectedOptionIndex].isDisabled === true) {
        return;
      }

      switch (variant) {
        case SelectVariant.checkbox:
          updatedOptions[selectedOptionIndex].isSelected = !updatedOptions[selectedOptionIndex].isSelected;
          break;
        case SelectVariant.single:
        default:
          updatedOptions.forEach((_option, index) => {
            updatedOptions[index].isSelected = index === selectedOptionIndex;
          });
          break;
      }

      setSelectedTitle(updatedOptions[selectedOptionIndex].title);
      setOptions(updatedOptions);

      if (typeof onSelect === 'function') {
        const selectEvent = formatEvent({ event, options: updatedOptions, variant });
        onSelect(selectEvent);
      }
    },
    [onSelect, variant, options]
  );

  return {
    selectedTitle,
    options,
    onSelect: onSelectCallback
  };
};

/**
 * Component wrapper for PF Select and Dropdown.
 *
 * @param {object} props
 * @param {{ direction: SelectDirection,
 *     position: SelectPosition,
 *     preventOverflow: boolean }} [props.alignment] Alias for PF references to "popperProps".
 *     Override by passing a "popperProps" prop object value.
 * @param {string} [props.className]
 * @param {boolean} [props.isDisabled] Disable the select/dropdown toggle
 * @param {boolean} [props.isInline=true] Is the select/dropdown an inline-block or not.
 * @param {number} [props.maxHeight] Max height of the select/dropdown menu
 * @param {Function} [props.onSelect]
 * @param {Array<string|number|{
 *     description: (unknown|undefined),
 *     isSelected: (boolean|undefined),
 *     isDisabled: (boolean|undefined),
 *     title: (string|undefined),
 *     value: unknown
 *     }>} props.options
 * @param {React.ReactNode} [props.placeholder] The default value for the select/dropdown. An emulated placeholder.
 * @param {string|number|{value: unknown}|
 *     Array<string|number|{value: unknown
 *     }>} [props.selectedOptions]
 * @param {{ content: React.ReactNode|undefined, icon: React.ReactNode|undefined,
 *     isToggleIconOnly: boolean|undefined, variant: SelectButtonVariant|undefined }} [props.toggle] select/dropdown
 *     menu-toggle props object
 * @param {SelectVariant} [props.variant=SelectVariant.single]
 * @returns {React.ReactElement}
 */
const Select = ({
  alignment,
  className,
  isDisabled,
  isInline = true,
  maxHeight,
  onSelect: baseOnSelect,
  options: baseOptions,
  placeholder = 'Select option',
  selectedOptions,
  toggle,
  variant = SelectVariant.single,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const selectField = useRef();
  const { options, selectedTitle, onSelect } = useOnSelect({
    ...props,
    options: baseOptions,
    onSelect: baseOnSelect,
    placeholder,
    selectedOptions,
    variant
  });
  const { SelectElement, SelectList, SelectOption } = setSelectElements.memo(variant);

  useMount(() => {
    updateDataAttributes({ ...props, selectField });
  });

  const onKeySelectOrClickOutsideSelect = () => {
    setIsExpanded(false);
  };

  const onToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const onPfSelect = (...args) => {
    if (variant === SelectVariant.single || variant === SelectVariant.dropdown) {
      setIsExpanded(false);
    }
    onSelect(...args);
  };

  const toggleContent = toggle?.content;
  const isToggleIconOnly = toggle?.isToggleIconOnly;
  const toggleProps = {
    isDisabled: isDisabled ?? options.length === 0,
    ...toggle
  };
  delete toggleProps.content;
  delete toggleProps.isToggleIconOnly;

  const updatedProps = {
    popperProps: {
      ...alignment
    },
    maxMenuHeight: (maxHeight && `${maxHeight}px`) || undefined,
    toggle: toggleRef => (
      <MenuToggle
        className="curiosity-select-pf__toggle"
        ref={toggleRef}
        onClick={onToggle}
        isExpanded={isExpanded}
        isFullWidth={isInline === false}
        {...toggleProps}
      >
        {(!isToggleIconOnly &&
          (toggleContent ||
            (variant === SelectVariant.dropdown && placeholder) ||
            (variant === SelectVariant.single && (selectedTitle || placeholder)))) ||
          (variant === SelectVariant.checkbox && (
            <React.Fragment>
              {!isToggleIconOnly && `${placeholder} `}
              {options.filter(({ isSelected }) => isSelected === true).length > 0 && (
                <Badge isRead>{options.filter(({ isSelected }) => isSelected === true).length}</Badge>
              )}
            </React.Fragment>
          ))}
      </MenuToggle>
    ),
    ...props
  };

  // Note: applying isExpanded to the options map helps remove animation flicker
  return (
    <div
      ref={selectField}
      className={`curiosity-select${(isInline && ' curiosity-select__inline') || ' curiosity-select__not-inline'}`}
    >
      <SelectElement
        className={`curiosity-select-pf ${className || ''}`}
        isOpen={isExpanded}
        onSelect={onPfSelect}
        onOpenChange={onKeySelectOrClickOutsideSelect}
        popperProps={{
          direction: 'up'
        }}
        {...updatedProps}
      >
        <SelectList>
          {isExpanded &&
            options?.map(option => (
              <SelectOption
                className="curiosity-select-pf__option"
                role="menu"
                description={option.description}
                key={option.key}
                id={option.key}
                hasCheckbox={variant === SelectVariant.checkbox}
                icon={option.icon}
                isDisabled={option.isDisabled === true}
                isSelected={variant !== SelectVariant.dropdown && option.isSelected}
                value={option.key}
              >
                {option.title}
              </SelectOption>
            ))}
        </SelectList>
      </SelectElement>
    </div>
  );
};

export {
  Select as default,
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
};
