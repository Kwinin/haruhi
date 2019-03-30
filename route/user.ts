'use strict'

import {NextFunction, Response} from 'express'
import Router from 'express-promise-router'
import {checkLogin, IServicedRequest} from '../module/middlewares'
import {UserService} from '../service/user'

type Request = IServicedRequest<UserService>
const router = Router()
router.use(checkLogin)
router.use((req: Request, res: Response, next: NextFunction) => {
  req.service = new UserService(req.user)
  next()
})
router.get('/test', async (req: Request, res: Response) => {
  const userId = await req.service.test()
  res.json(userId)
})

module.exports = router
