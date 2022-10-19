/* eslint-disable @typescript-eslint/indent */
export class PersistenceError extends Error {
    constructor (message: string) {
      super(message)
      this.name = 'PersistenceError'
    }
  }
