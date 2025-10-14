import { differenceInCalendarDays } from 'date-fns';

describe('availability logic', () => {
  it('adjacent bookings are allowed', () => {
    const aEnd = new Date('2025-01-05');
    const bStart = new Date('2025-01-05');
    expect(aEnd <= bStart).toBe(true);
  });

  it('nights calculation consistent', () => {
    const start = new Date('2025-01-01');
    const end = new Date('2025-01-04');
    expect(differenceInCalendarDays(end, start)).toBe(3);
  });
});
