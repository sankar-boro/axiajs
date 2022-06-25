import { Axia } from "axia/dist"
import { IndexAPI } from "axia/dist/apis/index"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const index: IndexAPI = axia.Index()

const main = async (): Promise<any> => {
  const containerID: string =
    "eLXEKFFMgGmK7ZLokCFjppdBfGy5hDuRqh5uJVyXXPaRErpAX"
  const encoding: string = "hex"
  const baseurl: string = "/ext/index/X/tx"
  const containerRange: string = await index.getIndex(
    containerID,
    encoding,
    baseurl
  )
  console.log(containerRange)
}

main()
