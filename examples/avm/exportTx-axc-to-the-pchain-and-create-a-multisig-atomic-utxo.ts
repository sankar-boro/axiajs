import { Axia, BinTools, BN, Buffer } from "axia/dist"
import {
  AVMAPI,
  KeyChain,
  SECPTransferOutput,
  SECPTransferInput,
  TransferableOutput,
  TransferableInput,
  UTXOSet,
  UTXO,
  AmountOutput,
  UnsignedTx,
  Tx,
  ExportTx
} from "axia/dist/apis/avm"
import {
  PlatformVMAPI,
  KeyChain as PlatformVMKeyChain
} from "axia/dist/apis/platformvm"
import {
  PrivateKeyPrefix,
  DefaultLocalGenesisPrivateKey,
  Defaults
} from "axia/dist/utils"

const ip: string = "localhost"
const port: number = 9650
const protocol: string = "http"
const networkID: number = 1337
const axia: Axia = new Axia(ip, port, protocol, networkID)
const xchain: AVMAPI = axia.XChain()
const pchain: PlatformVMAPI = axia.PChain()
const bintools: BinTools = BinTools.getInstance()
const xKeychain: KeyChain = xchain.keyChain()
const pKeychain: PlatformVMKeyChain = pchain.keyChain()
let privKey: string = `${PrivateKeyPrefix}${DefaultLocalGenesisPrivateKey}`
// P-custom18jma8ppw3nhx5r4ap8clazz0dps7rv5u9xde7p
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)

privKey = "PrivateKey-R6e8f5QSa89DjpvL9asNdhdJ4u8VqzMJStPV8VVdDmLgPd8a4"
// X-custom15s7p7mkdev0uajrd0pzxh88kr8ryccztnlmzvj
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)

privKey = "PrivateKey-rKsiN3X4NSJcPpWxMSh7WcuY653NGQ7tfADgQwDZ9yyUPPDG9"
// P-custom1jwwk62ktygl0w29rsq2hq55amamhpvx82kfnte
xKeychain.importKey(privKey)
pKeychain.importKey(privKey)
const xAddresses: Buffer[] = xchain.keyChain().getAddresses()
const xAddressStrings: string[] = xchain.keyChain().getAddressStrings()
const pAddresses: Buffer[] = pchain.keyChain().getAddresses()
const xChainID: string = Defaults.network[networkID].X.blockchainID
const xChainIDBuf: Buffer = bintools.cb58Decode(xChainID)
const axcAssetID: string = Defaults.network[networkID].X.axcAssetID
const axcAssetIDBuf: Buffer = bintools.cb58Decode(axcAssetID)
const pChainID: string = Defaults.network[networkID].P.blockchainID
const pChainIDBuf: Buffer = bintools.cb58Decode(pChainID)
const exportedOuts: TransferableOutput[] = []
const outputs: TransferableOutput[] = []
const inputs: TransferableInput[] = []
const fee: BN = xchain.getDefaultTxFee()
const threshold: number = 2
const locktime: BN = new BN(0)
const memo: Buffer = Buffer.from(
  "Export AXC from the SwapChain to the CoreChain and create a multisig atomic utxo"
)

const main = async (): Promise<any> => {
  const getBalanceResponse: any = await xchain.getBalance(
    xAddressStrings[0],
    axcAssetID
  )
  const balance: BN = new BN(getBalanceResponse.balance)
  const secpTransferOutput: SECPTransferOutput = new SECPTransferOutput(
    balance.sub(fee),
    pAddresses,
    locktime,
    threshold
  )
  const transferableOutput: TransferableOutput = new TransferableOutput(
    axcAssetIDBuf,
    secpTransferOutput
  )
  exportedOuts.push(transferableOutput)

  const avmUTXOResponse: any = await xchain.getUTXOs(xAddressStrings)
  const utxoSet: UTXOSet = avmUTXOResponse.utxos
  const utxos: UTXO[] = utxoSet.getAllUTXOs()
  utxos.forEach((utxo: UTXO): void => {
    const amountOutput: AmountOutput = utxo.getOutput() as AmountOutput
    const amount: BN = amountOutput.getAmount().clone()
    const txID: Buffer = utxo.getTxID()
    const outputIdx: Buffer = utxo.getOutputIdx()

    const secpTransferInput: SECPTransferInput = new SECPTransferInput(amount)
    secpTransferInput.addSignatureIdx(0, xAddresses[0])

    const input: TransferableInput = new TransferableInput(
      txID,
      outputIdx,
      axcAssetIDBuf,
      secpTransferInput
    )
    inputs.push(input)
  })

  const exportTx: ExportTx = new ExportTx(
    networkID,
    xChainIDBuf,
    outputs,
    inputs,
    memo,
    pChainIDBuf,
    exportedOuts
  )
  const unsignedTx: UnsignedTx = new UnsignedTx(exportTx)
  const tx: Tx = unsignedTx.sign(xKeychain)
  const txid: string = await xchain.issueTx(tx)
  console.log(`Success! TXID: ${txid}`)
}

main()
