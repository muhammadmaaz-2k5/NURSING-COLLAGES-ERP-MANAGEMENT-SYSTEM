import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './test-helper';

describe('4. Public Portal & Certificate Verification APIs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api/portal/overview - should return public college identity and accreditations', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/portal/overview')
      .expect(200);

    expect(response.body).toHaveProperty('college');
    expect(response.body).toHaveProperty('stats');
    expect(response.body).toHaveProperty('programs');
  });

  it('GET /api/portal/programs - should return public course offerings', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/portal/programs')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/portal/notices - should return published circulars', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/portal/notices')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/portal/verify/certificate/CERT-2026-BSN-089 - should verify authentic certificate', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/portal/verify/certificate/CERT-2026-BSN-089')
      .expect(200);

    expect(response.body).toHaveProperty('verified', true);
    expect(response.body).toHaveProperty('certificateNo', 'CERT-2026-BSN-089');
    expect(response.body).toHaveProperty('verificationHash');
  });
});
