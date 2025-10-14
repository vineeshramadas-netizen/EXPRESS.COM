import { computePrice } from '../../src/services/booking.service';

describe('pricing', () => {
  it('computes totals with taxes and fees', () => {
    const r = computePrice(10000, 3, 2);
    expect(r.subtotalCents).toBe(60000);
    expect(r.taxesCents).toBe(6000);
    expect(r.feesCents).toBe(398);
    expect(r.totalCents).toBe(66398);
  });
});
