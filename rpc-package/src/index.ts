import CarrotMQ from 'carrotmq'
import {RpcPackageService} from './rpc-package-service'
import {AdminRpcArguments} from './type'

// export * from './type'
// tslint:disable:interface-name
export namespace AdminRpc {
  import IPackageTypeCategorySearchOptions = AdminRpcArguments.IPackageTypeCategorySearchOptions
  import IPackageTypeModelSearchOptions = AdminRpcArguments.IPackageTypeModelSearchOptions
  import INotifyArguments = AdminRpcArguments.INotifyArguments
  import IWechatArguments = AdminRpcArguments.IWechatArguments

  export interface IServices {
    AdminService: AdminService
    FactoryService: FactoryService
    NotifyService: NotifyService
    PackageTypeCategoryService: PackageTypeCategoryService
    PackageTypeModelService: PackageTypeModelService
    ExceptTestService: ExceptTestService
  }

  let instance: IServices

  export function AdminRpcFactory(mq: CarrotMQ): IServices {
    if (!mq) throw new Error('mq cannot be null')
    if (instance) return instance
    instance = {
      AdminService: serviceFactory(mq, 'admin'),
      FactoryService: serviceFactory(mq, 'factory'),
      NotifyService: serviceFactory(mq, 'notify'),
      PackageTypeCategoryService: serviceFactory(mq, 'packageTypeCategory'),
      PackageTypeModelService: serviceFactory(mq, 'packageTypeModel'),
      ExceptTestService: serviceFactory(mq, 'ExceptTest'),
    }
    return instance
  }

  interface AdminService {
    listAllId(): Promise<string[]>
  }

  interface FactoryService {
    search(search: AdminRpcArguments.IFactorySearchOptions, page?: number,
           limit?: number): Promise<{data: AdminRpcArguments.IFactorySchema[], count: number}>
    getById(id: string): Promise<AdminRpcArguments.IFactorySchema>
  }

  interface NotifyService {
    sendPushByPermission(node: string, message: string,
                         options: {icon?: string, payload?: any, event?: string},
                         operator?: string)
    sendToAdmin(node: string, notify: INotifyArguments,
                pushPayload?: object, wechatArg?: IWechatArguments)
  }

  interface PackageTypeCategoryService {
    search(search: IPackageTypeCategorySearchOptions, page?: number, limit?: number)
  }

  interface PackageTypeModelService {
    search(search: IPackageTypeModelSearchOptions, page?: number, limit?: number)
  }
  interface ExceptTestService {
    testInExcept(prop: string)
  }

  function serviceFactory<T>(mq, serviceName): T {
    return RpcProxy(new RpcPackageService(mq, serviceName)) as any
  }

  function RpcProxy<T extends RpcPackageService>(clazz: T): T {
    return new Proxy(clazz, {
      get: (clazz, key, instance) => {
        if (Reflect.has(clazz, key)) {
          return Reflect.get(clazz, key)
        } else {
          return (...args) => {
            return clazz.rpc.call(instance, {
              method: key as string,
              args: [...args],
            })
          }
        }
      },
    })
  }
}
