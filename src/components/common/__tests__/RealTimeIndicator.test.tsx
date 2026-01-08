import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { RealTimeIndicator } from '../RealTimeIndicator';

describe('RealTimeIndicator', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('renders live badge with pulse animation', () => {
    render(<RealTimeIndicator />);
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('displays countdown timer', () => {
    render(<RealTimeIndicator lastUpdate={new Date()} />);
    expect(screen.getByText(/Next update in/)).toBeInTheDocument();
  });

  it('shows connection status', () => {
    render(<RealTimeIndicator connected={true} />);
    expect(screen.getByText(/Connected/)).toBeInTheDocument();
  });

  it('displays last updated timestamp', async () => {
    const lastUpdate = new Date();
    render(<RealTimeIndicator lastUpdate={lastUpdate} />);
    
    await waitFor(() => {
      expect(screen.getByText(/Last updated:/)).toBeInTheDocument();
    });
  });

  it('shows refresh button when onRefresh provided', () => {
    const handleRefresh = vi.fn();
    render(<RealTimeIndicator onRefresh={handleRefresh} />);
    
    const refreshButton = screen.getByRole('button');
    expect(refreshButton).toBeInTheDocument();
  });
});
