import {
  Client,
  Controller,
  RestSession,
} from '#src/shared/libs/rest/index.js';
import { authMiddleware } from '#src/shared/middlewares/index.js';

export class AuthController extends Controller {
  constructor() {
    super();

    this.post('/api/login', this.login);
    this.post('/api/logout', this.logout);
    this.get('/api/protected', authMiddleware(), this.getProtected);
  }

  public async login(client: Client): Promise<void> {
    RestSession.start(client);
    this.ok(client, { token: client.getToken() });
  }

  public async logout(client: Client): Promise<void> {
    RestSession.delete(client);
    this.noContent(client);
  }

  public async getProtected(client: Client): Promise<void> {
    this.ok(client, {
      message: 'This is protected data visible to authenticated users only.',
    });
  }
}
