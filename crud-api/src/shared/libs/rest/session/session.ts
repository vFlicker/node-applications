import { Client, Session } from '../types.js';
import { generateToken } from './generate-token.js';
import { sessionStorage } from './session-storage.js';

export class RestSession implements Session {
  private readonly token: string;

  constructor(token: string) {
    this.token = token;
  }

  public static start(client: Client): Session {
    const session = client.getSession();
    if (session) return session;

    const token = generateToken();
    client.setToken(token);
    const newSession = new RestSession(token);
    client.setSession(newSession);
    client.setCookie('token', token, true);
    sessionStorage.set(token, { token });
    return newSession;
  }

  static async restore(client: Client): Promise<Session | null> {
    const sessionToken = client.getCookie('token');
    if (!sessionToken) return null;

    try {
      const serializedSession = await sessionStorage.get(sessionToken);
      if (!serializedSession) return null;

      const session = new RestSession(serializedSession.token);
      client.setToken(sessionToken);
      client.setSession(session);
      return session;
    } catch (err) {
      console.error(`Error restoring session: ${err}`);
      return null;
    }
  }

  static delete(client: Client): void {
    const token = client.getToken();
    if (token) {
      client.deleteCookie('token');
      client.deleteToken();
      client.deleteSession();
      sessionStorage.delete(token);
    }
  }

  public save(): void {
    sessionStorage.save(this.token);
  }
}
