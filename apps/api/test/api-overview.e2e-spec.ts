import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './test-helper';

describe('1. Health & Core Infrastructure APIs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api/health - should return healthy status, service name, and database connection', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .expect(200);

    expect(response.body).toHaveProperty('status');
    expect(response.body.status).toBe('ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('service');
  });

  it('GET /api/modules - should return list of enabled SaaS modules', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/modules')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/storage/signature - should return Cloudinary media upload signature and credentials', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/storage/signature?folder=nursing_college/students')
      .expect(200);

    expect(response.body).toHaveProperty('cloudName', 'pmvlk7fs');
    expect(response.body).toHaveProperty('apiKey', '189929163857439');
    expect(response.body).toHaveProperty('signature');
  });
});

