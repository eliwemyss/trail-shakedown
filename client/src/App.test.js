import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Trail Shakedown header', () => {
  render(<App />);
  const header = screen.getByText(/Trail Shakedown/i);
  expect(header).toBeInTheDocument();
});
