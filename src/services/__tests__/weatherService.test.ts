import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherService } from '../weatherService';

// Mock fetch
global.fetch = vi.fn();

describe('WeatherService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches current weather data', async () => {
    const mockWeatherData = {
      temperature: 25,
      humidity: 60,
      windSpeed: 15,
      condition: 'Partly Cloudy',
    };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockWeatherData,
    });

    const data = await WeatherService.getCurrentWeather(28.6139, 77.2090);
    expect(data).toEqual(mockWeatherData);
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    await expect(
      WeatherService.getCurrentWeather(28.6139, 77.2090)
    ).rejects.toThrow();
  });

  it('fetches weather forecast', async () => {
    const mockForecast = [
      { date: '2026-01-09', temp: 26, condition: 'Sunny' },
      { date: '2026-01-10', temp: 24, condition: 'Cloudy' },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ forecast: mockForecast }),
    });

    const forecast = await WeatherService.getForecast(28.6139, 77.2090);
    expect(forecast).toHaveLength(2);
  });

  it('caches weather data', async () => {
    const mockData = { temperature: 25, condition: 'Clear' };

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    // First call
    await WeatherService.getCurrentWeather(28.6139, 77.2090);
    
    // Second call should use cache
    await WeatherService.getCurrentWeather(28.6139, 77.2090);

    // Fetch should only be called once due to caching
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
