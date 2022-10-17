# Decentralized NFT MarketPlace

## About The Project

* This is the back-end part of the Decentralized NFT Marketplace project, whose front-end code using Next.js and The Graph indexing protocol can be seen [here](https://github.com/narendra-sajwani/nextjs-nft-marketplace-the-graph)
* Another approach, I used to build the front-end of the project is using Next.js with Moralis server to index the events emitted by NFT Marketplace smart contract. The code for which can be seen [here](https://github.com/narendra-sajwani/nextjs-nft-marketplace-moralis)
* This is Full-Fleged backend project with necessary testing, utility and deployment scripts. 

## Functionalities
 * `listItem`: List NFTs on marketplace
 * `buyItem`: Buy the NFTs
 * `cancelItem`: Cancel a listing
 * `updateListing`: Update price
 * `withdrawProceeds`: Withdraw payment for my bought NFTs

<br>

## Getting Started

### Requirements

- [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - You'll know you did it right if you can run `git --version` and you see a response like `git version x.x.x`
- [Nodejs](https://nodejs.org/en/)
  - You'll know you've installed nodejs right if you can run:
    - `node --version` and get an ouput like: `vx.x.x`
- [Yarn](https://classic.yarnpkg.com/lang/en/docs/install/) instead of `npm`
  - You'll know you've installed yarn right if you can run:
    - `yarn --version` and get an output like: `x.x.x`
    - You might need to install it with `npm`

### Quickstart

```
git clone https://github.com/narendra-sajwani/hardhat-nft-marketplace.git
cd hardhat-nft-marketplace
yarn
```

### Usage

Deploy:

```
yarn hardhat deploy
```

### Testing

```
yarn hardhat test
```



### Deployment to a testnet or mainnet

1. Setup environment variabltes

You'll want to set your `GOERLI_RPC_URL` and `PRIVATE_KEY` as environment variables. You can add them to a `.env` file, similar to what you see in `.env.example`.

- `PRIVATE_KEY`: The private key of your account (like from [metamask](https://metamask.io/)). **NOTE:** FOR DEVELOPMENT, PLEASE USE A KEY THAT DOESN'T HAVE ANY REAL FUNDS ASSOCIATED WITH IT.
  - You can [learn how to export it here](https://metamask.zendesk.com/hc/en-us/articles/360015289632-How-to-Export-an-Account-Private-Key).
- `GOERLI_RPC_URL`: This is url of the goerli testnet node you're working with. You can get setup with one for free from [Alchemy](https://alchemy.com/?a=673c802981)

2. Get testnet ETH

Head over to [faucets.chain.link](https://faucets.chain.link/) and get some tesnet ETH. You should see the ETH show up in your metamask.

3. Deploy

```
yarn hardhat deploy --network goerli
```

## Thank you!

 