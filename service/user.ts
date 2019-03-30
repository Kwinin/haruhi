/**
 * Created by bangbang93 on 2017/3/1.
 */
import * as bcrypt from 'bcrypt'
import {UserModel} from '../model/user'
import {BaseService} from './_base-service'

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

  public async test() {
    return this.userId
  }
}
