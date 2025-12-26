import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../../src/components/ThemeToggle.tsx';

describe('ThemeToggle', () => {
    it('should render with light mode icon when darkMode is false', () => {
        const mockOnToggle = vi.fn();
        render(<ThemeToggle darkMode={false} onToggle={mockOnToggle} />);

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('🌙');
    });

    it('should render with dark mode icon when darkMode is true', () => {
        const mockOnToggle = vi.fn();
        render(<ThemeToggle darkMode={true} onToggle={mockOnToggle} />);

        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('☀️');
    });

    it('should call onToggle when clicked', () => {
        const mockOnToggle = vi.fn();
        render(<ThemeToggle darkMode={false} onToggle={mockOnToggle} />);

        const button = screen.getByRole('button');
        fireEvent.click(button);

        expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });

    it('should have correct title for light mode', () => {
        const mockOnToggle = vi.fn();
        render(<ThemeToggle darkMode={false} onToggle={mockOnToggle} />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('title', 'Switch to Dark Mode');
    });

    it('should have correct title for dark mode', () => {
        const mockOnToggle = vi.fn();
        render(<ThemeToggle darkMode={true} onToggle={mockOnToggle} />);

        const button = screen.getByRole('button');
        expect(button).toHaveAttribute('title', 'Switch to Light Mode');
    });
});
