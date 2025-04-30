const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

describe("FundMe", function () {
    let fundMe
    let mockV3Aggregator
    let deployer
    const sendValue = ethers.parseUnits("1", "ether")
    beforeEach(async function () {
        const accounts = await ethers.getSigners()
        deployer = accounts[0]
        const MockV3Aggregator =
            await ethers.getContractFactory("MockV3Aggregator")
        mockV3Aggregator = await MockV3Aggregator.deploy(8, 200000000000)
        const FundMe = await ethers.getContractFactory("FundMe", deployer)
        fundMe = await FundMe.deploy(mockV3Aggregator.target)
    })

    describe("constructor", function () {
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.getPriceFeed()
            assert.equal(response, mockV3Aggregator.target)
        })
    })

    describe("fund", function () {
        it("Fails if you don't send enough ETH", async function () {
            await expect(fundMe.fund()).to.be.revertedWith("Amount too low")
        })
        it("Updates the amount funded data structure", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.addressToAmountFunded(deployer.address)
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of getFunder", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.funders(0)
            assert.equal(response, deployer.address)
        })
    })
})
