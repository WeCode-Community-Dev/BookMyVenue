import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('SearchController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('/search/recommended (GET) should return recommended venues', async () => {
    const response = await request(app.getHttpServer())
      .get('/search/recommended')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        city: expect.any(String),
        price: expect.any(Number),
        capacity: expect.any(Number),
        images: expect.any(Array),
      });
    }
  });

  it('/search (GET) should return a paginated list of venues', async () => {
    const response = await request(app.getHttpServer())
      .get('/search')
      .query({ skip: 0, take: 5 })
      .expect(200);

    expect(response.body).toMatchObject({
      data: expect.any(Array),
      pagination: expect.objectContaining({
        skip: 0,
        take: 5,
        total: expect.any(Number),
        hasMore: expect.any(Boolean),
      }),
    });
    expect(response.body.data.length).toBeLessThanOrEqual(5);
  });

  it('/search/navbar (GET) should return search results for the query', async () => {
    const response = await request(app.getHttpServer())
      .get('/search/navbar')
      .query({ q: 'Grand' })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    if (response.body.length > 0) {
      expect(response.body[0]).toMatchObject({
        id: expect.any(String),
        name: expect.any(String),
        city: expect.any(String),
        address: expect.any(String),
        price: expect.any(Number),
        images: expect.any(Array),
      });
    }
  });

  afterAll(async () => {
    await app.close();
  });
});
