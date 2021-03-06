import React from 'react';
import { shallow } from 'enzyme';
import { Loader } from '../loader';

describe('Loader Component', () => {
  it('should render a non-connected component', () => {
    const props = {};

    const component = shallow(<Loader {...props} />);
    expect(component).toMatchSnapshot('non-connected');
  });

  it('should handle variant loader components', () => {
    const props = {};

    const component = shallow(<Loader {...props} />);
    expect(component).toMatchSnapshot('variant: default');

    component.setProps({
      variant: 'skeleton'
    });
    expect(component).toMatchSnapshot('variant: skeleton');

    component.setProps({
      variant: 'spinner'
    });
    expect(component).toMatchSnapshot('variant: spinner');

    component.setProps({
      variant: 'title'
    });
    expect(component).toMatchSnapshot('variant: title');

    component.setProps({
      variant: 'paragraph'
    });
    expect(component).toMatchSnapshot('variant: paragraph');

    component.setProps({
      variant: 'chart'
    });
    expect(component).toMatchSnapshot('variant: chart');

    component.setProps({
      variant: 'graph'
    });
    expect(component).toMatchSnapshot('variant: graph');

    component.setProps({
      variant: 'table'
    });
    expect(component).toMatchSnapshot('variant: table');
  });
});
