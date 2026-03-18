import React from 'react';
import {
  context,
  BannerMessagesProvider,
  useBannerMessages,
  useRemoveBannerMessages,
  useSetBannerMessages
} from '../bannerMessagesContext';

describe('BannerMessagesContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for retrieving messages data', async () => {
    const mockContextValue = {
      bannerMessages: {
        dolorSit: [
          {
            id: 'lorem',
            title: 'ipsum'
          }
        ]
      }
    };

    const { result } = await renderHook(() =>
      useBannerMessages({
        useProduct: () => ({ productId: 'dolorSit' }),
        useBannerMessagesContext: () => mockContextValue
      })
    );

    expect(result).toMatchSnapshot('banner messages');
  });

  it.each([
    {
      description: 'set banner messages',
      useHook: useSetBannerMessages,
      method: 'setBannerMessages',
      input: [
        undefined,
        'new message',
        { title: 'lorem', message: 'duplicate id' },
        { id: 'id only' },
        { message: 'message only' }
      ]
    },
    {
      description: 'remove banner messages',
      useHook: useRemoveBannerMessages,
      method: 'removeBannerMessages',
      input: 'ipsum'
    }
  ])('should apply hooks for $description', async ({ useHook, method, input }) => {
    const mockMethod = jest.fn();
    const mockContextValue = {
      [method]: mockMethod
    };

    const { result } = await renderHook(() =>
      useHook({
        useProduct: () => ({ productId: 'dolorSit' }),
        useBannerMessagesContext: () => mockContextValue
      })
    );

    result(input);
    expect(mockMethod).toHaveBeenCalled();
    expect(mockMethod.mock.calls).toMatchSnapshot(method);
  });

  it('should handle state updates through the provider', async () => {
    let capturedResult;
    const TestComponent = () => {
      const messages = useBannerMessages({ useProduct: () => ({ productId: 'lorem' }) });
      const setMessages = useSetBannerMessages({ useProduct: () => ({ productId: 'lorem' }) });
      const removeMessages = useRemoveBannerMessages({ useProduct: () => ({ productId: 'lorem' }) });
      capturedResult = { messages, setMessages, removeMessages };
      return null;
    };

    const rendered = renderComponent(
      <BannerMessagesProvider>
        <TestComponent />
      </BannerMessagesProvider>
    );

    expect(capturedResult.messages).toEqual([]);

    await rendered.act(async () => {
      capturedResult.setMessages({ id: 'test', title: 'test message' });
    });

    expect(capturedResult.messages).toEqual([{ id: 'test', title: 'test message' }]);

    await rendered.act(async () => {
      capturedResult.setMessages({ id: 'test2', title: 'test message 2' });
    });

    expect(capturedResult.messages).toEqual([
      { id: 'test', title: 'test message' },
      { id: 'test2', title: 'test message 2' }
    ]);

    await rendered.act(async () => {
      capturedResult.removeMessages('test');
    });

    expect(capturedResult.messages).toEqual([{ id: 'test2', title: 'test message 2' }]);
  });
});
