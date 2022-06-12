# Intro

This app is a simple demo for learning pursposes. I would like 
to thank [buildspace.so](https://buildspace.so/) for offering
this intuitive step-by-step project. The project consists of the following
artifacts: 

* A solidity contract which responsible to create the NFTs and 
 monitor ownership
* A react UI which allows users to mint their own NFTs
* Scripts to deploy the contract on Rinkeby and auto-create the first
3 NFTs.

Alchemy is used to deploy on Rinkeby network. 

# Next Steps

This projects builds NFTs using svgs and stores them on to the
blockchain. This method can be vary expensive. So the next steps is to 
store the nfts on ipfs and use a pinning service like infura or Pinnata.

# Basic Commands
This project was developed using Hardhat.

Try running some of the following tasks:

```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test
npx hardhat node
node scripts/sample-script.js
npx hardhat help
```
