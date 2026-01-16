import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

jest.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: any) => <div>{children}</div>,
  Routes: ({ children }: any) => <div>{children}</div>,
  Route: () => null,
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: '/' }),
}), { virtual: true });

jest.mock('react-leaflet', () => {
  const LayersControl = ({ children }: any) => <div>{children}</div>;
  (LayersControl as any).BaseLayer = ({ children }: any) => <div>{children}</div>;

  return {
    MapContainer: ({ children }: any) => <div>{children}</div>,
    TileLayer: () => <div>TileLayer</div>,
    Marker: ({ children }: any) => <div>{children}</div>,
    Popup: ({ children }: any) => <div>{children}</div>,
    Circle: () => <div>Circle</div>,
    Polygon: ({ children }: any) => <div>{children}</div>,
    ZoomControl: () => <div>ZoomControl</div>,
    LayersControl,
    useMap: () => ({ setView: jest.fn() }),
    useMapEvents: jest.fn(),
  };
});

jest.mock('styled-components', () => {
  const React = require('react');
  const mockFactory = () => {
    const fn = (strings: any, ...args: any[]) => ({ children, ...props }: any) => (
      <div data-testid="styled-component" {...props}>{children}</div>
    );
    fn.withConfig = () => fn;
    fn.attrs = () => fn;
    return fn;
  };

  const styledFn = (Component: any) => mockFactory();

  const styled = new Proxy(styledFn, {
    get: (target, prop) => {
      if (prop === '__esModule') return false;
      const tag = String(prop);
      // Return a function that renders the specific tag
      const fn = (strings: any, ...args: any[]) => ({ children, ...props }: any) => {
        // If it's a known HTML tag, accept it, otherwise default to div
        // But for Proxy we can just try to render it as tag if it's string
        const Tag = (['div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'a', 'button', 'header', 'footer', 'nav', 'main', 'section', 'article', 'aside', 'ul', 'ol', 'li', 'form', 'input', 'textarea', 'label', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img'].includes(tag)) ? tag : 'div';
        return React.createElement(Tag, { 'data-testid': `styled-${tag}`, ...props }, children);
      };
      fn.withConfig = () => fn;
      fn.attrs = () => fn;
      return fn;
    }
  });

  return {
    __esModule: true,
    default: styled,
    ThemeProvider: ({ children }: any) => <div>{children}</div>,
    createGlobalStyle: () => () => null,
    css: () => '',
    keyframes: () => '',
    useTheme: () => ({ colors: { surface: {} }, borderRadius: {} }),
  };
});

// Mock child components to avoid rendering issues and isolate App testing
jest.mock('../components/common/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="error-boundary">{children}</div>,
}));

jest.mock('../components/Starfield/Starfield', () => ({
  __esModule: true,
  default: () => <div data-testid="starfield" />,
}));

jest.mock('../components/Footer', () => ({
  __esModule: true,
  default: () => <div data-testid="footer" />,
}));

// Mock modules that require browser APIs or external services
jest.mock('../utils/locationOverride', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('../services/enhancedLocationService', () => ({
  enhancedLocationService: {
    getCurrentLocation: jest.fn(),
    watchLocation: jest.fn(),
  },
}));

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    // Just check that the component renders
    expect(document.body).toBeInTheDocument();
  });

  it('renders Alert Aid branding', () => {
    render(<App />);
    // Check for brand name in the document
    const brandElements = screen.queryAllByText(/Alert Aid/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it('includes navigation elements', () => {
    render(<App />);
    // Navigation should be present
    const navigation = document.querySelector('nav');
    expect(navigation).toBeInTheDocument();
  });

  it('includes router for page navigation', () => {
    render(<App />);
    // Main content area should be present
    const mainContent = document.querySelector('#main-content');
    expect(mainContent).toBeInTheDocument();
  });
});
