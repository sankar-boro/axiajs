import { SendResponse } from "axia/dist/apis/avm"

const main = async (): Promise<any> => {
  const sendResponse: SendResponse = {
    txID: "2wYzSintaK3NWk71CGBvzuieFeAzJBLYpwfypGwQMsyotcK8Zs",
    changeAddr: "X-axc1vwf7dg22l9c0lnt92kq3urf0h9j3x6296sue77"
  }
  console.log(sendResponse)
}

main()
