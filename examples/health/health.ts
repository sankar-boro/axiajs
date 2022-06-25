import { Axia } from "axia/dist"
import { HealthAPI } from "axia/dist/apis/health"
import { HealthResponse } from "axia/dist/apis/health/interfaces"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const health: HealthAPI = axia.Health()

const main = async (): Promise<any> => {
  const healthResponse: HealthResponse = await health.health()
  console.log(healthResponse)
}

main()
