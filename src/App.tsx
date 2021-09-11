import React from 'react';
import './App.css';
import { ethers, providers } from 'ethers';
import Greeter from './abis/Greeter.json';
// import { init } from "@textile/eth-storage";

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
      greetNew: "",
      getGreeting: "",
    }
    this.changeGreeting = this.changeGreeting.bind(this);
    this.changeGreetingInContract = this.changeGreetingInContract.bind(this);
  }

  async changeGreetingInContract(event: any) {
    event.preventDefault();
    console.log(this.state.greetNew)

    const provider = new providers.Web3Provider(window.ethereum);
    const wallet = provider.getSigner();
    this.setState({ wallet });
    const network = await provider.getNetwork();

    const networkData: any = Greeter.networks;
    const networkId: string = String(network.chainId);
    const contractAddress: string = networkData[networkId.toString()]['address'];
    const greeterContract = new ethers.Contract(
      contractAddress,
      Greeter.abi,
      wallet,
    );
    const txnResponse = await greeterContract.setGreeting(this.state.greetNew);
    const txnReceipt = await txnResponse.wait();
    console.log(txnReceipt);
    // try {
    //   const getGreeting = await greeterContract.greet();
    //   console.log(getGreeting)
    // } catch (e) {
    //   console.log(e)
    // }
  }

  changeGreeting(e: any) {
    console.log(e.target.value)
    this.setState({ greetNew: e.target.value })
  }

  async componentWillMount() {
    await this.initJustEther();
  }

  async initJustEther() {
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
    // if (SUPPORTED_NETWORKS.indexOf(network.name) === -1) {
    //   throw new Error(
    //     `Only ${SUPPORTED_NETWORK_LONG} networks are currently supported. Switch your wallet connection and refresh the webpage.`
    //   );
    // }
    this.setState({ address: await wallet.getAddress() })
    console.log(this.state.address)
    const networkData: any = Greeter.networks;
    const networkId: string = String(network.chainId);
    console.log(networkData);
    console.log(networkId)
    console.log(networkData[networkId.toString()]['address'])
    const contractAddress: string = networkData[networkId.toString()]['address'];
    const greeterContract = new ethers.Contract(
      contractAddress,
      Greeter.abi,
      provider,
    );
    try {
      const getGreeting = await greeterContract.greet();
      this.setState({getGreeting})
      // console.log(getGreeting)
    } catch (e) {
      console.log(e)
    }

  }

  render() {
      return (
        <div className= "App">

          <div >
            <header className="App-header">
              {
                this.state.getGreeting 
              }
              <p>
              {
                this.state.address
              }
              </p>
            </header>
          </div>
          <form>
            <input type="text" onChange =  { (e) => this.changeGreeting(e) }/>
            <button 
              type = "submit" 
              onClick = { (e) => this.changeGreetingInContract(e) }
              className = "btn btn-primary" > Change greeting </button>
          </form>
      </div>
      
    );
  }
}

export default App;
