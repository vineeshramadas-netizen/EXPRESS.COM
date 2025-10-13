import { render, screen } from '@testing-library/react';
import Home from '../../../app/page';

describe('Home', () => {
  it('renders title', () => {
    render(<Home /> as any);
    expect(screen.getByText('Express.com')).toBeInTheDocument();
  });
});
