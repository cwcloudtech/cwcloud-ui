import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageDropdown from '../../Components/Dropdown/LanguageDropdown';
import GlobalContext from '../../Context/GlobalContext';

// Mock the colors module
jest.mock('../../Context/Colors', () => ({
  menuText: {
    light: '#000000',
    dark: '#ffffff'
  }
}));

// Mock the srcimage function
jest.mock('../../utils/regions', () => ({
  __esModule: true,
  default: (lang) => `flag-${lang}.png`,
}));

// Mock the DropdownItem component
jest.mock('reactstrap', () => ({
  DropdownItem: ({ children, ...props }) => <div {...props}>{children}</div>,
}));

describe('LanguageDropdown', () => {
  const mockProps = {
    languageShortName: 'en',
    languageNames: ['English', 'Anglais'],
    classes: { dropdownItemText: 'dropdown-text' },
  };

  const mockContext = {
    mode: 'light',
    language: 'en',
    setLanguage: jest.fn(),
  };

  const renderComponent = (props = mockProps, contextValue = mockContext) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <LanguageDropdown {...props} />
      </GlobalContext.Provider>
    );
  };

  test('renders correct language name based on context language', () => {
    renderComponent();
    expect(screen.getByText('English')).toBeInTheDocument();

    renderComponent(mockProps, { ...mockContext, language: 'fr' });
    expect(screen.getByText('Anglais')).toBeInTheDocument();
  });

  test('renders correct flag image', () => {
    renderComponent();
    const img = screen.getByAltText('en');
    expect(img).toHaveAttribute('src', 'flag-en.png');
    expect(img).toHaveAttribute('height', '15px');
  });

  test('calls setLanguage when clicked', () => {
    renderComponent();
    fireEvent.click(screen.getByText('English'));
    expect(mockContext.setLanguage).toHaveBeenCalledWith('en');
  });
});
