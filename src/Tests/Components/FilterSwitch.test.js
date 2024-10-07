import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterSwitch from '../../Components/FilterSwitch';
import GlobalContext from '../../Context/GlobalContext';

// Mock the Translate component
jest.mock('react-translate-component', () => {
  return function DummyTranslate({ content }) {
    return <span>{content}</span>;
  };
});

// Mock the colors module
jest.mock('../../Context/Colors.js', () => ({
  secondBackground: {
    light: '#f5f5f5',
    dark: '#333333'
  },
  border: {
    light: '#e0e0e0',
    dark: '#444444'
  },
  mainText: {
    light: '#000000',
    dark: '#ffffff'
  }
}));

describe('FilterSwitch', () => {
  const mockFilters = [
    { value: 'all', translationPath: 'filters.all' },
    { value: 'active', translationPath: 'filters.active' },
    { value: 'completed', translationPath: 'filters.completed' }
  ];

  const mockSetSelectedValue = jest.fn();

  const renderComponent = (props = {}, contextValue = { mode: 'light' }) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <FilterSwitch
          filters={mockFilters}
          selectedValue="all"
          setSelectedValue={mockSetSelectedValue}
          {...props}
        />
      </GlobalContext.Provider>
    );
  };

  test('renders all filter options', () => {
    renderComponent();
    mockFilters.forEach(filter => {
      expect(screen.getByText(filter.translationPath)).toBeInTheDocument();
    });
  });

  test('applies active class to selected filter', () => {
    renderComponent({ selectedValue: 'active' });
    // eslint-disable-next-line testing-library/no-node-access
    const activeFilter = screen.getByText('filters.active').closest('div');
    expect(activeFilter).toHaveClass('activeToggleItemContainer');
  });

  test('calls setSelectedValue when a filter is clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('filters.completed'));
    expect(mockSetSelectedValue).toHaveBeenCalledWith('completed');
  });

  test('applies correct styles based on light mode', () => {
    renderComponent({}, { mode: 'light' });
    // eslint-disable-next-line testing-library/no-node-access
    const container = screen.getByText('filters.all').closest('.toggleContainer');
    expect(container).toHaveStyle({
      backgroundColor: '#f5f5f5',
      border: '1px solid #e0e0e0',
      color: '#000000'
    });
  });

  test('applies correct styles based on dark mode', () => {
    renderComponent({}, { mode: 'dark' });
    // eslint-disable-next-line testing-library/no-node-access
    const container = screen.getByText('filters.all').closest('.toggleContainer');
    expect(container).toHaveStyle({
      backgroundColor: '#333333',
      border: '1px solid #444444',
      color: '#ffffff'
    });
  });
});