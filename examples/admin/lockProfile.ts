import { Axia } from "axia/dist"
import { AdminAPI } from "axia/dist/apis/admin"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const admin: AdminAPI = axia.Admin()

const main = async (): Promise<any> => {
  const successful: boolean = await admin.lockProfile()
  console.log(successful)
}

main()
