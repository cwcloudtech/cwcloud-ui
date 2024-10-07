import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import ServiceNotAvailable from '../../Components/ServiceNotAvailable/ServiceNotAvailable';
import GlobalContext from '../../Context/GlobalContext';

// Mock the react-translate-component
jest.mock('react-translate-component', () => ({ content }) => <span>{content}</span>);

// Mock the colors module
jest.mock('../../Context/Colors', () => ({
  blue: {
    light: '#007bff',
    dark: '#0056b3'
  },
  mainText: {
    light: '#000000',
    dark: '#ffffff'
  }
}));

const mockContextValue = {
  mode: 'light'
};

const mockProps = {
  region: 'Test Region',
  backLink: '/back'
};

describe('ServiceNotAvailable', () => {
  const renderComponent = (contextValue = mockContextValue, props = mockProps) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <BrowserRouter>
          <ServiceNotAvailable {...props} />
        </BrowserRouter>
      </GlobalContext.Provider>
    );
  };

  test('renders correctly with region and return button', () => {
    renderComponent();
    
    expect(screen.getByText('common.service.serviceNotAvailable')).toBeInTheDocument();
    expect(screen.getByText('Test Region')).toBeInTheDocument();
    expect(screen.getByText('common.button.return')).toBeInTheDocument();
  });
});
