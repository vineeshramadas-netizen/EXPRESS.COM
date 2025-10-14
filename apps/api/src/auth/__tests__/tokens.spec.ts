import * as jwt from 'jsonwebtoken';

describe('token rotation', () => {
  it('produces different refresh tokens over time', async () => {
    const secret = 'test';
    const a = jwt.sign({ sub: 'u1' }, secret, { expiresIn: '7d' });
    await new Promise((r) => setTimeout(r, 10));
    const b = jwt.sign({ sub: 'u1' }, secret, { expiresIn: '7d' });
    expect(a).not.toEqual(b);
  });
});
