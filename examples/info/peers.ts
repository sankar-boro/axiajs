import { Axia } from "axia/dist"
import { InfoAPI } from "axia/dist/apis/info"
import { PeersResponse } from "axia/dist/apis/info/interfaces"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const info: InfoAPI = axia.Info()

const main = async (): Promise<any> => {
  const peers: PeersResponse[] = await info.peers([])
  console.log(peers)
}

main()
