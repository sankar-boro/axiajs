import { Axia } from "axia/dist"
import { GetValidatorsAtResponse } from "axia/dist/apis/platformvm/interfaces"
import { PlatformVMAPI } from "axia/dist/apis/platformvm"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const pchain: PlatformVMAPI = axia.PChain()

const main = async (): Promise<any> => {
  const height: number = 0
  const subnetID: string = "11111111111111111111111111111111LpoYY"
  const validators: GetValidatorsAtResponse = await pchain.getValidatorsAt(
    height,
    subnetID
  )
  console.log(validators)
}

main()
