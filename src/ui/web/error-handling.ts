import { NextFunction, Request, Response } from 'express'

interface HttpErrorReturn {
  error: string
  message: string
  stack: string | undefined
}

const mapError = (err: Error): HttpErrorReturn => ({
  error: err.name,
  message: err.message,
  stack: process.env.NODE_ENV !== 'prod' ? err.stack : undefined
})

export const errorHandling = (err: any, req: Request, res: Response, next: NextFunction): Response => {
  if (err.name === 'ValidationError') {
    return res.status(422).json(mapError(err))
  }

  return res.status(500).json(mapError(err))
}
