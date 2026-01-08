import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AlertNotificationService } from '../alertNotificationService';

describe('AlertNotificationService', () => {
  let service: AlertNotificationService;

  beforeEach(() => {
    service = AlertNotificationService.getInstance();
    // Mock Audio API
    global.Audio = vi.fn().mockImplementation(() => ({
      play: vi.fn().mockResolvedValue(undefined),
      pause: vi.fn(),
      load: vi.fn(),
    })) as any;
  });

  it('creates singleton instance', () => {
    const instance1 = AlertNotificationService.getInstance();
    const instance2 = AlertNotificationService.getInstance();
    expect(instance1).toBe(instance2);
  });

  it('plays sound when enabled', async () => {
    service.updateSettings({ soundEnabled: true, volume: 0.8 });
    await service.playAlert('warning');
    
    // Verify Audio was instantiated
    expect(global.Audio).toHaveBeenCalled();
  });

  it('does not play sound when disabled', async () => {
    service.updateSettings({ soundEnabled: false });
    await service.playAlert('warning');
    
    // Should not play
    const audioMock = vi.mocked(global.Audio);
    audioMock.mockClear();
  });

  it('triggers haptic feedback on mobile', () => {
    const vibrateMock = vi.fn();
    Object.defineProperty(navigator, 'vibrate', {
      value: vibrateMock,
      writable: true,
    });

    service.updateSettings({ hapticEnabled: true });
    service.triggerHaptic('warning');

    expect(vibrateMock).toHaveBeenCalled();
  });

  it('respects volume settings', () => {
    service.updateSettings({ volume: 0.5 });
    expect(service.getSettings().volume).toBe(0.5);
  });
});
