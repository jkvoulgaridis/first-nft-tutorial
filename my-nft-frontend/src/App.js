import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React from "react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import myEpicNft from './utils/MyEpicNFT.json';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const CONTRACT_ADDRESS = "0xeF96a41eca0C17Ac1b6e5771C3498272646bEbc2";

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletIsConnected = async () => {
        const { ethereum } = window;

        if (!ethereum) {
            console.log("Make sure you have metamask!");
            return;
        } else {
            console.log("We have the ethereum object", ethereum);
        }

        /*
        * Check if we're authorized to access the user's wallet
        */
        const accounts = await ethereum.request({ method: 'eth_accounts' });

        /*
        * User can have multiple authorized accounts, we grab the first one if its there!
        */
        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log("Found an authorized account:", account);
          setCurrentAccount(account);
          setupEventListener();
        } else {
          console.log("No authorized account found");
        }
      }

    const connectWallet = async () => {
        try {
          const { ethereum } = window;

          if (!ethereum) {
            alert("Get MetaMask!");
            return;
          }

          /*
          * Fancy method to request access to account.
          */
          const accounts = await ethereum.request({ method: "eth_requestAccounts" });

          /*
          * Boom! This should print out public address once we authorize Metamask.
          */
          console.log("Connected", accounts[0]);
          setCurrentAccount(accounts[0]);
          setupEventListener();
        } catch (error) {
          console.log(error);
        }
      }

    const setupEventListener = async () => {
    // Most of this looks the same as our function askContractToMintNft
    try {
      const { ethereum } = window;

      if (ethereum) {
        // Same stuff again
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
    }


    const askContractToMintNft = async () => {
      try {
        const { ethereum } = window;

        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

          console.log("Going to pop wallet now to pay gas...")
          let nftTxn = await connectedContract.makeAnEpicNFT(3);

          console.log("Mining...please wait.")
          await nftTxn.wait();

          console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

        } else {
          console.log("Ethereum object doesn't exist!");
        }
      } catch (error) {
        console.log(error)
      }
    }

    const renderNotConnectedContainer = () => (
        <button onClick={connectWallet} className="cta-button connect-wallet-button">
          Connect to Wallet
        </button>
    );


    useEffect(() => {
    checkIfWalletIsConnected();
    }, [])

   return (
       <div className="App">
         <div className="container">
           <div className="header-container">
             <p className="header gradient-text">My NFT Collection</p>
             <p className="sub-text">
               Each unique. Each beautiful. Discover your NFT today.
             </p>
             {currentAccount === "" ? (
               renderNotConnectedContainer()
             ) : (
               <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
                 Mint NFT
               </button>
             )}
           </div>
           <div className="footer-container">
             <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
             <a
               className="footer-text"
               href={TWITTER_LINK}
               target="_blank"
               rel="noreferrer"
             >{`built on @${TWITTER_HANDLE}`}</a>
           </div>
         </div>
       </div>
     );
   };
export default App;
