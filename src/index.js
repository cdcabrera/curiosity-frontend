import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { baseName } from './components/router/routerHelpers';
import { store } from './redux';
import App from './components/app';
import '@redhat-cloud-services/frontend-components/index.css';
import '@redhat-cloud-services/frontend-components-notifications/index.css';
import './styles/index.scss';

render(
  <Provider store={store}>
    <BrowserRouter basename={baseName}>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
