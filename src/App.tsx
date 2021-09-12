import React from 'react';
import './App.css';
import { ethers, providers } from 'ethers';
import { init } from "@textile/eth-storage";

declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
}

const SUPPORTED_NETWORKS = ["matic", "maticmum", "rinkeby"];
const SUPPORTED_NETWORK_LONG =
  "Matic Mainnet, Matic Mumbai, and Ethereum Rinkeby";

class App extends React.Component <any, any> {

  constructor(props: any) {
    super(props)
    this.state = {
      wallet: null,
      address: "",
      blob: null,
      api: null,
      depositDone: false,
    }
    this.readFile = this.readFile.bind(this)
    this.uploadFile = this.uploadFile.bind(this)
  }

  async releaseFund() {
    console.log("releasing ..")
    this.state.api.releaseDeposit()
      .then(() => { console.log("if your session is over, your funds should be returned") })
      .catch((e: Error) => {
        console.log(e);
      })
  }

  readFile(event: any) {
    event.preventDefault()
    const file = event.target.files[0]
    console.log(file);
    this.setState({ blob: event.target.files[0]})
  }
  
  async uploadFile(event : any) {
    event.preventDefault();
    console.log("uploading");
    const result = await this.state.api.store(this.state.blob)
    console.log(result);
    console.log(result.cid["/"])
  }

  async componentWillMount() {
    await this.initEtherWithBridge();
  }

  async initEtherWithBridge() {
    if (!window.ethereum) {
      throw new Error(
        "No web3 provider found. Please install metamask browser extension."
      );
    }
    await (window.ethereum as any).enable();
    const provider = new providers.Web3Provider(window.ethereum);
    const wallet = provider.getSigner();
    this.setState({ wallet });
    const network = await provider.getNetwork();
    console.log(network);
    if (SUPPORTED_NETWORKS.indexOf(network.name) === -1) {
      throw new Error(
        `Only ${SUPPORTED_NETWORK_LONG} networks are currently supported. Switch your wallet connection and refresh the webpage.`
      );
    }
    this.setState({ address: await wallet.getAddress() })
    const api = await init(wallet);
    const address = await wallet.getAddress();
    this.setState({ api });
    console.log(api);
    console.log(address);

    api.hasDeposit().then(() => { this.setState({ depositDone: true }) })
  }

  depositFundIntoFilecoin() {
    console.log("depositing")
    this.state.api.addDeposit().then(() => { this.setState({depositDone: true})})
  }

  render() {

      const onStatus = async () => {
        const result = await this.state.api.status()
        console.log(result);
        console.log(result.status_code);
      };

      return (
        <div className= "App">

          <div >
            <header className="App-header">
              Hello
              <p>
              {
                this.state.address
              }
              </p>
            </header>
          </div>
              
          <button 
            onClick = { () => this.depositFundIntoFilecoin() }
            className = "btn btn-primary" > Deposit fund </button>
            
          {
            this.state.depositDone ? (
              <div>
                <button 
                  onClick = { () => this.releaseFund() }
                  className = "btn btn-primary" > Release fund </button>
                
                <form>
                  <input type="file" onChange =  { (e) => this.readFile(e) }/>
                  <button 
                    type = "submit" 
                    onClick = { (e) => this.uploadFile(e) }
                    className = "btn btn-primary" > upload file </button>
                </form>
                
              </div>
            ) : null
          }
          
      </div>
      
    );
  }
}

export default App;
