import { Axia } from "axia/dist"
import { InfoAPI } from "axia/dist/apis/info"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const info: InfoAPI = axia.Info()

const main = async (): Promise<any> => {
  const networkName: string = await info.getNetworkName()
  console.log(networkName)
}

main()
