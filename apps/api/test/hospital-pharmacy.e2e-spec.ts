import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './test-helper';

describe('3. Hospital OPD/IPD & Pharmacy APIs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api/hospital/departments - should return hospital wards and clinical departments', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/hospital/departments')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/pharmacy/overview - should return pharmacy overview metrics', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/pharmacy/overview')
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('GET /api/pharmacy/reports/low-stock - should return reorder alert medicines', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/pharmacy/reports/low-stock')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });
});
