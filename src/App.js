import logo from './logo.svg';
import './App.css';
// import * as secp256k1 from 'secp256k1-native';
import * as secp256k1 from 'secp256k1';
import { randomBytes } from 'crypto';

// generate privKey
function getPrivateKey () {
  while (true) {
    const privKey = randomBytes(32)
    if (secp256k1.privateKeyVerify(privKey)) return privKey
  }
}

// compressed public key from X and Y
function hashfn (x, y) {
  const pubKey = new Uint8Array(33)
  pubKey[0] = (y[31] & 1) === 0 ? 0x02 : 0x03
  pubKey.set(x, 1)
  return pubKey
}

function getSharedSecret(){
  // generate private and public keys
  const privKey = getPrivateKey()
  const pubKey = secp256k1.publicKeyCreate(getPrivateKey())
  console.log("privKey:", privKey);
  console.log("pubKey:", pubKey);

  // get X point of ecdh
  const sharedSecret = Buffer.alloc(33);
  secp256k1.ecdh(pubKey, privKey, { hashfn }, sharedSecret)
  console.log("sharedSecret:", sharedSecret.toString('hex'))
}
function App() {
  getSharedSecret();
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
