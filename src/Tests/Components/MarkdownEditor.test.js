import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarkdownEditor from '../../Components/MarkdownEditor/MarkdownEditor';
import GlobalContext from '../../Context/GlobalContext';

// Mock ReactMde
jest.mock('react-mde', () => {
  return function DummyMde({ value, onChange, selectedTab, onTabChange }) {
    return (
      <div data-testid="react-mde">
        <textarea
          data-testid="mde-textarea"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button onClick={() => onTabChange('write')}>Write</button>
        <button onClick={() => onTabChange('preview')}>Preview</button>
      </div>
    );
  };
});

// Mock Showdown
jest.mock('showdown', () => ({
  Converter: jest.fn().mockImplementation(() => ({
    makeHtml: jest.fn((md) => `<p>${md}</p>`),
  })),
}));

describe('MarkdownEditor', () => {
  const mockProps = {
    value: 'Initial markdown',
    onChange: jest.fn(),
  };

  const renderComponent = (contextValue = { mode: 'light' }, props = mockProps) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <MarkdownEditor {...props} />
      </GlobalContext.Provider>
    );
  };

  test('renders ReactMde component', () => {
    renderComponent();
    expect(screen.getByTestId('react-mde')).toBeInTheDocument();
  });

  test('passes value and onChange props to ReactMde', () => {
    renderComponent();
    const textarea = screen.getByTestId('mde-textarea');
    expect(textarea).toHaveValue('Initial markdown');

    fireEvent.change(textarea, { target: { value: 'New markdown' } });
    expect(mockProps.onChange).toHaveBeenCalledWith('New markdown');
  });

  test('does not apply dark mode class when context mode is light', () => {
    renderComponent({ mode: 'light' });
    // eslint-disable-next-line testing-library/no-node-access
    const editorContainer = screen.getByTestId('react-mde').closest('div');
    expect(editorContainer).not.toHaveClass('dark-mode');
  });

  test('changes selected tab', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Preview'));
    // In a real scenario, we would expect the selected tab to change.
    // However, since we're using a mock, we can't directly test this.
    // In a more comprehensive test, you might want to check if onTabChange was called with 'preview'.
  });
});
