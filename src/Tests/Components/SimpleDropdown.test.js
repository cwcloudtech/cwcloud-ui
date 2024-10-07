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

// Mock the Translate component
jest.mock('react-translate-component', () => {
  return ({ content }) => <span>{content}</span>;
});

describe('SimpleDropdown', () => {
  const mockProps = {
    selectedItem: 'item1',
    onChange: jest.fn(),
    placeholder: 'Select an item',
    items: ['item1', 'item2', 'item3'],
  };

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

  test('calls onChange when selection changes', () => {
    render(<SimpleDropdown {...mockProps} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'item2' } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  test('applies correct styles', () => {
    const { container } = render(<SimpleDropdown {...mockProps} />);

    expect(container.firstChild).toHaveStyle('padding-left: 10px');
    expect(container.firstChild).toHaveStyle('margin: 10px');
    expect(container.firstChild).toHaveStyle('min-width: 100px');
  });
});
