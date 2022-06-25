# AxiaJS - The Axia Platform JavaScript Library

## Overview

AxiaJS is a JavaScript Library for interfacing with the Axia Platform. It is built using TypeScript and intended to support both browser and Node.js. The AxiaJS library allows you to issue commands to the Axia node APIs.

The APIs currently supported by default are:

* Admin API
* Auth API
* AVM API (SwapChain)
* EVM API (AXChain)
* Health API
* Index API
* Info API
* Keystore API
* Metrics API
* PlatformVM API (CoreChain)
* Socket

We built AxiaJS with ease of use in mind. With this library, any Javascript developer is able to interact with a node on the Axia Platform who has enabled their API endpoints for the developer's consumption. We keep the library up-to-date with the latest changes in the [Axia Platform Specification](https://docs.axc.network).

  Using AxiaJS, developers can:

* Locally manage private keys
* Retrieve balances on addresses
* Get UTXOs for addresses
* Build and sign transactions
* Issue signed transactions to the SwapChain, CoreChain, and AXChain
* Perform cross-chain swaps between the SwapChain<->CoreChain and between the SwapChain<->AXChain
* Add Validators and Delegators to the Primary Subnetwork by staking AXC
* Create a Subnetwork
* Administer a local node
* Retrieve Axia network information from a node

### Requirements

AxiaJS requires Node.js LTS version 14.16.0 or higher to compile.

### Installation

Axia is available for install via `yarn`:

`yarn add axia`

You can also pull the repo down directly and build it from scratch:

`yarn build`

This will generate a pure Javascript library and place it in a folder named "web" in the project root. The "axia.js" file can then be dropped into any project as a pure javascript implementation of Axia.

The AxiaJS library can be imported into your existing Node.js project as follows:

```js
const axia = require("axia")
```

Or into your TypeScript project like this:

```js
import { Axia } from "axia"
```

### Importing essentials

```js
import { Axia, BinTools, BN, Buffer } from "axia"

const bintools = BinTools.getInstance()
```

The above lines import the libraries used in the tutorials. The libraries include:

