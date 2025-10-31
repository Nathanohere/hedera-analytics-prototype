// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Compliance {
    event DatasetRegistered(bytes32 indexed datasetHash, address registrar, uint256 timestamp);
    function registerDataset(bytes32 datasetHash) external {
        emit DatasetRegistered(datasetHash, msg.sender, block.timestamp);
    }
}
