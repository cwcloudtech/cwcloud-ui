/* eslint-disable testing-library/no-node-access */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SimpleDropdown from '../../Components/Dropdown/SimpleDropdown';

// Mock MUI components
jest.mock('@mui/material', () => ({
  MenuItem: ({ children, ...props }) => <option {...props}>{children}</option>,
  Select: ({ children, ...props }) => <select {...props}>{children}</select>,
}));

// Mock the Translate component - return string instead of JSX
jest.mock('react-translate-component', () => {
  return ({ content }) => content;
});

describe('SimpleDropdown', () => {
  const mockProps = {
    selectedItem: 'item1',
    onChange: jest.fn(),
    placeholder: 'Select an item',
    items: ['item1', 'item2', 'item3'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders placeholder', () => {
    render(<SimpleDropdown {...mockProps} />);
    expect(screen.getByText('Select an item')).toBeInTheDocument();
  });

  test('renders all items', () => {
    render(<SimpleDropdown {...mockProps} />);
    expect(screen.getByText('item1')).toBeInTheDocument();
    expect(screen.getByText('item2')).toBeInTheDocument();
    expect(screen.getByText('item3')).toBeInTheDocument();
  });

  test('selects the correct item', () => {
    render(<SimpleDropdown {...mockProps} />);
    expect(screen.getByRole('combobox')).toHaveValue('item1');
  });

  test('handles no selected item', () => {
    const propsWithNoSelection = { ...mockProps, selectedItem: null };
    render(<SimpleDropdown {...propsWithNoSelection} />);
    expect(screen.getByRole('combobox')).toHaveValue('none');
  });

  test('calls onChange when selection changes', () => {
    render(<SimpleDropdown {...mockProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'item2' } });
    expect(mockProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('applies correct styles', () => {
    const { container } = render(<SimpleDropdown {...mockProps} />);
    const select = container.querySelector('select');
    
    expect(select).toHaveStyle({
      'padding-left': '10px',
      'margin': '10px',
      'min-width': '100px'
    });
  });

  test('placeholder option is disabled', () => {
    const { container } = render(<SimpleDropdown {...mockProps} />);
    const placeholderOption = container.querySelector('option[value="none"]');
    expect(placeholderOption).toBeDisabled();
  });
});
