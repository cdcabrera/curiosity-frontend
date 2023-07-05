import React from 'react';
import { TableVariant } from '@patternfly/react-table';
import { Table } from '../table';

describe('Table Component', () => {
  it('should render a basic component', () => {
    const props = {
      columnHeaders: ['lorem', 'ipsum', 'dolor', 'sit']
    };

    const component = renderComponent(<Table {...props} />);
    expect(component).toMatchSnapshot('basic');
  });

  it('should allow variations in table layout', () => {
    const props = {
      columnHeaders: ['lorem ipsum'],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('table')).toMatchSnapshot('generated rows');

    const componentNoBordersHeader = component.setProps({
      borders: false,
      isHeader: false
    });
    expect(componentNoBordersHeader.find('table')).toMatchSnapshot('borders and table header removed');

    const componentAriaTableSummary = component.setProps({
      ariaLabel: 'lorem ipsum aria-label',
      summary: 'lorem ipsum summary'
    });
    expect(componentAriaTableSummary.find('table')).toMatchSnapshot('ariaLabel and summary');

    const componentClassVariant = component.setProps({
      className: 'lorem-ipsum-class',
      variant: TableVariant.compact
    });
    expect(componentClassVariant.find('table')).toMatchSnapshot('className and variant');
  });

  it('should allow expandable content', () => {
    const props = {
      columnHeaders: ['lorem ipsum'],
      rows: [{ cells: ['dolor'], expandedContent: 'dolor sit expandable content' }, { cells: ['sit'] }]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component).toMatchSnapshot('expandable content');
    expect(component.find('tr.pf-c-table__expandable-row')).toMatchSnapshot('no expanded row');

    const input = component.find('td.pf-c-table__toggle button');
    component.fireEvent.click(input);

    expect(component.find('tr.pf-c-table__expandable-row')).toMatchSnapshot('expanded row');
  });

  it('should allow sortable content', () => {
    const props = {
      columnHeaders: [{ title: 'lorem ipsum', onSort: jest.fn() }],
      rows: [{ cells: ['dolor'] }, { cells: ['sit'] }]
    };

    const component = renderComponent(<Table {...props} />);
    expect(component.find('table')).toMatchSnapshot('sortable content');

    const input = component.find('th button.pf-c-table__button');
    component.fireEvent.click(input);

    expect(props.columnHeaders[0].onSort).toHaveBeenCalledTimes(1);
  });

  it('should pass child components, nodes when there are no rows', () => {
    const props = {
      columnHeaders: ['lorem ipsum'],
      rows: []
    };

    const component = renderComponent(<Table {...props}>Loading...</Table>);
    expect(component).toMatchSnapshot('children');
  });
});
