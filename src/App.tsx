import React from 'react';
import './App.css';
import { ethers, providers } from 'ethers';
import AnimeCrypto from './abis/AnimeCrypto.json';
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
      contractName: "",
      randomImage: null,
    }
  }

  async changeGreetingInContract(event: any) {
    event.preventDefault();
    console.log(this.state.greetNew)

    const provider = new providers.Web3Provider(window.ethereum);
    const wallet = provider.getSigner();
    this.setState({ wallet });
    const network = await provider.getNetwork();

    const networkData: any = AnimeCrypto.networks;
    const networkId: string = String(network.chainId);
    const contractAddress: string = networkData[networkId.toString()]['address'];
    const contract = new ethers.Contract(
      contractAddress,
      AnimeCrypto.abi,
      wallet,
    );
    // const txnResponse = await contract.setGreeting(this.state.greetNew);
    // const txnReceipt = await txnResponse.wait();
    // console.log(txnReceipt);
  }

  async componentWillMount() {
    await this.initJustEther();
  }

  async componentDidMount() {
    const res = await fetch('http://127.0.0.1:8000');
    const reader = res.body?.getReader();
    const stream = await reader?.read();
    const value = stream?.value;
    // console.log(value)
    // console.log(value?.buffer)
    const buffer = value?.buffer
    if (buffer) {
      const imageURL = URL.createObjectURL(
        new Blob([buffer], { type: 'image/png' })
      );
      this.setState({ randomImage: imageURL })
    }
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
    if (SUPPORTED_NETWORKS.indexOf(network.name) === -1) {
      throw new Error(
        `Only ${SUPPORTED_NETWORK_LONG} networks are currently supported. Switch your wallet connection and refresh the webpage.`
      );
    }
    this.setState({ address: await wallet.getAddress() })
    console.log(this.state.address)
    const networkData: any = AnimeCrypto.networks;
    const networkId: string = String(network.chainId);
    console.log(networkData);
    console.log(networkId)
    const contractAddress: string = networkData[networkId.toString()]['address'];
    const greeterContract = new ethers.Contract(
      contractAddress,
      AnimeCrypto.abi,
      provider,
    );
    try {
      const contractName = await greeterContract.name();
      this.setState({contractName})
    } catch (e) {
      console.log(e)
    }
  }

  render() {
      return (
        <div>
          <div>
              {this.state.contractName}
              <p>
              {this.state.address}
              </p>
              <img src={this.state.randomImage} alt = "RandomImage" width="500" height="600" />
        </div>
      </div>
    );
  }
}

export default App;
