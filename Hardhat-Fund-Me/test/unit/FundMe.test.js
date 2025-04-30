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
            const response = await fundMe.addressToAmountFunded(
                deployer.address,
            )
            assert.equal(response.toString(), sendValue.toString())
        })
        it("Adds funder to array of getFunder", async function () {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.funders(0)
            assert.equal(response, deployer.address)
        })
    })

    describe("withdraw", function () {
        beforeEach(async function () {
            await fundMe.fund({ value: sendValue })
        })

        it("withdraw ETH from a single funder", async function () {
            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target,
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target,
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                endingDeployerBalance.toString(),
                (
                    startingFundMeBalance +
                    startingDeployerBalance -
                    gasCost
                ).toString(),
            )
        })

        it("withdraw ETH from a multiple funders", async function () {
            const accounts = await ethers.getSigners()
            for (let i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i],
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }

            const startingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target,
            )
            const startingDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )

            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            const { gasUsed, gasPrice } = transactionReceipt
            const gasCost = gasUsed * gasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target,
            )
            const endingDeployerBalance = await ethers.provider.getBalance(
                deployer.address,
            )

            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                endingDeployerBalance.toString(),
                (
                    startingFundMeBalance +
                    startingDeployerBalance -
                    gasCost
                ).toString(),
            )

            expect(fundMe.funders(0)).to.be.reverted
            for (i = 1; i < 6; i++) {
                assert.equal(
                    await fundMe.addressToAmountFunded(accounts[i].address),
                    0,
                )
            }
        })

        it("only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const fundMeConnectedContract = await fundMe.connect(attacker)
            await expect(fundMeConnectedContract.withdraw()).to.be.revertedWithCustomError(
                fundMe,
                "FundMe__NotOwner",
            )
        })
    })
})
