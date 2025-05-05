import { ethers } from "./ethers-5.6.esm.min.js";

const connectButton = document.getElementById("connectButton");
connectButton.addEventListener("click", connectMetaMask);

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
