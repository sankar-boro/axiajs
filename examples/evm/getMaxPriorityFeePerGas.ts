import { Axia, BN } from "axia/dist"
import { EVMAPI } from "axia/dist/apis/evm"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const cchain: EVMAPI = axia.CChain()

const main = async (): Promise<any> => {
  const maxPriorityFeePerGas: string = await cchain.getMaxPriorityFeePerGas()
  console.log(maxPriorityFeePerGas)
}

main()
