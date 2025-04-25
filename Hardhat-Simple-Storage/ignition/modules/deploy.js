// imports
const { ethers, run, network } = require("hardhat")
require("dotenv").config()
// main function
const main = async () => {
    console.log("Deploying contract...")
    try {
        const contractFactory = await ethers.getContractFactory("SimpleStorage")
        const contract = await contractFactory.deploy()
        console.log("Contract deployed:", contract.target)
        if (
            network.config.chainId === 11155111 &&
            process.env.ETHERSCAN_API_KEY
        ) {
            console.log("Waiting for block confirmations...")
            const tx = contract.deploymentTransaction()
            await tx.wait(6)
            await verify(contract.target, [])
        }

        // Interact with the contract
        // pure and view functions do not require a transaction, so we can call them directly
        const currentValue = await contract.retrieve()
        console.log("Current value:", currentValue)

        // Other functions require a transaction, so we need to send a transaction
        // and wait for it to be mined
        console.log("Storing value...")
        const transactionResponse = await contract.store(42)
        const transactionReceipt = await transactionResponse.wait(1)
        const updatedValue = await contract.retrieve()
        console.log("Updated value:", updatedValue)
        console.log("Transaction receipt:", transactionReceipt)
        console.log("Transaction hash:", transactionReceipt.transactionHash)
        console.log("Block number:", transactionReceipt.blockNumber)
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
