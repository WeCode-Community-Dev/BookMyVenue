/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    // Clean up database records created during test
    await prisma.userRole.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.role.deleteMany({});
    await prisma.$disconnect();
    await app.close();
  });

  const testUser = {
    email: 'auth_test_user@example.com',
    password: 'securePassword123',
    fullName: 'Test User',
    roles: ['USER', 'OWNER'],
  };

  it('/auth/register (POST) - successfully registers a new user with roles', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201);

    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(testUser.email.toLowerCase());
    expect(res.body.fullName).toBe(testUser.fullName);
    expect(res.body.roles).toEqual(expect.arrayContaining(['USER', 'OWNER']));
  });

  it('/auth/register (POST) - fails to register duplicate email', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(409);
  });

  let token = '';

  it('/auth/login (POST) - successfully logs in and returns access_token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(res.body).toHaveProperty('access_token');
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(testUser.email.toLowerCase());
    expect(res.body.user.roles).toEqual(
      expect.arrayContaining(['USER', 'OWNER']),
    );

    token = res.body.access_token;
  });

  it('/auth/login (POST) - fails to login with invalid password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword',
      })
      .expect(401);
  });

  it('/auth/verify (POST) - successfully verifies a valid token and returns payload', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/verify')
      .send({ token })
      .expect(200);

    expect(res.body).toHaveProperty('sub');
    expect(res.body.email).toBe(testUser.email.toLowerCase());
    expect(res.body.roles).toEqual(expect.arrayContaining(['USER', 'OWNER']));
  });

  it('/auth/verify (POST) - successfully verifies a valid token via Bearer Authorization header', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/verify')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body.email).toBe(testUser.email.toLowerCase());
    expect(res.body.roles).toEqual(expect.arrayContaining(['USER', 'OWNER']));
  });

  it('/auth/verify (POST) - fails with invalid token', async () => {
    await request(app.getHttpServer())
      .post('/auth/verify')
      .send({ token: 'invalid_token' })
      .expect(401);
  });
});
