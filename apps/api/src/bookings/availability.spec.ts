import { differenceInCalendarDays } from 'date-fns';

describe('pricing and availability helpers', () => {
  it('calculates nights correctly', () => {
    const start = new Date('2025-01-01');
    const end = new Date('2025-01-05');
    expect(differenceInCalendarDays(end, start)).toBe(4);
  });
});
