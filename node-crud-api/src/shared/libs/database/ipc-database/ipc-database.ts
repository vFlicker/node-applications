// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import childProcess from 'node:child_process';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import cluster from 'cluster';

import { Database } from '../database.interface.js';

export class IPCDatabase implements Database {
  private workerId: number;
  private pendingPromises: Map<string, (result: any) => void>;

  constructor() {
    this.workerId = cluster.worker?.id || 0;
    this.pendingPromises = new Map();

    process.on('message', (message) => {
      const { messageId, result } = message;
      const resolve = this.pendingPromises.get(messageId);
      if (resolve) {
        resolve(result);
        this.pendingPromises.delete(messageId);
      }
    });
  }

  public getRepository<T>(entityName: string) {
    return {
      add: (entity: Omit<T, 'id'>): Promise<T> => {
        const messageId = this.generateUniqueId();
        return new Promise((resolve) => {
          this.pendingPromises.set(messageId, resolve);
          process.send({
            to: 'database',
            from: this.workerId,
            action: 'add',
            entityName,
            data: entity,
            messageId,
          });
        });
      },

      findAll: (): Promise<T[]> => {
        const messageId = this.generateUniqueId();
        return new Promise((resolve) => {
          this.pendingPromises.set(messageId, resolve);
          process.send({
            to: 'database',
            from: this.workerId,
            action: 'findAll',
            entityName,
            messageId,
          });
        });
      },

      findById: (id: string): Promise<T> => {
        const messageId = this.generateUniqueId();
        return new Promise((resolve) => {
          this.pendingPromises.set(messageId, resolve);
          process.send({
            to: 'database',
            from: this.workerId,
            action: 'findById',
            entityName,
            data: id,
            messageId,
          });
        });
      },

      update: (entity: T): Promise<T> => {
        const messageId = this.generateUniqueId();
        return new Promise((resolve) => {
          this.pendingPromises.set(messageId, resolve);
          process.send({
            to: 'database',
            from: this.workerId,
            action: 'update',
            entityName,
            data: entity,
            messageId,
          });
        });
      },

      delete: (id: string): Promise<void> => {
        const messageId = this.generateUniqueId();
        return new Promise((resolve) => {
          this.pendingPromises.set(messageId, resolve);
          process.send({
            to: 'database',
            from: this.workerId,
            action: 'delete',
            entityName,
            data: id,
            messageId,
          });
        });
      },
    };
  }

  private generateUniqueId(): string {
    return `${this.workerId}-${Date.now()}-${Math.random()}`;
  }
}
