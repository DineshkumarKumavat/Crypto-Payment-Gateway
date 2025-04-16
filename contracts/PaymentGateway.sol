// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract PaymentGateway {
    address public owner;

    // Used hash map to prevent replay attacks
    mapping(bytes32 => bool) public usedHashes;

    event PaymentMade(
        address indexed from,
        address indexed to,
        uint256 amount,
        string productId,
        uint256 timestamp,
        bytes32 txHash
    );

    constructor() {
        owner = msg.sender;
    }

    // A function to add extra layer of security to the transaction
    // keccak256(...): Creates a unique fingerprint of the tx input
    // usedHashes: Ensures no hash is reused (prevents replay attacks)
    // timestamp: Makes the hash time-sensitive
    function payWithVerification(
        address payable recipient,
        string memory productId,
        uint256 timestamp,
        bytes32 clientHash
    ) public payable {
        require(msg.value > 0, "Payment must be greater than 0");

        // Recreate the hash on-chain using sender, recipient, amount, product ID and timestamp
        bytes32 hash = keccak256(
            abi.encodePacked(msg.sender, recipient, msg.value, productId, timestamp)
        );

        require(hash == clientHash, "Hash mismatch: possible tampering");
        require(!usedHashes[hash], "Hash already used: replay attack detected");

        usedHashes[hash] = true;

        // Transfer the payment
        recipient.transfer(msg.value);

        emit PaymentMade(
            msg.sender,
            recipient,
            msg.value,
            productId,
            timestamp,
            hash
        );
    }
}
