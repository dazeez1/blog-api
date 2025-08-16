const request = require('supertest');
const app = require('../app');

describe('Health Check Endpoint', () => {
  it('should return 200 and success message', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'Blog API is running');
    expect(response.body).toHaveProperty('timestamp');
  });
});
