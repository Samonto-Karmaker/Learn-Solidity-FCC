// imports
require("@nomicfoundation/hardhat-toolbox")
require("@nomicfoundation/hardhat-verify")
require("hardhat-gas-reporter")
require("solidity-coverage")
require("dotenv").config()
/** @type import('hardhat/config').HardhatUserConfig */
// environment variables
const SEPOLIA_RPC = process.env.SEPOLIA_ENDPOINT || "TEST_SEPOLIA_RPC"
const PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY || "PRIVATE_KEY"
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "ETHERSCAN_API_KEY"
const COINMARKETCAP_API_KEY =
    process.env.COINMARKETCAP_API_KEY || "COINMARKETCAP_API_KEY"
// export modules
module.exports = {
    solidity: "0.8.19",
    networks: {
        sepolia: {
            url: SEPOLIA_RPC,
            accounts: [PRIVATE_KEY],
            chainId: 11155111,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
            // no need for accounts
            chainId: 31337,
        },
    },
    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        enabled: true,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINMARKETCAP_API_KEY,
        gasPriceApi: `https://api.etherscan.io/api?module=proxy&action=eth_gasPrice&apikey=${ETHERSCAN_API_KEY}`,
    },
}
