import moxios from 'moxios';
import * as service from '../config';

describe('ServiceConfig', () => {
  // Return a promise, or promise like, response for errors
  const returnPromiseAsync = async promiseAsyncCall => {
    let response;

    try {
      response = await promiseAsyncCall();
    } catch (e) {
      response = e;
    }

    return response;
  };

  beforeAll(() => {
    moxios.install();

    moxios.stubRequest(/\/test.*?/, {
      status: 200,
      responseText: 'success',
      timeout: 1
    });
  });

  afterAll(() => {
    moxios.uninstall();
  });

  it('should export a specific number of methods and classes', () => {
    expect(Object.keys(service)).toHaveLength(4);
  });

  it('should export a default services config', () => {
    const configObject = service.serviceConfig();

    expect(Object.keys(configObject.headers).length).toBe(0);
    expect(configObject.timeout).toBe(process.env.REACT_APP_AJAX_TIMEOUT);
  });

  it('should export a customized services config', () => {
    const configObject = service.serviceConfig({
      method: 'post',
      timeout: 3
    });

    expect(configObject.method).toBe('post');
    expect(configObject.timeout).toBe(3);
  });

  it('should handle a bundled authentication and service call', async () => {
    const response = await service.serviceCall({ url: '/test/' });

    expect(response.data).toBe('success');
  });

  it('should handle cancelling service calls', async () => {
    const responseAll = await returnPromiseAsync(() =>
      Promise.all([
        service.serviceCall({ url: '/test/', cancel: true }),
        service.serviceCall({ url: '/test/', cancel: true }),
        service.serviceCall({ url: '/test/', cancel: true })
      ])
    );

    expect(responseAll).toMatchSnapshot('cancelled request, Promise.all');

    const responseAllSettled = await returnPromiseAsync(() =>
      Promise.allSettled([
        service.serviceCall({ url: '/test/', cancel: true }),
        service.serviceCall({ url: '/test/', cancel: true }),
        service.serviceCall({ url: '/test/', cancel: true })
      ])
    );

    expect(responseAllSettled).toMatchSnapshot('cancelled request, Promise.allSettled');
  });

  it('should handle caching service calls', async () => {
    const responses = [];

    // First, call an endpoint with set params
    const responseOne = await service.serviceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' }
    });
    responses.push(responseOne.status);

    // Second, call the same endpoint with same params, expect a cached response, emulated 304
    const responseTwo = await service.serviceCall({
      cache: true,
      url: '/test/',
      params: { lorem: 'ipsum', dolor: 'sit' }
    });
    responses.push(responseTwo.status);

    // Third, updating params creates a new cache
    const responseThree = await service.serviceCall({ cache: true, url: '/test/', params: { lorem: 'ipsum' } });
    responses.push(responseThree.status);

    expect(responses).toMatchSnapshot('cached responses, emulated 304');
  });
});
