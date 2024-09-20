import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InfoCard from '../../Components/Cards/InfoCard/InfoCard';
import GlobalContext from '../../Context/GlobalContext';

// Mock context value
const mockContextValue = {
  mode: 'light',
};

// Mock colors for light mode
const mockColors = {
  mainText: {
    light: '#000',
    dark: '#fff'
  }
};

// Mock translations for Translate component
jest.mock('react-translate-component', () => ({ content }) => <span>{content}</span>);

// Mock colors module
jest.mock('../../Context', () => mockColors);

describe('InfoCard', () => {
  const renderComponent = (props = {}, contextValue = mockContextValue) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <InfoCard {...props} />
      </GlobalContext.Provider>
    );
  };

  test('renders correctly with title, length, and unitInfo', () => {
    const mockProps = {
      title: 'info.card.title',
      length: 10,
      unitInfo: 'info.card.unit'
    };

    renderComponent(mockProps);

    expect(screen.getByText('info.card.title')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('info.card.unit')).toBeInTheDocument();
  });

  test('uses correct colors based on mode', () => {
    const mockProps = {
      title: 'info.card.title',
      length: 10,
      unitInfo: 'info.card.unit'
    };

    renderComponent(mockProps);

    const lengthText = screen.getByText('10');
    expect(lengthText).toHaveStyle(`color: ${mockColors.mainText.light}`);
  });

});
