/**
 * Created by bangbang93 on 2017/3/1.
 */
import * as bcrypt from 'bcrypt'
import {createLogger} from 'bunyan'
import {logger as loggerConfig} from '../config'
import {UserModel} from '../model/user'
import {AdminModule} from '../module/mq'
import {BaseService} from './_base-service'
const Logger = createLogger(loggerConfig('service.user') as any)
export class UserService extends BaseService {
  public static async login(username: string, password: string) {
    const user = await UserModel.findOne({username})
      .select('+password')
    if (!user) throw new Error('no such user')
    const isPasswordCorrect = await bcrypt.compare(password, user.password)
    if (!isPasswordCorrect) throw new Error('wrong password')

    return user
  }

  public static async create(username: string, password: string) {
    const salt = await bcrypt.genSalt()
    const hash = await bcrypt.hash(password, salt)
    const user = await UserModel.create({username, password: hash})
    return user
  }

  public static async exceptTest() {
    return AdminModule.ExceptTestService.testInExcept('我是小猪')
  }

  public async test() {
    const rpcTest = await UserService.exceptTest()
    Logger.info('logger', {rpcTest})
    return {userId: this.userId, rpcTest}
  }
}
