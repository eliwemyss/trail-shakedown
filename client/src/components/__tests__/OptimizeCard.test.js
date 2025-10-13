import { render, screen } from '@testing-library/react';
import OptimizeCard from '../OptimizeCard';

test('renders optimize card with consider label and content', () => {
  const rec = {
    category: 'Backpack',
    currentItem: 'REI Flash 55',
    weight_oz: 38,
    suggestion: 'Consider Zpacks Arc Blast to save 19oz.'
  };
  render(<OptimizeCard rec={rec} />);
  expect(screen.getByText(/OPTIMIZE/)).toBeInTheDocument();
  expect(screen.getByText(/Consider/)).toBeInTheDocument();
  expect(screen.getByText(/Backpack/i)).toBeInTheDocument();
});
