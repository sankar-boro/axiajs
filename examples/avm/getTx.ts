import { Axia } from "axia/dist"
import { AVMAPI } from "axia/dist/apis/avm"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const xchain: AVMAPI = axia.XChain()

const main = async (): Promise<any> => {
  const txID: string = "Ycg5QzddNwe3ebfFXhoGUDnWgC6GE88QRakRnn9dp3nGwqCwD"
  const encoding: string = "json"
  const tx: string | object = await xchain.getTx(txID, encoding)
  console.log(tx)
}

main()
