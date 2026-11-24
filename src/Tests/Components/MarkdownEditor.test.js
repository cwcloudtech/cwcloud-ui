import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarkdownEditor from '../../Components/MarkdownEditor/MarkdownEditor';
import GlobalContext from '../../Context/GlobalContext';

jest.mock('../../Components/Markdown/Markdown', () => ({ children }) => (
  <div data-testid="markdown-preview-content">{children}</div>
));

describe('MarkdownEditor', () => {
  const mockProps = {
    value: 'Initial markdown',
    onChange: jest.fn(),
  };

  beforeEach(() => {
    mockProps.onChange.mockClear();
  });

  const renderComponent = (contextValue = { mode: 'light' }, props = mockProps) => {
    return render(
      <GlobalContext.Provider value={contextValue}>
        <MarkdownEditor {...props} />
      </GlobalContext.Provider>
    );
  };

  test('renders the editor', () => {
    renderComponent();
    expect(screen.getByTestId('markdown-editor')).toBeInTheDocument();
  });

  test('passes value and onChange props to the textarea', () => {
    renderComponent();
    const textarea = screen.getByTestId('markdown-editor-textarea');
    expect(textarea).toHaveValue('Initial markdown');

    fireEvent.change(textarea, { target: { value: 'New markdown' } });
    expect(mockProps.onChange).toHaveBeenCalledWith('New markdown');
  });

  test('does not apply dark mode class when context mode is light', () => {
    renderComponent({ mode: 'light' });
    expect(screen.getByTestId('markdown-editor')).not.toHaveClass('dark-mode');
  });

  test('applies dark mode class when context mode is dark', () => {
    renderComponent({ mode: 'dark' });
    expect(screen.getByTestId('markdown-editor')).toHaveClass('dark-mode');
  });

  test('switches to the preview tab', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Preview'));
    expect(screen.getByTestId('markdown-preview-content')).toHaveTextContent('Initial markdown');
    expect(screen.queryByTestId('markdown-editor-textarea')).not.toBeInTheDocument();
  });

  test('toolbar wraps the selection with markdown syntax', () => {
    renderComponent();
    const textarea = screen.getByTestId('markdown-editor-textarea');
    textarea.setSelectionRange(0, 7);
    fireEvent.click(screen.getByLabelText('Bold'));
    expect(mockProps.onChange).toHaveBeenCalledWith('**Initial** markdown');
  });
});
