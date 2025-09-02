const request = require('supertest');
const app = require('../app');

describe('Authentication Endpoints', () => {
  describe('POST /api/auth/signup', () => {
    it('should return 400 for invalid data', async () => {
      const response = await request(app).post('/api/auth/signup').send({
        name: 'Test',
        email: 'invalid-email',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app).post('/api/auth/signup').send({
        name: 'Test User',
        email: 'test@example.com',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 for invalid data', async () => {
      const response = await request(app).post('/api/auth/login').send({
        email: 'invalid-email',
        password: '',
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without token', async () => {
      const response = await request(app).get('/api/auth/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
