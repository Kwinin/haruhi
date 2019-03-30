'use strict'

import {Promise} from 'es6-promise'
import {NextFunction, Response} from 'express'
import Router from 'express-promise-router'
import {checkLogin, IServicedRequest} from '../module/middlewares'
import {UserService} from '../service/user'

type Request = IServicedRequest<UserService>
const router = Router()

router.get('/', async (req, res) => {
  await new Promise((resolve, reject) => {
    setTimeout(resolve, 2000)
  })
  res.json({message: 'await'})
})

router.post('/login', async (req, res) => {
  const {username, password} = req.body
  const user = await UserService.login(username, password)
  req.session.uid = user._id
  res.json(user)
})

router.get('/errors', async (req: Request, res: Response) => {
  const err = new Error('some error')
  err['foo'] = 'bar'
  throw err
})

module.exports = router
