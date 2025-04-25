const { task } = require("hardhat/config")

task("block-number", "Prints the current block number").setAction(
    // taskArgs -> arguments passed to the task
    // hre -> hardhat runtime environment

    // hre is an object that contains all the information about the current environment
    // and the tools available to you, such as ethers, run, network, etc.
    async (taskArgs, hre) => {
        const blockNumber = await hre.ethers.provider.getBlockNumber()
        console.log(`Current block number: ${blockNumber}`)
    },
)
