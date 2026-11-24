import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectDropdown from '../../Components/Dropdown/SelectDropdown';

jest.mock('../../utils/regions', () => ({
  __esModule: true,
  default: (name) => `flag-${name}.png`,
}));

jest.mock('../../Components/Translate/Translate', () => {
  return ({ content }) => <span>{content}</span>;
});

describe('SelectDropdown', () => {
  const mockProps = {
    id: 'select-id',
    value: 'item1',
    onChange: jest.fn(),
    itemsList: [{ name: 'item1' }, { name: 'item2' }],
    withImage: true,
  };

  const openMenu = () => fireEvent.click(screen.getByRole('button'));

  beforeEach(() => mockProps.onChange.mockClear());

  test('shows the selected item on the trigger', () => {
    render(<SelectDropdown {...mockProps} />);
    expect(screen.getByRole('button')).toHaveTextContent('item1');
  });

  test('falls back to the provider label without a selection', () => {
    render(<SelectDropdown {...mockProps} value="global" />);
    expect(screen.getByRole('button')).toHaveTextContent('navbar.provider');
  });

  test('renders one entry per item once opened', () => {
    render(<SelectDropdown {...mockProps} />);
    openMenu();
    expect(screen.getAllByRole('button')).toHaveLength(3);
    expect(screen.getByText('item2')).toBeInTheDocument();
  });

  test('calls onChange with the picked item', () => {
    render(<SelectDropdown {...mockProps} />);
    openMenu();
    fireEvent.click(screen.getByText('item2'));
    expect(mockProps.onChange).toHaveBeenCalledWith({ target: { value: 'item2' } });
  });

  test('renders flags when withImage is set', () => {
    const { container } = render(<SelectDropdown {...mockProps} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('img')).toHaveAttribute('src', 'flag-item1.png');
  });

  test('renders without images when withImage is false', () => {
    const { container } = render(<SelectDropdown {...mockProps} withImage={false} />);
    // eslint-disable-next-line testing-library/no-container, testing-library/no-node-access
    expect(container.querySelector('img')).toBeNull();
  });

  test('does not open when disabled', () => {
    render(<SelectDropdown {...mockProps} disabled />);
    openMenu();
    expect(screen.queryByText('item2')).not.toBeInTheDocument();
  });
});
