import { render, fireEvent } from '@testing-library/react-native';
import NumberPad from '../../src/components/NumberPad';

describe('NumberPad', () => {
    const defaultProps = {
        selectedCell: { row: 0, col: 0 },
        onNumberInput: jest.fn(),
        boardSize: 300,
        darkMode: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render numbers 1-9 and Clear button', () => {
        const { getByText } = render(<NumberPad {...defaultProps} />);

        [1, 2, 3, 4, 5, 6, 7, 8, 9].forEach(num => {
            expect(getByText(num.toString())).toBeTruthy();
        });
        expect(getByText('Clear')).toBeTruthy();
    });

    it('should call onNumberInput with correct number when pressed', () => {
        const { getByText } = render(<NumberPad {...defaultProps} />);

        fireEvent.press(getByText('1'));
        expect(defaultProps.onNumberInput).toHaveBeenCalledWith(1);

        fireEvent.press(getByText('9'));
        expect(defaultProps.onNumberInput).toHaveBeenCalledWith(9);
    });

    it('should call onNumberInput with 0 when Clear is pressed', () => {
        const { getByText } = render(<NumberPad {...defaultProps} />);

        fireEvent.press(getByText('Clear'));
        expect(defaultProps.onNumberInput).toHaveBeenCalledWith(0);
    });

    it('should not call onNumberInput when disabled (no cell selected)', () => {
        const { getByText } = render(
            <NumberPad
                {...defaultProps}
                selectedCell={null}
            />
        );

        fireEvent.press(getByText('5'));
        expect(defaultProps.onNumberInput).not.toHaveBeenCalled();

        fireEvent.press(getByText('Clear'));
        expect(defaultProps.onNumberInput).not.toHaveBeenCalled();
    });

    it('should render correctly in dark mode', () => {
        const { getByText } = render(<NumberPad {...defaultProps} darkMode={true} />);
        expect(getByText('1')).toBeTruthy();
    });
});
