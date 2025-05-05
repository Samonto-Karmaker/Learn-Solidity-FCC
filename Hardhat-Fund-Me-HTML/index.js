import { contractABI, contractAddress } from "./constents.js";
import { ethers } from "./ether-5.6.esm.min.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");

connectButton.addEventListener("click", connectMetaMask);
fundButton.addEventListener("click", fundAccount);

async function connectMetaMask() {
    if (typeof window.ethereum !== "undefined") {
        try {
            // Request account access if needed
            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            });
            const account = accounts[0];
            console.log("Connected account:", account);

            connectButton.innerText = "Connected";
            connectButton.disabled = true;
            connectButton.style.backgroundColor = "#4CAF50"; // Green background
            connectButton.style.color = "#fff"; // White text
            connectButton.style.cursor = "not-allowed"; // Change cursor to not-allowed
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            alert("Error connecting to MetaMask. Please try again.");
        }
    } else {
        alert(
            "MetaMask is not installed. Please install it to use this feature."
        );
        connectButton.innerText = "Install MetaMask";
        connectButton.style.backgroundColor = "#f44336"; // Red background
    }
}

async function fundAccount() {
    const ethAmount = document.getElementById("ethAmount")
        ? document.getElementById("ethAmount").value
        : "0.01"; // Default value if input is not found
    console.log(`Funding with ${ethAmount} ETH`);
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        try {
            const tx = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            });
            console.log("Transaction sent:", tx);
            await tx.wait();
            console.log("Transaction mined:", tx);
            alert("Funding successful!");
        } catch (error) {
            console.error("Error funding account:", error);
            alert("Error funding account. Please check the console for details.");
        }
    } else {
        alert(
            "MetaMask is not installed. Please install it to use this feature."
        );
        connectButton.innerText = "Install MetaMask";
        connectButton.style.backgroundColor = "#f44336"; // Red background
    }
}
