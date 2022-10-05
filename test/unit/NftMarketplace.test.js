const { assert, expect } = require("chai")
const { network, ethers, getNamedAccounts, deployments } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("NFT Marketplace Unit Tests", function () {
          let nftMarketplace, basicNft, deployer, user
          const PRICE = ethers.utils.parseEther("0.1")
          const TOKEN_ID = 0
          beforeEach(async function () {
              //   deployer = (await getNamedAccounts()).deployer
              //   user = (await getNamedAccounts()).user
              const accounts = await ethers.getSigners()
              user = accounts[1]
              deployer = accounts[0]
              await deployments.fixture(["all"])
              nftMarketplace = await ethers.getContract("NftMarketplace")
              basicNft = await ethers.getContract("BasicNft")
              await basicNft.mintNft()
              await basicNft.approve(nftMarketplace.address, TOKEN_ID)
          })

          //   it("lists item and can be bought", async function () {
          //       await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
          //       const userConnectedNftMarketplace = nftMarketplace.connect(user)
          //       await userConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
          //           value: PRICE,
          //       })
          //       const newOwner = await basicNft.ownerOf(TOKEN_ID)
          //       const deployerProceeds = await nftMarketplace.getProceeds(deployer)
          //       assert(newOwner == user)
          //       assert(deployerProceeds.toString() == PRICE.toString())
          //   })
          //   describe("listItem", function () {
          //       it("reverts if already listed", async function () {
          //           await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
          //           await expect(
          //               nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
          //           ).to.be.revertedWith("NftMarketplace__AlreadyListed")
          //       })
          //       it("reverts if you are not owner", async function () {
          //           const userConnectedNftMarketplace = nftMarketplace.connect(user)
          //           await basicNft.approve(userConnectedNftMarketplace.address, TOKEN_ID)
          //           await expect(
          //               userConnectedNftMarketplace.listItem(basicNft, TOKEN_ID, PRICE)
          //           ).to.be.revertedWith("NftMarketplace__NotOwner")
          //       })
          //   })
      })
