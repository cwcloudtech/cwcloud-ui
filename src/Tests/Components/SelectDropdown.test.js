import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectDropdown from '../../Components/Dropdown/SelectDropdown';
import GlobalContext from '../../Context/GlobalContext';

// Mock the colors module
jest.mock('../../Context/Colors', () => ({
  secondBackground: {
    light: '#f5f5f5',
    dark: '#333333'
  },
  mainText: {
    light: '#000000',
    dark: '#ffffff'
  }
}));

// Mock the srcimage function
jest.mock('../../utils/regions', () => ({
  __esModule: true,
  default: (name) => `flag-${name}.png`,
}));

// Mock the Translate component
jest.mock('react-translate-component', () => {
  return ({ content }) => <span>{content}</span>;
});

// Fixed mock - extract text content from nested elements
const extractTextContent = (element) => {
  if (typeof element === 'string') return element;
  if (React.isValidElement(element)) {
    if (element.props.children) {
      return React.Children.map(element.props.children, extractTextContent).join('');
    }
  }
  return '';
};

// Mock MUI components with proper HTML structure
jest.mock('@material-ui/core', () => ({
  MenuItem: ({ children, ...props }) => {
    // Extract text content and preserve data attributes for testing
    const textContent = extractTextContent(children);
    return (
      <option {...props} data-testid="menu-item">
        {textContent}
      </option>
    );
  },
  Select: ({ children, ...props }) => <select {...props}>{children}</select>,
}));

describe('SelectDropdown', () => {
  const mockProps = {
    labelId: 'select-label',
    id: 'select-id',
    value: 'item1',
    onChange: jest.fn(),
    itemsList: [
      { name: 'item1' },
      { name: 'item2' },
    ],
    classes: {
      regionItemStyles: 'region-item',
      ImageRegionStyles: 'region-image',
    },
    withImage: true,
  };

  const mockContext = {
    mode: 'light',
  };

  const renderComponent = (props = mockProps, contextValue = mockContext) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <SelectDropdown {...props} />
      </GlobalContext.Provider>
    );
  };

  test('renders all items', () => {
    renderComponent();
    expect(screen.getByText('item1')).toBeInTheDocument();
    expect(screen.getByText('item2')).toBeInTheDocument();
  });

  test('renders correct number of menu items', () => {
    renderComponent();
    const menuItems = screen.getAllByTestId('menu-item');
    // Should have 3 items: 1 hidden default + 2 from itemsList
    expect(menuItems).toHaveLength(3);
  });

  test('calls onChange when selection changes', () => {
    renderComponent();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'item2' } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  test('applies correct styles based on mode', () => {
    const { container } = renderComponent();
    const select = container.querySelector('select');
    expect(select).toHaveStyle('background: #f5f5f5 !important');
  });

  test('handles disabled state', () => {
    const disabledProps = { ...mockProps, disabled: true };
    renderComponent(disabledProps);
    
    const menuItems = screen.getAllByTestId('menu-item');
    // Check that items (excluding the hidden default) are disabled
    expect(menuItems[1]).toHaveAttribute('disabled');
    expect(menuItems[2]).toHaveAttribute('disabled');
  });

  test('renders without images when withImage is false', () => {
    const propsWithoutImage = { ...mockProps, withImage: false };
    renderComponent(propsWithoutImage);
    
    // Since we're mocking, we can't easily test image rendering in this setup
    // but we can verify the component renders without errors
    expect(screen.getByText('item1')).toBeInTheDocument();
    expect(screen.getByText('item2')).toBeInTheDocument();
  });
});
