import CarrotMQ from 'carrotmq'

interface IRpcBody {
  service?: string,
  method: string,
  args?: any[]
}
const QUEUE = 'admin.service.rpc'

export class RpcPackageService {
  constructor(
    private mq: CarrotMQ,
    private serviceName,
  ) {}

  public async rpc(body: IRpcBody) {
    body.service = body.service || this.serviceName
    const res = await this.mq.rpc(QUEUE, body)
    res.ack()
    if (res.data && res.data.err) {
      const err = new Error(res.data.err)
      Object.assign(err, res.data, {
        body,
      })
      throw err
    }
    return res.data
  }
}
