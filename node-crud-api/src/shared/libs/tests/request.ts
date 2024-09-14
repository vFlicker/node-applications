import _request from 'supertest';

import { Config } from '#src/shared/config/config.js';

const config = new Config();

const host = `${config.hostName}:${config.port}`;
export const request = _request(host);
