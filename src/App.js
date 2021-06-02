import logo from './logo.svg';
import './App.css';
// import * as secp256k1 from 'secp256k1-native';
import * as secp256k1 from 'secp256k1';
import { randomBytes } from 'crypto';

const fromHexString = hexString =>
  new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));

const alicePrivateKeyHex = '0000000000000000000000000000000000000000000000000000000000000001'
const bobPrivateKeyHex = 'fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364140'
const expectedResultHex = 'fbd27dbb9e7f471bf3de3704a35e884e37d35c676dc2cc8c3cc574c3962376d2'


// generate privKey
function getPrivateKey(privateKeyHex) {

  while (true) {
    const privKey = fromHexString(privateKeyHex) //randomBytes(32)
    if (secp256k1.privateKeyVerify(privKey)) return privKey
  }
}

function getPublicKey(privateKeyHex) {

  while (true) {
    const privKey = getPrivateKey(privateKeyHex)
    if (secp256k1.privateKeyVerify(privKey)) {
      const pubKey = secp256k1.publicKeyCreate(privKey)
      return pubKey
    }
  }
}

// compressed public key from X and Y
function hashfn(x, y) {
  const pubKey = new Uint8Array(33)

  pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03
  pubKey.set(x, 1)
  return pubKey
}

function getSharedSecret(privateKeyOfSender, privateKeyOfRecipient) {
  // generate private and public keys

  const privKey = getPrivateKey(privateKeyOfSender)
  const pubKey = getPublicKey(privateKeyOfRecipient)
  console.log("privKey:", privKey);
  console.log("pubKey:", pubKey);


  // get X point of ecdh
  const sharedSecret = Buffer.alloc(32);
  secp256k1.ecdh(pubKey, privKey, {}, sharedSecret)
  console.log("sharedSecret:", sharedSecret.toString('hex'))
  console.log("expectedResult:", sharedSecret.toString('hex') === expectedResultHex)
}
function App() {
  getSharedSecret(alicePrivateKeyHex, bobPrivateKeyHex);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
