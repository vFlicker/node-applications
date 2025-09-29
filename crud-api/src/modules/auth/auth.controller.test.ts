import { Response } from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { request } from '#src/shared/libs/tests/index.js';

describe('POST api/auth/login', () => {
  describe('API returns token', () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.post('/api/login').send();
    });

    test('Should return status code 200', () => {
      expect(response.status).toBe(200);
    });

    test('Should return token in body', () => {
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
      expect(response.body.token.length).toBe(32);
    });
  });
});

describe('POST api/auth/logout', () => {
  describe('API returns status code 204', () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.post('/api/logout').send();
    });

    test('Should return status code 204', () => {
      expect(response.status).toBe(204);
    });

    test('Should return empty body', () => {
      expect(response.body).toEqual('');
    });
  });
});

describe('GET api/protected', () => {
  describe('API returns 401 when no auth token provided', () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.get('/api/protected').send();
    });

    test('Should return status code 401', () => {
      expect(response.status).toBe(401);
    });

    test('Should return error message', () => {
      expect(response.body).toEqual({ message: 'Unauthorized' });
    });
  });

  describe('API returns protected data when valid auth token provided', () => {
    let loginResponse: Response;
    let protectedResponse: Response;

    beforeAll(async () => {
      loginResponse = await request.post('/api/login').send();
      protectedResponse = await request
        .get('/api/protected')
        .set('Cookie', loginResponse.headers['set-cookie'])
        .send();
    });

    afterAll(async () => {
      await request
        .post('/api/logout')
        .set('Cookie', loginResponse.headers['set-cookie'])
        .send();
    });

    test('Should return status code 200', () => {
      expect(protectedResponse.status).toBe(200);
    });

    test('Should return protected data', () => {
      expect(protectedResponse.body).toEqual({
        message: 'This is protected data visible to authenticated users only.',
      });
    });
  });
});
