import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CardComponent from '../../Components/Cards/CardComponent/CardComponent';
import GlobalContext from '../../Context/GlobalContext';

// Mocking the environment variable
process.env.REACT_APP_DOCURL = "https://example.com";

// Create a mock context
const mockContextValue = {
  mode: 'light',
};

// Mock component props
const mockProps = {
  title: 'Test Title',
  subtitle: 'Test Subtitle',
  subtitleTwo: 'Test Subtitle Two',
  link: 'Documentation Link',
  style: { margin: '20px' },
  containerStyles: 'custom-container',
  customMarginTop: '10px',
  children: <div>Child Content</div>
};

// Set up mock colors for testing
const mockColors = {
  secondBackground: {
    light: '#f5f5f5',
    dark: '#333'
  },
  border: {
    light: '#ccc',
    dark: '#444'
  },
  shadow: {
    light: '2px 2px 5px rgba(0,0,0,0.1)',
    dark: '2px 2px 5px rgba(0,0,0,0.5)'
  },
  mainText: {
    light: '#000',
    dark: '#fff'
  },
  secondText: {
    light: '#555',
    dark: '#aaa'
  },
  blue: '#007bff'
};

// Mocking the colors module
jest.mock('../../Context', () => mockColors);

describe('CardComponent', () => {
  const renderComponent = (contextValue = mockContextValue, props = mockProps) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <CardComponent {...props} />
      </GlobalContext.Provider>
    );
  };

  test('renders correctly with title and subtitle', () => {
    renderComponent();
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByText('Test Subtitle Two')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('renders children content correctly', () => {
    renderComponent();
    
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  test('renders correct link', () => {
    renderComponent();
    
    const link = screen.getByText('Documentation Link');
    const linkElement = screen.getByText('Documentation Link');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

});
