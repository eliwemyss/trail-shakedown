import { render, screen } from '@testing-library/react';
import WeightSummaryCards from '../WeightSummaryCards';

test('renders weight summary values', () => {
  const data = {
    currentWeight: { oz: 128 },
    potentialWeight: { oz: 92 },
    potentialSavings: { oz: 36, lbs: 2.25 }
  };
  render(<WeightSummaryCards data={data} />);
  expect(screen.getByText(/128/i)).toBeInTheDocument();
  expect(screen.getByText(/92/i)).toBeInTheDocument();
  expect(screen.getByText(/-36oz/i)).toBeInTheDocument();
});
