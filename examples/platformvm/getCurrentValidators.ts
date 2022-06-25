import { Axia } from "axia/dist"
import { PlatformVMAPI } from "axia/dist/apis/platformvm"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = axia.PChain()

const main = async (): Promise<any> => {
  const subnetID: string = "11111111111111111111111111111111LpoYY"
  const nodeIDs: string[] = []
  const currentValidators: object = await pchain.getCurrentValidators(subnetID)
  console.log(currentValidators)
}

main()
