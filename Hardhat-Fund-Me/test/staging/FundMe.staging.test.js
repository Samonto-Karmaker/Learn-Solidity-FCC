const { network, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
const { assert } = require("chai")
require("dotenv").config()

developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe Staging Tests", function () {
          let fundMe
          let deployer

          const fundMeAddress = process.env.FUND_ME_ADDRESS
          const sendValue = ethers.parseUnits("0.001", "ether")
          beforeEach(async function () {
              const accounts = await ethers.getSigners()
              deployer = accounts[0]
              fundMe = await ethers.getContractAt(
                  "FundMe",
                  fundMeAddress,
                  deployer,
              )
          })

          it("allows people to fund and withdraw", async function () {
              const fundTxResponse = await fundMe.fund({ value: sendValue })
              await fundTxResponse.wait(1)
              const withdrawTxResponse = await fundMe.withdraw()
              await withdrawTxResponse.wait(1)

              const endingFundMeBalance = await ethers.provider.getBalance(
                  fundMe.target,
              )
              console.log(
                  endingFundMeBalance.toString() +
                      " should equal 0, running assert equal...",
              )
              assert.equal(endingFundMeBalance.toString(), "0")
          })
      })
