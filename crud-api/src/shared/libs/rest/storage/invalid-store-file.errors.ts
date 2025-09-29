export class InvalidStoreFileError extends Error {
  constructor() {
    super('Invalid store file');
    this.name = 'InvalidStoreFileError';
  }
}
