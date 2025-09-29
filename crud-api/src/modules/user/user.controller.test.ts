import { Response } from 'supertest';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';

import { request } from '#src/shared/libs/tests/index.js';

import { CreateUserDto } from './dto/create-user.dto.js';

const validCreateUserDto: CreateUserDto = {
  username: 'New user',
  age: 20,
  hobbies: ['Programming'],
};

describe('POST api/users', () => {
  describe('API returns created user', () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.post('/api/users').send(validCreateUserDto);
    });

    afterAll(async () => {
      await request.delete(`/api/users/${response.body.id}`);
    });

    test('Should return status code 201', () => {
      expect(response.status).toBe(201);
    });

    test('Should return created user', () => {
      expect(response.body).toMatchObject(validCreateUserDto);
    });

    test('Should return user with id', () => {
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('API returns error when required fields are missing', () => {
    let response: Response;

    beforeAll(async () => {
      const invalidCreateUserDto = { hobbies: [] };
      response = await request.post('/api/users').send(invalidCreateUserDto);
    });

    test('Should return status code 400', () => {
      expect(response.status).toBe(400);
    });

    test('Should return error message', () => {
      expect(response.body).toEqual({
        message: 'Validation error',
        errors: [
          {
            field: 'username',
            messages: ['Field "username" is required'],
          },
          {
            field: 'age',
            messages: ['Field "age" is required'],
          },
        ],
      });
    });
  });
});

describe('GET api/users', () => {
  describe('API returns all users', () => {
    let postResponse1: Response;
    let postResponse2: Response;
    let getResponse: Response;

    beforeAll(async () => {
      postResponse1 = await request.post('/api/users').send(validCreateUserDto);
      postResponse2 = await request.post('/api/users').send(validCreateUserDto);
      getResponse = await request.get('/api/users');
    });

    afterAll(async () => {
      await request.delete(`/api/users/${postResponse1.body.id}`);
      await request.delete(`/api/users/${postResponse2.body.id}`);
    });

    test('Should return status code 200', () => {
      expect(getResponse.status).toBe(200);
    });

    test('Should return all users', () => {
      expect(getResponse.body).toEqual(
        expect.arrayContaining([postResponse1.body, postResponse2.body]),
      );
    });

    test('Should return users with id', () => {
      expect(getResponse.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: postResponse1.body.id }),
          expect.objectContaining({ id: postResponse2.body.id }),
        ]),
      );
    });
  });
});

describe('GET api/users/{userId}', () => {
  describe('API returns user by id', () => {
    let postResponse: Response;
    let getResponse: Response;

    beforeAll(async () => {
      postResponse = await request.post('/api/users').send(validCreateUserDto);
      getResponse = await request.get(`/api/users/${postResponse.body.id}`);
    });

    afterAll(async () => {
      await request.delete(`/api/users/${postResponse.body.id}`);
    });

    test('Should return status code 200', () => {
      expect(getResponse.status).toBe(200);
    });

    test('Should return user', () => {
      expect(getResponse.body).toEqual(postResponse.body);
    });

    test('Should return user with id', () => {
      expect(getResponse.body).toHaveProperty('id', postResponse.body.id);
    });
  });

  describe('API returns error when user not found', () => {
    let getResponse: Response;

    beforeAll(async () => {
      getResponse = await request.get(
        '/api/users/070aaef9-45be-4650-8f4d-abea4f2ebdc5',
      );
    });

    test('Should return status code 404', () => {
      expect(getResponse.status).toBe(404);
    });

    test('Should return error message', () => {
      expect(getResponse.body).toEqual({ message: 'User not found' });
    });
  });

  describe('API returns error when userId is invalid', () => {
    let getResponse: Response;

    beforeAll(async () => {
      getResponse = await request.get('/api/users/invalid');
    });

    test('Should return status code 400', () => {
      expect(getResponse.status).toBe(400);
    });

    test('Should return error message', () => {
      expect(getResponse.body).toEqual({ message: 'Invalid id' });
    });
  });
});

describe('PUT api/users/{userId}', () => {
  describe('API returns updated user', () => {
    let postResponse: Response;
    let putResponse: Response;

    beforeAll(async () => {
      postResponse = await request.post('/api/users').send(validCreateUserDto);
      putResponse = await request
        .put(`/api/users/${postResponse.body.id}`)
        .send({
          ...validCreateUserDto,
          username: 'Updated user',
        });
    });

    afterAll(async () => {
      await request.delete(`/api/users/${postResponse.body.id}`);
    });

    test('Should return status code 200', () => {
      expect(putResponse.status).toBe(200);
    });

    test('Should return updated user', () => {
      expect(putResponse.body).toMatchObject({
        ...validCreateUserDto,
        username: 'Updated user',
      });
    });

    test('Should return user with id', () => {
      expect(putResponse.body).toHaveProperty('id', postResponse.body.id);
    });
  });

  describe('API returns error when user not found', () => {
    let putResponse: Response;

    beforeAll(async () => {
      putResponse = await request
        .put('/api/users/070aaef9-45be-4650-8f4d-abea4f2ebdc5')
        .send(validCreateUserDto);
    });

    test('Should return status code 404', () => {
      expect(putResponse.status).toBe(404);
    });

    test('Should return error message', () => {
      expect(putResponse.body).toEqual({ message: 'User not found' });
    });
  });

  describe('API returns error when userId is invalid', () => {
    let putResponse: Response;

    beforeAll(async () => {
      putResponse = await request
        .put('/api/users/invalid_id')
        .send(validCreateUserDto);
    });

    test('Should return status code 400', () => {
      expect(putResponse.status).toBe(400);
    });

    test('Should return error message', () => {
      expect(putResponse.body).toEqual({ message: 'Invalid id' });
    });
  });
});

describe('DELETE api/users/{userId}', () => {
  describe('API returns status code 204', () => {
    let postResponse: Response;
    let deleteResponse: Response;

    beforeAll(async () => {
      postResponse = await request.post('/api/users').send(validCreateUserDto);
      deleteResponse = await request.delete(
        `/api/users/${postResponse.body.id}`,
      );
    });

    test('Should return status code 204', () => {
      expect(deleteResponse.status).toBe(204);
    });

    test('Should return empty body', () => {
      expect(deleteResponse.body).toEqual('');
    });
  });

  describe('API returns error when user not found', () => {
    let deleteResponse: Response;

    beforeAll(async () => {
      deleteResponse = await request.delete(
        '/api/users/070aaef9-45be-4650-8f4d-abea4f2ebdc5',
      );
    });

    test('Should return status code 404', () => {
      expect(deleteResponse.status).toBe(404);
    });

    test('Should return error message', () => {
      expect(deleteResponse.body).toEqual({ message: 'User not found' });
    });
  });

  describe('API returns error when userId is invalid', () => {
    let deleteResponse: Response;

    beforeAll(async () => {
      deleteResponse = await request.delete('/api/users/invalid');
    });

    test('Should return status code 400', () => {
      expect(deleteResponse.status).toBe(400);
    });

    test('Should return error message', () => {
      expect(deleteResponse.body).toEqual({ message: 'Invalid id' });
    });
  });
});
