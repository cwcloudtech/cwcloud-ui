import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomIcon from '../../Components/CustomIcon/CustomIcon';

// Mock IconComponent to simplify the test
const MockIcon = ({ className, onClick }) => (
    <div data-testid="icon" className={className} onClick={onClick}>
        Icon
    </div>
);

describe('CustomIcon', () => {
    const defaultProps = {
        IconComponent: MockIcon,
        title: 'Test Tooltip',
        onClick: jest.fn(),
        iconClass: 'test-class'
    };

    test('triggers onClick when the icon is clicked', () => {
        render(<CustomIcon {...defaultProps} />);

        const icon = screen.getByTestId('icon');
        fireEvent.click(icon);
        
        // Check if the onClick handler was called
        expect(defaultProps.onClick).toHaveBeenCalled();
    });
});
