import { render, fireEvent } from '@testing-library/react-native';
import ThemeToggle from '../../src/components/ThemeToggle';

describe('ThemeToggle', () => {
    it('should render with light mode icon when darkMode is false', () => {
        const mockOnToggle = jest.fn();
        const { getByText } = render(<ThemeToggle darkMode={false} onToggle={mockOnToggle} />);

        expect(getByText('🌙')).toBeTruthy();
    });

    it('should render with dark mode icon when darkMode is true', () => {
        const mockOnToggle = jest.fn();
        const { getByText } = render(<ThemeToggle darkMode={true} onToggle={mockOnToggle} />);

        expect(getByText('☀️')).toBeTruthy();
    });

    it('should call onToggle when pressed', () => {
        const mockOnToggle = jest.fn();
        const { getByText } = render(<ThemeToggle darkMode={false} onToggle={mockOnToggle} />);

        const button = getByText('🌙');
        fireEvent.press(button);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
});
