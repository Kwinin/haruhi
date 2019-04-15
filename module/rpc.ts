import {createLogger} from 'bunyan'
import {logger as loggerConfig} from '../config'
import {RpcExceptTestService} from '../service/rpc/excepttest'
import {mq} from './mq'

const Logger = createLogger({
  ...loggerConfig('queue'),
  queue: 'exceptHar.service.rpc',
} as any)
const services = {
  ExceptTest: RpcExceptTestService,
}
mq.queue('admin.service.rpc', async (data, ctx) => {
  try {
    const {service, method: action, args} = data
    Logger.info('service.rpc', {data})
    const clazz = services[service]
    if (!clazz) {
      return ctx.reply({err: `no such service: ${service}`, service})
    }
    const fn: () => any = clazz[action]
    if (!fn) {
      return ctx.reply({err: `no such method: ${service}.${action}`, action})
    }
    const method = fn.bind(clazz)
    const res = await method.apply(null, args)
    await ctx.reply(res)
    Logger.trace({data, res})
  } catch (e) {
    Logger.fatal({err: e})
    await ctx.reply({err: e.message || e})
  } finally {
    ctx.ack()
  }
})
