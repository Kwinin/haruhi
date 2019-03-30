// tslint:disable:file-name-casing
import {IUserSchema} from '../model/user'

export abstract class BaseService {
  protected userId: string
  constructor(
    protected user: IUserSchema,
  ) {
    this.userId = user._id.toString()
  }
}
