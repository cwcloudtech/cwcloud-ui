import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BaseModal from '../../Components/Modal/InputModals/BaseModal';
import GlobalContext from '../../Context/GlobalContext';

// Mock the required components and modules
jest.mock('react-translate-component', () => ({
  __esModule: true,
  default: ({ content }) => <span>{content}</span>
}));

const mockContext = {
  mode: 'light',
  counterpart: jest.fn((key) => key),
};

jest.mock('../../Context/Colors', () => ({
  title: {
    light: '#000',
    dark: '#fff',
  },
}));

jest.mock('@mui/material/TextField', () => ({
  __esModule: true,
  default: ({ label, onChange, value }) => (
    <input data-testid={label} onChange={onChange} value={value} />
  ),
}));

jest.mock('reactstrap', () => ({
  Modal: ({ children }) => <div data-testid="modal">{children}</div>,
  ModalHeader: ({ children }) => <div data-testid="modal-header">{children}</div>,
  ModalBody: ({ children }) => <div data-testid="modal-body">{children}</div>,
  ModalFooter: ({ children }) => <div data-testid="modal-footer">{children}</div>,
  Row: ({ children }) => <div data-testid="row">{children}</div>,
  Col: ({ children }) => <div data-testid="col">{children}</div>,
}));

jest.mock('../../Components/LoadingButton/LoadingButton', () => ({
  __esModule: true,
  default: ({ children, onClick, loading }) => (
    <button data-testid="loading-button" onClick={onClick} disabled={loading}>{children}</button>
  ),
}));

// Wrapper component to provide the mocked context
const TestWrapper = ({ children }) => (
  <GlobalContext.Provider value={mockContext}>
    {children}
  </GlobalContext.Provider>
);

describe('BaseModal', () => {
  const defaultProps = {
    isOpen: true,
    toggle: jest.fn(),
    title: 'Test Modal',
    onSave: jest.fn(),
    inputs: [
      { key: 'input1', label: 'Input 1' },
      { key: 'input2', label: 'Input 2' },
    ],
    loading: false,
    index: 0,
    variable: { input1: 'value1', input2: 'value2' },
  };

  const renderWithContext = (ui, options) =>
    render(ui, { wrapper: TestWrapper, ...options });

  it('calls toggle function when save button is clicked', () => {
    const toggleMock = jest.fn();
    renderWithContext(
      <BaseModal {...defaultProps} toggle={toggleMock} />
    );
    
    fireEvent.click(screen.getByText('common.button.save'));

    expect(toggleMock).toHaveBeenCalled();
  });

  it('renders LoadingButton with correct loading prop', () => {
    const { rerender } = renderWithContext(<BaseModal {...defaultProps} loading={false} />);
    expect(screen.getByTestId('loading-button')).not.toBeDisabled();

    rerender(<TestWrapper><BaseModal {...defaultProps} loading={true} /></TestWrapper>);
    expect(screen.getByTestId('loading-button')).toBeDisabled();
  });

  it('uses the correct mode from context', () => {
    renderWithContext(<BaseModal {...defaultProps} />);
    expect(screen.getByTestId('modal')).toBeInTheDocument();
  });
});
