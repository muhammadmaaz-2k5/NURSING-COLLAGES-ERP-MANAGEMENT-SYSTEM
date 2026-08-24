import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './test-helper';

describe('5. Facilities (Hostel, Library, Transport) & HR Payroll APIs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api/hostel/hostels - should return hostel buildings and occupancy', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/hostel/hostels')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/library/books - should return book collection catalog', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/library/books')
      .expect(200);

    expect(response.body).toBeDefined();
  });


  it('GET /api/transport/routes - should return fleet bus routes', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/transport/routes')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/hr/employees - should return employee directory', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/hr/employees')
      .expect(200);

    expect(response.body).toBeDefined();
  });

});
