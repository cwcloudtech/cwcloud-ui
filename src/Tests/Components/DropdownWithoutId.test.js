import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropdownComponentWithoutId from '../../Components/Dropdown/DropdownWithoutItemId';

// Mock MUI components
jest.mock('@mui/material', () => ({
  FormControl: ({ children, ...props }) => <div {...props}>{children}</div>,
  InputLabel: ({ children, ...props }) => <label {...props}>{children}</label>,
  MenuItem: ({ children, ...props }) => <option {...props}>{children}</option>,
  Select: ({ children, ...props }) => <select {...props}>{children}</select>,
}));

describe('DropdownComponentWithoutId', () => {
  const mockProps = {
    inputLabelId: 'input-label',
    name: 'Test Dropdown',
    selectLabelId: 'select-label',
    selectId: 'select-id',
    selectedItem: 'item1',
    onChange: jest.fn(),
    items: ['item1', 'item2', 'item3'],
  };

  test('renders with correct label', () => {
    render(<DropdownComponentWithoutId {...mockProps} />);
    expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  });

  test('renders all items', () => {
    render(<DropdownComponentWithoutId {...mockProps} />);
    expect(screen.getByText('item1')).toBeInTheDocument();
    expect(screen.getByText('item2')).toBeInTheDocument();
    expect(screen.getByText('item3')).toBeInTheDocument();
  });

  test('selects the correct item', () => {
    render(<DropdownComponentWithoutId {...mockProps} />);
    expect(screen.getByRole('combobox')).toHaveValue('item1');
  });

  test('calls onChange when selection changes', () => {
    render(<DropdownComponentWithoutId {...mockProps} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'item2' } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });
});
