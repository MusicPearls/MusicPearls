const request = require('supertest');
const express = require('express');
const composersRoute = require('../routes/composers');

jest.mock('../utils', () => ({
  fetchData: jest.fn()
}));

const { fetchData } = require('../utils');

const app = express();
app.use('/composers', composersRoute);

describe('GET /composers', () => {
  it('should return sorted list of composers with correct structure', async () => {
    fetchData.mockResolvedValue({
      composers: [
        { name: 'Ludwig van Beethoven', birthyear: 1770, period: 'Classical' },
        { name: 'Johann Sebastian Bach', birthyear: 1685, period: 'Baroque' }
      ]
    });

    const res = await request(app).get('/composers');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('Composers');
    expect(Array.isArray(res.body.Composers)).toBe(true);
    expect(res.body.Composers.length).toBe(2);

    // Validate each item structure
    res.body.Composers.forEach(composer => {
      expect(composer).toHaveProperty('name');
      expect(typeof composer.name).toBe('string');

      expect(composer).toHaveProperty('birthyear');
      expect(typeof composer.birthyear).toBe('number');

      expect(composer).toHaveProperty('period');
      expect(typeof composer.period).toBe('string');
    });

    // Validate sorting (birthyear ascending)
    const birthyears = res.body.Composers.map(c => c.birthyear);
    const isSorted = birthyears.every((year, i, arr) => i === 0 || arr[i - 1] <= year);
    expect(isSorted).toBe(true);
  });

  it('should return 500 if fetchData throws an error', async () => {
    fetchData.mockRejectedValue(new Error('Simulated fetch error'));

    const res = await request(app).get('/composers');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Server Error');
  });
});