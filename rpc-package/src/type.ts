export namespace AdminRpcArguments {

  export interface INotifyArguments {
    category: string
    app: string
    message: string
    time?: Date
    state?: string
    track?: {
      name: string,
      id: string,
    }
  }

  export interface IWechatArguments {
    eventData: any,
    template: string,
    event?: string
  }

  export interface IFactorySearchOptions {
    name?: string
    businessType?: string
  }

  export interface IFactorySchema {
    _id?: string
    name: string
    shortName: string
    address: string
    provider: string
    businessType: string[]
    contact: any[]
    isDisabled?: boolean
  }

  export interface IPackageTypeCategorySearchOptions {
    name?: string
    category?: string
  }

  export interface IPackageTypeModelSearchOptions {
    name?: string
  }
}
