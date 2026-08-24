import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './test-helper';

describe('Cross-Cutting Platform: Notifications & Search (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api/notifications - should return user notifications list', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/notifications')
      .expect(200);

    expect(response.body).toHaveProperty('data');
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('PATCH /api/notifications/read-all - should mark notifications as read', async () => {
    const response = await request(app.getHttpServer())
      .patch('/api/notifications/read-all')
      .expect(200);

    expect(response.status).toBe(200);
  });
});
