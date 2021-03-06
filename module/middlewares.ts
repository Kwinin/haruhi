import * as bunyan from 'bunyan'
import errSerializer from 'bunyan-serializer-error'
import {NextFunction, Request, Response} from 'express'
import {validationResult} from 'express-validator/check'
import {logger as loggerConfig} from '../config'
import {IUserSchema, UserModel} from '../model/user'

const Logger = bunyan.createLogger({
  ...loggerConfig('middleware'),
  serializers: {
    ...bunyan.stdSerializers,
    err: errSerializer,
  },
} as any)

export interface IServicedRequest<T> extends Request {
  service: T
}

declare global {
  namespace Express {
    // tslint:disable-next-line
    interface Request {
      logger: bunyan,
      user: IUserSchema
    }
    // tslint:disable-next-line
    interface Response {
      missing(fields: string | string[]): this
    }
  }
}
export function haruhiMiddleware(req: Request, res: Response, next: NextFunction) {
  res.missing = function missing(field: string | string[]) {
    return res.status(400)
      .json({
        message: 'missing ' + field.toString(),
      })
  }
  req.logger = Logger.child({req})
  next()
}

export async function checkLogin(req, res, next) {
  if (!req.session.uid) {
    return res.status(401)
      .json({
        message: 'need login',
      })
  } else {
    const user = await UserModel.findById(req.session.uid)
    req.user = user.toObject()
    req.user.userId = user._id.toString()
    next()
  }
}

export function checkValidationResult(req: Request, res: Response, next: NextFunction) {
  const validation = validationResult(req)
  if (!validation.isEmpty()) {
    return res.status(400)
      .json(validation.mapped())
  }
  next()
}
