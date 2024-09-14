import request, { Response } from 'supertest';
import { beforeAll, describe, expect, test } from 'vitest';

import { Application } from '#src/application.js';
import { InMemoryDatabase } from '#src/shared/libs/database/index.js';

import { UserController } from './UserController.js';
import { UserDto } from './UserDto.js';

const PORT = 8000;

export const createApplication = () => {
  const database = new InMemoryDatabase();
  const userController = new UserController(database);
  const application = new Application(PORT, userController);
  application.init();
  return application;
};

const validCreateUserDto: UserDto = {
  username: 'New user',
  age: 20,
  hobby: ['Programming'],
};

describe('POST api/users', () => {
  describe('API returns created user', () => {
    let response: Response;

    beforeAll(async () => {
      const host = `http://localhost:${PORT}`;
      response = await request(host)
        .post('/api/users')
        .send(validCreateUserDto);
    });

    test('Should return status code 200', () => {
      expect(response.statusCode).toBe(200);
    });
  });
});
