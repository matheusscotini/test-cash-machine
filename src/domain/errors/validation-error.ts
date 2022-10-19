/* eslint-disable @typescript-eslint/indent */
export class ValidationError extends Error {
    constructor (message: string) {
      super(message)
      this.name = 'ValidationError'
    }
  }
