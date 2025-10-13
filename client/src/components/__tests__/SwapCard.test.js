import { render, screen } from '@testing-library/react';
import SwapCard from '../SwapCard';

test('renders swap card with items and savings', () => {
  const rec = {
    savingsOz: 23,
    currentItem: { name: 'Big Agnes Copper Spur 2', weight_oz: 42, price: 450 },
    recommendedItem: { name: 'Zpacks Duplex', weight_oz: 19, price: 699 },
    why: 'Duplex saves a lot of weight.'
  };
  render(<SwapCard rec={rec} />);
  expect(screen.getByText(/SWAP/)).toBeInTheDocument();
  expect(screen.getByText(/-23oz savings/)).toBeInTheDocument();
  expect(screen.getByText(/Big Agnes Copper Spur 2/)).toBeInTheDocument();
  expect(screen.getByText(/Zpacks Duplex/)).toBeInTheDocument();
  expect(screen.getByText(/Why:/)).toBeInTheDocument();
});
