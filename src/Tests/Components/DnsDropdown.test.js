import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DnsDropdown from '../../Components/Dropdown/DnsDropdown';
import GlobalContext from '../../Context/GlobalContext';

// Mock MUI components
jest.mock('@material-ui/core', () => ({
  MenuItem: ({ children, ...props }) => <option {...props}>{children}</option>,
  Select: ({ children, ...props }) => <select {...props}>{children}</select>,
}));

jest.mock('@material-ui/core/InputBase', () => ({
  __esModule: true,
  default: ({ children, ...props }) => <input {...props}>{children}</input>,
}));

// Mock the colors module
jest.mock('../../Context/Colors', () => ({
  secondBackground: {
    light: '#f5f5f5',
    dark: '#333333'
  }
}));

describe('DnsDropdown', () => {
  const mockProps = {
    labelId: 'dns-label',
    id: 'dns-select',
    value: 'dns1',
    onChange: jest.fn(),
    itemsList: ['dns1', 'dns2', 'dns3'],
  };

  const renderComponent = (props = {}, contextValue = { mode: 'light' }) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <DnsDropdown {...mockProps} {...props} />
      </GlobalContext.Provider>
    );
  };

  test('renders all items', () => {
    renderComponent();
    expect(screen.getByText('dns1')).toBeInTheDocument();
    expect(screen.getByText('dns2')).toBeInTheDocument();
    expect(screen.getByText('dns3')).toBeInTheDocument();
  });

  test('selects the correct item', () => {
    renderComponent();
    expect(screen.getByRole('combobox')).toHaveValue('dns1');
  });

  test('calls onChange when selection changes', () => {
    renderComponent();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'dns2' } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  test('applies correct background color based on mode', () => {
    const { container } = renderComponent({}, { mode: 'dark' });
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyle('background: #333333 !important');
  });
});
