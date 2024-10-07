import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from '../../Components/LoadingSpinner/LoadingSpinner';
import GlobalContext from '../../Context/GlobalContext';

// Mock the colors module
jest.mock('../../Context/Colors', () => ({
  spinload: {
    light: '#f5f5f5',
    dark: '#333333'
  },
  title: {
    light: '#000000',
    dark: '#ffffff'
  }
}));

describe('LoadingSpinner', () => {
  const renderComponent = (contextValue = { mode: 'light' }, props = {}) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <LoadingSpinner {...props} />
      </GlobalContext.Provider>
    );
  };

  test('renders spinner', () => {
    renderComponent();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('disables background color when prop is set', () => {
    renderComponent({ mode: 'light' }, { disableBackgroundColor: true });
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByRole('status').parentElement).not.toHaveStyle('background-color: #f5f5f5');
  });

  test('applies custom container height', () => {
    renderComponent({ mode: 'light' }, { containerHeight: '100vh' });
    // eslint-disable-next-line testing-library/no-node-access
    expect(screen.getByRole('status').parentElement).toHaveStyle('height: 100vh');
  });

  test('applies custom spinner dimensions and border width', () => {
    renderComponent({ mode: 'light' }, { spinnerHeight: '100px', spinnerWidth: '100px', borderWidth: '10px' });
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveStyle('height: 100px');
    expect(spinner).toHaveStyle('width: 100px');
    expect(spinner).toHaveStyle('border-width: 10px');
  });
});