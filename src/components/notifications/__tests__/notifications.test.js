import React from 'react';
import { Notifications } from '../notifications';

describe('Notifications Component', () => {
  it('should render a basic component', async () => {
    const props = {
      children: <div>Test children</div>
    };

    const component = await shallowComponent(<Notifications {...props} />);

    expect(component).toMatchSnapshot('basic');
  });

  it('should render with NotificationsProvider when notifications are enabled', async () => {
    const props = {
      children: <div>Test children</div>
    };

    const component = await shallowComponent(<Notifications {...props} />);

    expect(component).toMatchSnapshot('with NotificationsProvider');
  });

  it('should render children directly when notifications are disabled', async () => {
    const props = {
      children: <div>Test children</div>
    };

    const component = await shallowComponent(<Notifications {...props} />);

    expect(component).toMatchSnapshot('direct children');
  });

  it('should handle multiple children', async () => {
    const props = {
      children: [<div key="1">First child</div>, <div key="2">Second child</div>]
    };

    const component = await shallowComponent(<Notifications {...props} />);

    expect(component).toMatchSnapshot('multiple children');
  });
});
