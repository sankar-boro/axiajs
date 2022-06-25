import { Axia } from "axia/dist"
import { MetricsAPI } from "axia/dist/apis/metrics"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const metrics: MetricsAPI = axia.Metrics()

const main = async (): Promise<any> => {
  const m: string = await metrics.getMetrics()
  console.log(m)
}

main()
