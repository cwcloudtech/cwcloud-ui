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

// Mock MUI components
jest.mock('@material-ui/core', () => ({
  MenuItem: ({ children, ...props }) => <option {...props}>{children}</option>,
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

  test('renders images when withImage is true', () => {
    renderComponent();
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(2);
    expect(images[0]).toHaveAttribute('src', 'flag-item1.png');
    expect(images[1]).toHaveAttribute('src', 'flag-item2.png');
  });

  test('does not render images when withImage is false', () => {
    renderComponent({ ...mockProps, withImage: false });
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  test('calls onChange when selection changes', () => {
    renderComponent();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'item2' } });
    expect(mockProps.onChange).toHaveBeenCalled();
  });

  test('applies correct background color based on mode', () => {
    const { container } = renderComponent();
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyle('background: #f5f5f5 !important');

    renderComponent(mockProps, { mode: 'dark' });
    // eslint-disable-next-line testing-library/no-node-access
    expect(container.firstChild).toHaveStyle('background: #333333 !important');
  });
});
