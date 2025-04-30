const { network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

const DECIMALS = 8
const INITIAL_ANSWER = 200000000000 // $2000

async function deployMocks() {
    if (developmentChains.includes(network.name)) {
        console.log("Local network detected! Deploying mocks...")
        const MockV3AggregatorFactory =
            await ethers.getContractFactory("MockV3Aggregator")
        const mockV3Aggregator = await MockV3AggregatorFactory.deploy(
            DECIMALS,
            INITIAL_ANSWER,
        )
        console.log("Mocks Deployed at:", mockV3Aggregator.target)
        return mockV3Aggregator.target;
    }
}

module.exports = deployMocks
