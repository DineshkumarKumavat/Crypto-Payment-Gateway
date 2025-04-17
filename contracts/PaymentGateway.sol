// SPDX-License-Identifier: MIT
// Declares the license for the smart contract
pragma solidity ^0.8.17; // Specifies the version of Solidity to use

// Declare the smart contract named 'PaymentGateway'
contract PaymentGateway {
    // Public state variable to store the address of the contract deployer (owner)
    address public owner;

    // Mapping to track which hashes have been used
    // This helps prevent replay attacks by ensuring the same transaction hash is not reused
    mapping(bytes32 => bool) public usedHashes;

    // Event that gets emitted every time a payment is successfully made
    // Includes information about sender, receiver, amount, product ID, timestamp, and transaction hash
    event PaymentMade(
        address indexed from,     // The address of the user who sent the payment
        address indexed to,       // The address of the recipient
        uint256 amount,           // Amount of Ether sent
        string productId,         // Identifier for the product or service purchased
        uint256 timestamp,        // Timestamp of when the transaction was initiated
        bytes32 txHash            // Unique hash of the transaction data (used for verification)
    );

    // Constructor function that sets the contract deployer as the owner
    constructor() {
        owner = msg.sender; // msg.sender is the address that deployed the contract
    }

    /*
     * Main function to make a secure payment
     * @param recipient - The address that will receive the funds
     * @param productId - An identifier string for the purchased product
     * @param timestamp - Timestamp to ensure the uniqueness and recency of the transaction
     * @param clientHash - A keccak256 hash generated on the client side to verify transaction data integrity
     */
    function payWithVerification(
        address payable recipient,    // Recipient address (must be payable to receive Ether)
        string memory productId,      // Product identifier (e.g., SKU or product code)
        uint256 timestamp,            // Timestamp of the payment, must match the one used when generating the hash
        bytes32 clientHash            // Hash sent from frontend (client) for verification
    ) public payable {
        // Ensure the payment is greater than 0
        require(msg.value > 0, "Payment must be greater than 0");

        // Generate the hash on-chain from the sender's input
        // Ensures the same exact data is used as what was hashed on the frontend
        bytes32 hash = keccak256(
            abi.encodePacked(msg.sender, recipient, msg.value, productId, timestamp)
        );

        // Verify that the hash matches what the client provided
        // If it doesn't, it may indicate tampering or incorrect parameters
        require(hash == clientHash, "Hash mismatch: possible tampering");

        // Check if this hash has already been used to prevent replay attacks
        require(!usedHashes[hash], "Hash already used: replay attack detected");

        // Mark this hash as used so it cannot be reused in the future
        usedHashes[hash] = true;

        // Transfer the payment to the recipient address
        recipient.transfer(msg.value);

        // Emit a PaymentMade event with all relevant transaction details
        emit PaymentMade(
            msg.sender,     // Who paid
            recipient,      // Who received
            msg.value,      // How much
            productId,      // For what product
            timestamp,      // When
            hash            // Verified transaction hash
        );
    }
}
