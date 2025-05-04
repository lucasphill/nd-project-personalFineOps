import request from 'supertest';
import app from './app.js';

describe('Health Check - Server Startup', () => {
  it('should respond with status 200 on root path', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });
});