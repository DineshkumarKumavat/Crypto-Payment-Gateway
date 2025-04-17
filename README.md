# 🪙 Crypto Payment Gateway

A secure and simple **Ethereum-based Crypto Payment Gateway** for e-commerce applications. This project enables users to purchase products using cryptocurrency, with added transaction security using `keccak256` hashing. The system is tested locally with **Ganache** and **MetaMask**.

## 🚀 Features

- 💳 Accepts crypto payments for products.
- 🧠 Built with a **single smart contract** for handling payments.
- 🔐 Extra security with `keccak256` hashing of transaction data.
- 🧾 Tracks payment history and displays transaction details.
- 🛍️ Includes a basic product catalog (frontend demo).
- 🔌 Integrates with **MetaMask** for seamless payment.
- 🧪 Tested on **Ganache** (local Ethereum blockchain).

---

## 🧱 Smart Contract

The core of the gateway is a single Solidity smart contract that:

- Accepts and logs payments.
- Verifies transaction data using `keccak256` for added integrity.
- Emits payment events for frontend integration.

Steps to test the project:
- Deploy the truffle project on Ganache
- Deploy the truffle project on Sepolia testnet
- Run Ganache on your system in the background
- Copy and paste the Ganache addresses in the Login Page to Do Password Mapping
- Copy the generated abi(.json) file from build and paste it to the abi in client/src/abi/ folder.
- Go to client folder and create a build using: npm build
- Start the frontend: npm start
