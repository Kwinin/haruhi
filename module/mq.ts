import {createLogger} from 'bunyan'
import {CarrotMQ} from 'carrotmq'
import {hostname} from 'os'
import {logger as loggerConfig,  rabbitmq} from '../config'

const Logger = createLogger(loggerConfig('consumer.mq') as any)
export const mq = new CarrotMQ(rabbitmq.url, null, {
  callbackQueue: {
    queue: `exceptHar.rpc.callback@${hostname()}-${process.pid}`,
    options: {
      autoDelete: true,
      exclusive: true,
      durable: false,
      messageTtl: 3600e3,
    },
  },
})
mq.connect()
  .catch((err) => {
    Logger.info('cannot connect to rabbitmq', {err})
    process.exit(1)
  })

mq.on('close', () => {
  if (!mq.manualClose) {
    Logger.info('cannot connect to rabbitmq', {url: rabbitmq.url})
    process.exit(1)
  }
})
