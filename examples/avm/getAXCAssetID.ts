import { Axia, Buffer } from "axia/dist"
import { AVMAPI } from "axia/dist/apis/avm"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const xchain: AVMAPI = axia.XChain()

const main = async (): Promise<any> => {
  const assetID: Buffer = await xchain.getAXCAssetID()
  console.log(assetID)
}

main()
