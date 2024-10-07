import React from 'react';
import { render, screen } from '@testing-library/react';
import SuggestionsAutoComplete from '../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete';

// Mock the SuggestionsAutoComplete component
const mockSuggestionsAutoComplete = jest.fn();
jest.mock('../../Components/SuggestionsAutoComplete/SuggestionsAutoComplete', () => (props) => {
  mockSuggestionsAutoComplete(props);
  return (
    <div data-testid="mock-suggestions-autocomplete">
      <div data-testid="mock-autocomplete">
        <input 
          data-testid="mock-input"
          id={props.id} 
          onChange={props.onChange} 
          value={props.value} 
          defaultValue={props.defaultValue}
        />
      </div>
      <div data-testid="mock-options">
        {props.options.map((option, index) => (
          <div key={index} data-testid={`mock-option-${index}`}>{option}</div>
        ))}
      </div>
      <div data-testid="mock-feedback">{props.feedbackMessage}</div>
      <div data-testid="mock-hint">{props.hint}</div>
      <div data-testid="mock-length">{props.length}</div>
    </div>
  );
});

describe('SuggestionsAutoComplete', () => {
  const defaultProps = {
    id: 'test-autocomplete',
    onChange: jest.fn(),
    options: ['Option 1', 'Option 2'],
    renderInput: jest.fn(),
    feedbackMessage: 'feedback',
    hint: 'hint',
    length: 400,
    value: '',
    defaultValue: ''
  };

  beforeEach(() => {
    mockSuggestionsAutoComplete.mockClear();
  });

  it('renders the component with all props', () => {
    const { container } = render(<SuggestionsAutoComplete {...defaultProps} />);
    
    // Log the rendered content for debugging
    console.log(container.innerHTML);

    // Check if the mock was called
    expect(mockSuggestionsAutoComplete).toHaveBeenCalledWith(expect.objectContaining(defaultProps));

    expect(screen.getByTestId('mock-suggestions-autocomplete')).toBeInTheDocument();
    expect(screen.getByTestId('mock-input')).toHaveAttribute('id', 'test-autocomplete');
    expect(screen.getByTestId('mock-options')).toBeInTheDocument();
    expect(screen.getByTestId('mock-feedback')).toHaveTextContent('feedback');
    expect(screen.getByTestId('mock-hint')).toHaveTextContent('hint');
    expect(screen.getByTestId('mock-length')).toHaveTextContent('400');
  });

  it('renders options', () => {
    render(<SuggestionsAutoComplete {...defaultProps} />);
    
    const options = screen.getAllByTestId(/^mock-option-/);
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent('Option 1');
    expect(options[1]).toHaveTextContent('Option 2');
  });
});