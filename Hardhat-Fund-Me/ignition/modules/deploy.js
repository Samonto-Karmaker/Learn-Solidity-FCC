// imports
const { ethers, run, network } = require("hardhat")
const deployMocks = require("./mock-deploy")
const {
    networkConfig,
    developmentChains,
} = require("../../helper-hardhat-config")
require("dotenv").config()
// main function
const main = async () => {
    console.log("Loading...")

    let priceFeedAddress
    if (developmentChains.includes(network.name)) {
        priceFeedAddress = await deployMocks()
    } else {
        priceFeedAddress = networkConfig[1115511].ethUsdPriceFeed
        if (!priceFeedAddress) {
            console.log("Price feed address not found")
            return
        }
    }
    console.log("Price feed address:", priceFeedAddress)

    console.log("Deploying contract...")
    try {
        const contractFactory = await ethers.getContractFactory("FundMe")
        const contract = await contractFactory.deploy(priceFeedAddress)
        console.log("Contract deployed:", contract.target)
        if (
            network.config.chainId === 11155111 &&
            process.env.ETHERSCAN_API_KEY
        ) {
            console.log("Waiting for block confirmations...")
            const tx = contract.deploymentTransaction()
            await tx.wait(6)
            await verify(contract.target, [priceFeedAddress])
        }
    } catch (err) {
        console.log(err)
    }
}
// verify function
const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (err) {
        if (err.message.toLowerCase().includes("already verified")) {
            console.log("Already verified")
        } else {
            console.log(err)
        }
    }
}
// call main function
main()
