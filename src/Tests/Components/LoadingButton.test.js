import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingButton from '../../Components/LoadingButton/LoadingButton';

describe('LoadingButton Component', () => {
  test('renders with default props', () => {
    render(<LoadingButton>Click Me</LoadingButton>);
    const buttonElement = screen.getByText(/click me/i);
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).not.toBeDisabled();
  });

  test('shows spinner when loading prop is true', () => {
    render(<LoadingButton loading={true}>Click Me</LoadingButton>);
    const spinnerElement = screen.getByRole('status'); // Spinner has role 'status'
    expect(spinnerElement).toBeInTheDocument();
  });

  test('calls onClick handler when not loading and clicked', () => {
    const handleClick = jest.fn();
    render(<LoadingButton onClick={handleClick}>Click Me</LoadingButton>);
    const buttonElement = screen.getByText(/click me/i);
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