* Axia: Our javascript module.
* BinTools: A singleton built into AxiaJS that is used for dealing with binary data.
* [BN](https://www.npmjs.com/package/bn.js): A bignumber module use by AxiaJS.
* [Buffer](https://www.npmjs.com/package/buffer): A Buffer library.

## Example 1 &mdash; Managing SwapChain Keys

AxiaJS comes with its own AVM Keychain. This KeyChain is used in the functions of the API, enabling them to sign using keys it's registered. The first step in this process is to create an instance of AxiaJS connected to our Axia Platform endpoint of choice.

```js
import { Axia, BinTools, Buffer, BN } from "axia"

const bintools = BinTools.getInstance()

const myNetworkID = 12345 //default is 1, we want to override that for our local network
const axia = new Axia("localhost", 9650, "http", myNetworkID)
const xchain = axia.XChain() //returns a reference to the SwapChain used by AxiaJS
```

### Accessing the KeyChain

The KeyChain is accessed through the SwapChain and can be referenced directly or through a reference variable.

```js
const myKeychain = xchain.keyChain()
```

This exposes the instance of the class AVMKeyChain which is created when the SwapChain API is created. At present, this supports secp256k1 curve for ECDSA key pairs.

### Creating SwapChain key pairs

The KeyChain has the ability to create new KeyPairs for you and return the address associated with the key pair.

```js
const newAddress1 = myKeychain.makeKey() // returns an instance of the KeyPair class
```

You may also import your existing private key into the KeyChain using either a Buffer...

```js
const mypk = bintools.cb58Decode(
  "JaCCSxdoWfo3ao5KwenXrJjJR7cBTQ287G1C5qpv2hr2tCCdb"
) // returns a Buffer
const newAddress2 = myKeychain.importKey(mypk) // returns an instance of the KeyPair class
```

... or an CB58 string works, too:

```js
const mypk = "PrivateKey-JaCCSxdoWfo3ao5KwenXrJjJR7cBTQ287G1C5qpv2hr2tCCdb"
const newAddress2 = myKeychain.importKey(mypk) // returns an instance of the KeyPair class
```

### Working with KeyChains

The SwapChains's KeyChain has standardized key management capabilities. The following functions are available on any KeyChain that implements this interface.

```js
const addresses = myKeychain.getAddresses() // returns an array of Buffers for the addresses
const addressStrings = myKeychain.getAddressStrings() // returns an array of strings for the addresses
const exists = myKeychain.hasKey(addresses[0]) // returns true if the address is managed
const keypair = myKeychain.getKey(addresses[0]) // returns the KeyPair class
```

### Working with KeyPairs

The SwapChain's KeyPair has standardized KeyPair functionality. The following operations are available on any KeyPair that implements this interface.

```js
const address = keypair.getAddress() // returns Buffer
const addressString = keypair.getAddressString() // returns string

const pubk = keypair.getPublicKey() // returns Buffer
const pubkstr = keypair.getPublicKeyString() // returns a CB58 encoded string

const privk = keypair.getPrivateKey() //returns Buffer
const privkstr = keypair.getPrivateKeyString() //returns a CB58 encoded string

keypair.generateKey() // creates a new random KeyPair

const mypk = bintools.cb58Decode(
  "24jUJ9vZexUM6expyMcT48LBx27k1m7xpraoV62oSQAHdziao5"
)
const successful = keypair.importKey(mypk) // returns boolean if private key imported successfully

const message = Buffer.from("Through consensus to the stars")
const signature = keypair.sign(message) // returns a Buffer with the signature

const signerPubk = keypair.recover(message, signature) // returns a Buffer
const isValid = keypair.verify(message, signature) // returns a boolean
```

## Example 2 &mdash; Creating An Asset

This example creates an asset in the SwapChain and publishes it to the Axia Platform. The first step in this process is to create an instance of AxiaJS connected to our Axia Platform endpoint of choice.

```js
import { Axia, BinTools, Buffer, BN } from "axia"
import { InitialStates, SECPTransferOutput } from "axia/dist/apis/avm"

const myNetworkID = 12345 // default is 1, we want to override that for our local network
const axia = new Axia("localhost", 9650, "http", myNetworkID)
const xchain = axia.XChain() // returns a reference to the SwapChain used by AxiaJS
```

### Describe the new asset

The first steps in creating a new asset using AxiaJS is to determine the qualities of the asset. We will give the asset a name, a ticker symbol, as well as a denomination.

```js
// Name our new coin and give it a symbol
const name = "TeamRocket"
const symbol = "ROKT"

// Where is the decimal point indicate what 1 asset is and where fractional assets begin
// Ex: 1 AXC is denomination 9, so the smallest unit of AXC is nanoAXC (nAXC) at 10^-9 AXC
const denomination = 9
```

### Creating the initial state

We want to mint an asset with 400 coins to all of our managed keys, 500 to the second address we know of, and 600 to the second and third address. This sets up the state that will result from the Create Asset transaction.

_Note: This example assumes we have the keys already managed in our SwapChain's Keychain._

```js
const addresses = xchain.keyChain().getAddresses()

// Create outputs for the asset's initial state
const secpOutput1 = new SECPTransferOutput(
  new BN(400),
  new BN(400),
  1,
  addresses
)
const secpOutput2 = new SECPTransferOutput(new BN(500), new BN(400), 1, [
  addresses[1],
])
const secpOutput3 = new SECPTransferOutput(new BN(600), new BN(400), 1, [
  addresses[1],
  addresses[2],
])

// Populate the initialStates with the outputs
const initialState = new InitialStates()
initialState.addOutput(secpOutput1)
initialState.addOutput(secpOutput2)
initialState.addOutput(secpOutput3)
```

### Creating the signed transaction

Now that we know what we want an asset to look like, we create an output to send to the network. There is an AVM helper function `buildCreateAssetTx()` which does just that.

```js
// Fetch the UTXOSet for our addresses
const utxos = await xchain.getUTXOs(addresses)

// Make an unsigned Create Asset transaction from the data compiled earlier
const unsigned = await xchain.buildCreateAssetTx(
  utxos, // the UTXOSet containing the UTXOs we're going to spend
  addresses, // the addresses which will pay the fees
  addresses, // the addresses which recieve the change from the spent UTXOs
  initialState, // the initial state to be created for this new asset
  name, // the full name of the asset
  symbol, // a short ticker symbol for the asset
  denomination // the asse's denomination
)

const signed = unsigned.sign(xchain) // returns a Tx class
```

### Issue the signed transaction

Now that we have a signed transaction ready to send to the network, let's issue it!

Using the AxiaJS SwapChain API, we going to call the `issueTx` function. This function can take either the Tx class returned in the previous step, a CB58 representation of the transaction, or a raw Buffer class with the data for the transaction. Examples of each are below:

```js
// using the Tx class
const txid = await xchain.issueTx(signed) // returns a CB58 serialized string for the TxID
```

```js
// using the base-58 representation
const txid = await xchain.issueTx(signed.toString()) // returns a CB58 serialized string for the TxID
```

```js
// using the transaction Buffer
const txid = await xchain.issueTx(signed.toBuffer()) // returns a CB58 serialized string for the TxID
```

We assume ONE of those methods are used to issue the transaction.

### Get the status of the transaction

Now that we sent the transaction to the network, it takes a few seconds to determine if the transaction has gone through. We can get an updated status on the transaction using the TxID through the AVM API.

```js
// returns one of: "Accepted", "Processing", "Unknown", and "Rejected"
const status = await xchain.getTxStatus(txid)
```

The statuses can be one of "Accepted", "Processing", "Unknown", and "Rejected":

* "Accepted" indicates that the transaction has been accepted as valid by the network and executed
* "Processing" indicates that the transaction is being voted on.
* "Unknown" indicates that node knows nothing about the transaction, indicating the node doesn't have it
* "Rejected" indicates the node knows about the transaction, but it conflicted with an accepted transaction

### Identifying the newly created asset

The SwapChain uses the TxID of the transaction which created the asset as the unique identifier for the asset. This unique identifier is henceforth known as the "AssetID" of the asset. When assets are traded around the SwapChain, they always reference the AssetID that they represent.

## Example 3 &mdash; Sending An Asset

This example sends an asset in the SwapChain to a single recipient. The first step in this process is to create an instance of Axia connected to our Axia Platform endpoint of choice.

```js
import { Axia, BinTools, Buffer, BN } from "axia"

const myNetworkID = 12345 // default is 1, we want to override that for our local network
const axia = new axia.Axia(
  "localhost",
  9650,
  "http",
  myNetworkID
)
const xchain = axia.XChain() // returns a reference to the SwapChain used by AxiaJS
```

We're also assuming that the keystore contains a list of addresses used in this transaction.

### Getting the UTXO Set

The SwapChain stores all available balances in a datastore called Unspent Transaction Outputs (UTXOs). A UTXO Set is the unique list of outputs produced by transactions, addresses that can spend those outputs, and other variables such as lockout times (a timestamp after which the output can be spent) and thresholds (how many signers are required to spend the output).

For the case of this example, we're going to create a simple transaction that spends an amount of available coins and sends it to a single address without any restrictions. The management of the UTXOs will mostly be abstracted away.

However, we do need to get the UTXO Set for the addresses we're managing.

```js
const myAddresses = xchain.keyChain().getAddresses() // returns an array of addresses the KeyChain manages as buffers
const addressStrings = xchain.keyChain().getAddressStrings() // returns an array of addresses the KeyChain manages as strings
const u = await xchain.getUTXOs(myAddresses)
const utxos = u.utxos
```

### Spending the UTXOs

The `buildBaseTx()` helper function sends a single asset type. We have a particular assetID whose coins we want to send to a recipient address. This is an imaginary asset for this example which we believe to have 400 coins. Let's verify that we have the funds available for the transaction.

```js
const assetID = "8pfG5CTyL5KBVaKrEnCvNJR95dUWAKc1hrffcVxfgi8qGhqjm" // cb58 string
const mybalance = utxos.getBalance(myAddresses, assetID) // returns 400 as a BN
```

We have 400 coins! We're going to now send 100 of those coins to our friend's address.

```js
const sendAmount = new BN(100) // amounts are in BN format
const friendsAddress = "X-axc1k26jvfdzyukms95puxcceyzsa3lzwf5ftt0fjk" // address format is Bech32

// The below returns a UnsignedTx
// Parameters sent are (in order of appearance):
//   * The UTXO Set
//   * The amount being sent as a BN
//   * An array of addresses to send the funds
//   * An array of addresses sending the funds
//   * An array of addresses any leftover funds are sent
//   * The AssetID of the funds being sent
const unsignedTx = await xchain.buildBaseTx(
  utxos,
  sendAmount,
  [friendsAddress],
  addressStrings,
  addressStrings,
  assetID
)
const signedTx = xchain.signTx(unsignedTx)
const txid = await xchain.issueTx(signedTx)
```

And the transaction is sent!

### Get the status of the transaction

Now that we sent the transaction to the network, it takes a few seconds to determine if the transaction has gone through. We can get an updated status on the transaction using the TxID through the SwapChain.

```js
// returns one of: "Accepted", "Processing", "Unknown", and "Rejected"
const status = await xchain.getTxStatus(txid)
```

The statuses can be one of "Accepted", "Processing", "Unknown", and "Rejected":

* "Accepted" indicates that the transaction has been accepted as valid by the network and executed
* "Processing" indicates that the transaction is being voted on.
* "Unknown" indicates that node knows nothing about the transaction, indicating the node doesn't have it
* "Rejected" indicates the node knows about the transaction, but it conflicted with an accepted transaction

### Check the results

The transaction finally came back as "Accepted", now let's update the UTXOSet and verify that the transaction balance is as we expected.

*Note: In a real network the balance isn't guaranteed to match this scenario. Transaction fees or additional spends may vary the balance. For the purpose of this example, we assume neither of those cases.*

```js
const updatedU = await xchain.getUTXOs()
const updatedUTXOs = updatedU.utxos
const newBalance = updatedUTXOs.getBalance(myAddresses, assetID)
if (newBalance.toNumber() != mybalance.sub(sendAmount).toNumber()) {
  throw Error("heyyy these should equal!")
}
```

### Repo Dependency Updates

Dependabot will make pull requests against the development branch. If all tests pass, it is safe to merge into development, but for redundancy you want to try to build it locally.

```zsh
git fetch origin
git checkout -b <branchName>
git merge development
yarn build && yarn test
```

If the E2E check does not pass, go into the 'checks' section of the PR.
`https://github.com/sankar-boro/axiajs/pull/<PR number>/checks`

* Click on the `> E2E` tab on the left
* Click 'Re-run jobs' on the right
