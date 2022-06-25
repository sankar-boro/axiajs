import { Axia, BN, Buffer } from "axia/dist"
import { AVMAPI, KeyChain as AVMKeyChain } from "axia/dist/apis/avm"
import {
  PlatformVMAPI,
  KeyChain,
  UTXOSet,
  UnsignedTx,
  Tx
} from "axia/dist/apis/platformvm"
import {
  PrivateKeyPrefix,
  DefaultLocalGenesisPrivateKey,
  Defaults,
  UnixNow
} from "axia/dist/utils"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const xchain: AVMAPI = axia.XChain()
const pchain: PlatformVMAPI = axia.PChain()
const xKeychain: AVMKeyChain = xchain.keyChain()
const pKeychain: KeyChain = pchain.keyChain()
const privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const pAddressStrings: string[] = pchain.keyChain().getAddressStrings()
const xChainBlockchainID: string = Defaults.network[networkID].X.blockchainID
const fee: BN = pchain.getDefaultTxFee()
const threshold: number = 1
const locktime: BN = new BN(0)
const memo: Buffer = Buffer.from(
  "PlatformVM utility method buildExportTx to export AXC from the CoreChain to the SwapChain"
)
const asOf: BN = UnixNow()

const main = async (): Promise<any> => {
  const getBalanceResponse: any = await pchain.getBalance(pAddressStrings[0])
  const unlocked: BN = new BN(getBalanceResponse.unlocked)
  const platformVMUTXOResponse: any = await pchain.getUTXOs(pAddressStrings)
  const utxoSet: UTXOSet = platformVMUTXOResponse.utxos
  const unsignedTx: UnsignedTx = await pchain.buildExportTx(
    utxoSet,
    unlocked.sub(fee),
    xChainBlockchainID,
    xAddressStrings,
    pAddressStrings,
    pAddressStrings,
    memo,
    asOf,
    locktime,
    threshold
  )
  const tx: Tx = unsignedTx.sign(pKeychain)
  const txid: string = await pchain.issueTx(tx)
  console.log(`Success! TXID: ${txid}`)
}

main()
