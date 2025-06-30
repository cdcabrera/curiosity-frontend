import React from 'react';
import { context, useNotifications } from '../notificationsContext';

// Mock the NotificationsContext from @redhat-cloud-services/frontend-components-notifications
jest.mock('@redhat-cloud-services/frontend-components-notifications', () => ({
  NotificationsContext: {
    Provider: ({ children }) => children,
    Consumer: ({ children }) =>
      children({
        addNotification: jest.fn(),
        removeNotification: jest.fn(),
        getNotifications: jest.fn(() => []),
        clearNotifications: jest.fn()
      })
  }
}));

describe('NotificationsContext', () => {
  it('should return specific properties', () => {
    expect(context).toMatchSnapshot('specific properties');
  });

  it('should apply a hook for notifications functionality', async () => {
    const mockAddNotification = jest.fn();
    const mockRemoveNotification = jest.fn();
    const mockGetNotifications = jest.fn(() => []);
    const mockClearNotifications = jest.fn();

    const mockUseContext = jest.spyOn(React, 'useContext').mockReturnValue({
      addNotification: mockAddNotification,
      removeNotification: mockRemoveNotification,
      getNotifications: mockGetNotifications,
      clearNotifications: mockClearNotifications
    });

    const { result } = await renderHook(() => useNotifications());

    expect(result.addNotification).toBeDefined();
    expect(result.removeNotification).toBeDefined();
    expect(result.clearNotifications).toBeDefined();

    mockUseContext.mockRestore();
  });

  it('should handle addNotification with swatchId transformation', async () => {
    const mockAddNotification = jest.fn();
    const mockRemoveNotification = jest.fn();
    const mockGetNotifications = jest.fn(() => []);
    const mockClearNotifications = jest.fn();

    const mockUseContext = jest.spyOn(React, 'useContext').mockReturnValue({
      addNotification: mockAddNotification,
      removeNotification: mockRemoveNotification,
      getNotifications: mockGetNotifications,
      clearNotifications: mockClearNotifications
    });

    const { result } = await renderHook(() => useNotifications());

    result.addNotification({
      swatchId: 'test-id',
      title: 'Test Title',
      description: 'Test Description',
      variant: 'info'
    });

    expect(mockAddNotification).toHaveBeenCalledWith({
      title: 'Test Title',
      description: 'Test Description',
      variant: 'info',
      swatchid: 'test-id'
    });

    mockUseContext.mockRestore();
  });

  it('should handle removeNotification with existing notification', async () => {
    const mockAddNotification = jest.fn();
    const mockRemoveNotification = jest.fn();
    const mockGetNotifications = jest.fn(() => [
      {
        id: 'generated-id-1',
        swatchid: 'test-swatch-id',
        title: 'Test Notification'
      }
    ]);
    const mockClearNotifications = jest.fn();

    const mockUseContext = jest.spyOn(React, 'useContext').mockReturnValue({
      addNotification: mockAddNotification,
      removeNotification: mockRemoveNotification,
      getNotifications: mockGetNotifications,
      clearNotifications: mockClearNotifications
    });

    const { result } = await renderHook(() => useNotifications());

    result.removeNotification('test-swatch-id');

    expect(mockRemoveNotification).toHaveBeenCalledWith('generated-id-1');

    mockUseContext.mockRestore();
  });

  it('should handle removeNotification with non-existent ID', async () => {
    const mockAddNotification = jest.fn();
    const mockRemoveNotification = jest.fn();
    const mockGetNotifications = jest.fn(() => []);
    const mockClearNotifications = jest.fn();

    const mockUseContext = jest.spyOn(React, 'useContext').mockReturnValue({
      addNotification: mockAddNotification,
      removeNotification: mockRemoveNotification,
      getNotifications: mockGetNotifications,
      clearNotifications: mockClearNotifications
    });

    const { result } = await renderHook(() => useNotifications());

    result.removeNotification('non-existent-id');

    expect(mockRemoveNotification).not.toHaveBeenCalled();

    mockUseContext.mockRestore();
  });
});
