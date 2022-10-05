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
          describe("listItem", function () {
              it("reverts if already listed", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__AlreadyListed")
              })
              it("reverts if you are not owner", async function () {
                  const userConnectedNftMarketplace = nftMarketplace.connect(user)
                  await expect(
                      userConnectedNftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("reverts if listing price isn't above zero", async function () {
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, 0)
                  ).to.be.revertedWith("NftMarketplace__PriceMustBeAboveZero")
              })
              it("reverts if marketplace isn't approved by owner", async function () {
                  await basicNft.approve(ethers.constants.AddressZero, TOKEN_ID)
                  await expect(
                      nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotApprovedForMarketplace")
              })
              it("updates the listings", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                  assert(listing.seller == deployer.address)
                  assert(listing.price.toString() == PRICE.toString())
              })
              it("emits an event upon listing", async function () {
                  expect(await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)).to.emit(
                      "ItemListed"
                  )
              })
          })

          describe("buyItem", function () {
              it("reverts if item is not listed", async function () {
                  await expect(
                      nftMarketplace.buyItem(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__NotListed")
              })
              it("reverts if price is not met", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  const userConnectedNftMarketplace = nftMarketplace.connect(user)
                  const amount = PRICE.sub(ethers.utils.parseEther("0.01"))
                  await expect(
                      userConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
                          value: amount.toString(),
                      })
                  ).to.be.revertedWith("NftMarketplace__PriceNotMet")
              })
              it("transfer the NFT and updates the listings and proceeds and emits an event", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  const userConnectedNftMarketplace = nftMarketplace.connect(user)
                  expect(
                      await userConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
                          value: PRICE,
                      })
                  ).to.emit("ItemBought")
                  const newOwner = await basicNft.ownerOf(TOKEN_ID)
                  const deployerProceeds = await nftMarketplace.getProceeds(deployer.address)
                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                  assert(newOwner == user.address)
                  assert(deployerProceeds.toString() == PRICE.toString())
                  assert(listing.seller == ethers.constants.AddressZero)
                  assert(listing.price.toString() == "0")
              })
          })

          describe("cancelListing", function () {
              it("reverts if item is not listed", async function () {
                  await expect(
                      nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__NotListed")
              })
              it("reverts if you are not the owner", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  const userConnectedNftMarketplace = nftMarketplace.connect(user)
                  await expect(
                      userConnectedNftMarketplace.cancelListing(basicNft.address, TOKEN_ID)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("emits an event after cancel listing and updates the listings", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  expect(await nftMarketplace.cancelListing(basicNft.address, TOKEN_ID)).to.emit(
                      "ListingCanceled"
                  )
                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                  assert(listing.seller == ethers.constants.AddressZero)
                  assert(listing.price.toString() == "0")
              })
          })

          describe("updateListing", function () {
              it("reverts if item is not listed", async function () {
                  await expect(
                      nftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotListed")
              })
              it("reverts if you are not the owner", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  const userConnectedNftMarketplace = nftMarketplace.connect(user)
                  await expect(
                      userConnectedNftMarketplace.updateListing(basicNft.address, TOKEN_ID, PRICE)
                  ).to.be.revertedWith("NftMarketplace__NotOwner")
              })
              it("emits an event after updation and updates the listings", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  const newPrice = ethers.utils.parseEther("0.1")
                  expect(
                      await nftMarketplace.updateListing(basicNft.address, TOKEN_ID, newPrice)
                  ).to.emit("ItemListed")
                  const listing = await nftMarketplace.getListing(basicNft.address, TOKEN_ID)
                  assert(listing.price.toString() == newPrice.toString())
              })
          })

          describe("withdrawProceeds", function () {
              it("reverts if there are no proceeds for you", async function () {
                  await expect(nftMarketplace.withdrawProceeds()).to.be.revertedWith(
                      "NftMarketplace__NoProceeds"
                  )
              })
              it("updates the proceeds mapping and transfer the proceeds", async function () {
                  await nftMarketplace.listItem(basicNft.address, TOKEN_ID, PRICE)
                  const userConnectedNftMarketplace = nftMarketplace.connect(user)
                  await userConnectedNftMarketplace.buyItem(basicNft.address, TOKEN_ID, {
                      value: PRICE,
                  })
                  const deployerProceedsBefore = await nftMarketplace.getProceeds(deployer.address)
                  const deployerBalanceBefore = await deployer.getBalance()
                  const tx = await nftMarketplace.withdrawProceeds()
                  const txReceipt = await tx.wait(1)
                  const { gasUsed, effectiveGasPrice } = txReceipt
                  const gasCost = gasUsed.mul(effectiveGasPrice)
                  const deployerProceedsAfter = await nftMarketplace.getProceeds(deployer.address)
                  const deployerBalanceAfter = await deployer.getBalance()
                  assert(
                      deployerBalanceAfter.add(gasCost).toString() ==
                          deployerProceedsBefore.add(deployerBalanceBefore).toString()
                  )
                  assert(
                      deployerProceedsBefore.sub(deployerProceedsAfter).toString() ==
                          PRICE.toString()
                  )
              })
          })
      })
