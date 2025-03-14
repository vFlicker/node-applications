import _request from 'supertest';

import { RestConfig } from '#src/shared/config/index.js';

const config = new RestConfig();

const host = `${config.get('HOST_NAME')}:${config.get('PORT')}`;
export const request = _request(host);
