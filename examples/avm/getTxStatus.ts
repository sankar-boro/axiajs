import { Axia } from "axia/dist"
import { AVMAPI } from "axia/dist/apis/avm"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const xchain: AVMAPI = axia.XChain()

const main = async (): Promise<any> => {
  const status: string = await xchain.getTxStatus(
    "2WdpWdsqE26Qypmf66No8KeBYbNhdk3zSG7a5uNYZ3FLSvCu1D"
  )
  console.log(status)
}

main()
