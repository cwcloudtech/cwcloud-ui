import React from 'react';
import { render, screen } from '@testing-library/react';
import CollapsibleContent from '../../Components/CollapsibleContent/CollapsibleContent';

describe('CollapsibleContent', () => {
  it('renders without crashing when expanded', () => {
    render(
      <CollapsibleContent expanded={true}>
        <div>Test Content</div>
      </CollapsibleContent>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
});
