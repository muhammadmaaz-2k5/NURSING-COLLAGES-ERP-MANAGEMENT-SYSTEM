import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp } from './test-helper';

describe('2. Academic, Students, Faculty & Examinations APIs (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  it('GET /api/academic/programs - should return academic program offerings', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/academic/programs')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/students - should return paginated student roster', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/students')
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('GET /api/faculty - should return faculty instructors', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/faculty')
      .expect(200);

    expect(response.body).toBeDefined();
  });

  it('GET /api/exams - should return scheduled examination papers', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/exams')
      .expect(200);

    expect(response.body).toBeDefined();
  });

});
