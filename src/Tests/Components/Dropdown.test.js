import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropdownComponent from '../../Components/Dropdown/Dropdown';

// Mock MUI components
jest.mock('@mui/material', () => ({
  FormControl: ({ children, ...props }) => <div {...props}>{children}</div>,
  InputLabel: ({ children, ...props }) => <label {...props}>{children}</label>,
  MenuItem: ({ children, ...props }) => <option {...props}>{children}</option>,
  Select: ({ children, ...props }) => <select {...props}>{children}</select>,
}));

describe('DropdownComponent', () => {
  const mockProps = {
    inputLabelId: 'input-label',
    name: 'Test Dropdown',
    selectLabelId: 'select-label',
    selectId: 'select-id',
    selectedItem: 'item1',
    onChange: jest.fn(),
    items: [
      { id: 'item1', name: 'Item 1' },
      { id: 'item2', name: 'Item 2' },
    ],
  };

  test('renders with correct label', () => {
    render(<DropdownComponent {...mockProps} />);
    expect(screen.getByText('Test Dropdown')).toBeInTheDocument();
  });

  test('renders all items', () => {
    render(<DropdownComponent {...mockProps} />);
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  test('selects the correct item', () => {
    render(<DropdownComponent {...mockProps} />);
    expect(screen.getByRole('combobox')).toHaveValue('item1');
  });

  test('calls onChange when selection changes', () => {
    render(<DropdownComponent {...mockProps} />);
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'item2' } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });
});
