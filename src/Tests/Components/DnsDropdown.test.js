import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DnsDropdown from '../../Components/Dropdown/DnsDropdown';

describe('DnsDropdown', () => {
  const mockProps = {
    id: 'dns-select',
    value: 'dns1',
    onChange: jest.fn(),
    itemsList: ['dns1', 'dns2', 'dns3'],
  };

  const openMenu = () => fireEvent.click(screen.getByRole('button', { name: 'dns1' }));

  beforeEach(() => mockProps.onChange.mockClear());

  test('shows the selected item on the trigger', () => {
    render(<DnsDropdown {...mockProps} />);
    expect(screen.getByRole('button', { name: 'dns1' })).toBeInTheDocument();
    expect(screen.queryByText('dns2')).not.toBeInTheDocument();
  });

  test('renders all items once opened', () => {
    render(<DnsDropdown {...mockProps} />);
    openMenu();
    expect(screen.getByText('dns2')).toBeInTheDocument();
    expect(screen.getByText('dns3')).toBeInTheDocument();
  });

  test('calls onChange with the picked item and closes', () => {
    render(<DnsDropdown {...mockProps} />);
    openMenu();
    fireEvent.click(screen.getByText('dns2'));
    expect(mockProps.onChange).toHaveBeenCalledWith({ target: { value: 'dns2' } });
    expect(screen.queryByText('dns3')).not.toBeInTheDocument();
  });

  test('does not open when disabled', () => {
    render(<DnsDropdown {...mockProps} disabled />);
    openMenu();
    expect(screen.queryByText('dns2')).not.toBeInTheDocument();
  });
});
