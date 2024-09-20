import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AllowCookiesFooter from '../../Components/AllowCookiesFooter/AllowCookiesFooter';
import GlobalContext from '../../Context/GlobalContext';

jest.mock('react-translate-component', () => ({
  __esModule: true,
  default: ({ content }) => <span>{content}</span>
}));

const mockAllowCookies = jest.fn();
const MockGlobalContextProvider = ({ children }) => (
  <GlobalContext.Provider value={{ allowCookies: mockAllowCookies }}>
    {children}
  </GlobalContext.Provider>
);

describe('AllowCookiesFooter', () => {
  test('renders without crashing', () => {
    render(
      <MockGlobalContextProvider>
        <AllowCookiesFooter />
      </MockGlobalContextProvider>
    );
    expect(screen.getByText('cookies.why')).toBeInTheDocument();
    expect(screen.getByText('cookies.learnMore')).toBeInTheDocument();
    expect(screen.getByText('cookies.understand')).toBeInTheDocument();
  });

  test('calls allowCookies on button click', () => {
    render(
      <MockGlobalContextProvider>
        <AllowCookiesFooter />
      </MockGlobalContextProvider>
    );

    fireEvent.click(screen.getByText('cookies.understand'));
    expect(mockAllowCookies).toHaveBeenCalledTimes(1);
  });
});
