import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders App', async () => {
  render(<App />);
  let progressElement = await screen.findByRole('progressbar');
  expect(progressElement).toBeInTheDocument();
});
