import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomIcon from '../../Components/CustomIcon/CustomIcon';

// Mock IconComponent with forwardRef and proper prop spreading
const MockIcon = React.forwardRef(({ className, onClick, ...props }, ref) => (
    <div data-testid="icon" className={className} onClick={onClick} ref={ref} {...props}>
        Icon
    </div>
));

MockIcon.displayName = 'MockIcon';

describe('CustomIcon', () => {
    const defaultProps = {
        IconComponent: MockIcon,
        title: 'Test Tooltip',
        onClick: jest.fn(),
        iconClass: 'test-class'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('triggers onClick when the icon is clicked', () => {
        render(<CustomIcon {...defaultProps} />);

        const icon = screen.getByTestId('icon');
        fireEvent.click(icon);
        
        expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    test('applies correct CSS classes', () => {
        render(<CustomIcon {...defaultProps} />);
        
        const icon = screen.getByTestId('icon');
        expect(icon).toHaveClass('test-class');
    });

    test('renders tooltip with correct title', async () => {
        render(<CustomIcon {...defaultProps} />);
        
        const icon = screen.getByTestId('icon');
        fireEvent.mouseOver(icon);
        
        // Use findByRole for tooltip since it's asynchronous
        const tooltip = await screen.findByRole('tooltip');
        expect(tooltip).toHaveTextContent('Test Tooltip');
    });
});
