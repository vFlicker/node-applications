import { Response } from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { request } from '#src/shared/libs/tests/index.js';

import { UserDto } from './UserDto.js';

const validCreateUserDto: UserDto = {
  username: 'New user',
  age: 20,
  hobby: ['Programming'],
};

describe('POST api/users', () => {
  describe('API returns created user', () => {
    let response: Response;

    beforeAll(async () => {
      response = await request.post('/api/users').send(validCreateUserDto);
    });

    test('Should return status code 200', () => {
      expect(response.statusCode).toBe(200);
    });
  });
});
