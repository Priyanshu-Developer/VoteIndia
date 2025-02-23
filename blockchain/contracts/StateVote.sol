// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract StateVote {
    address public owner;
    uint public year;

    struct Candidate {
        string name;
        address walletAddress;
    }

    error NoEtherAllowed();  // Custom error for rejecting ETH transfers

    mapping(uint => Candidate) public candidate;
    mapping(string => uint[]) public stateCandidates;  // Mapping state to candidate IDs

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        year = block.timestamp;
        owner = msg.sender;
    }

    receive() external payable {
        revert NoEtherAllowed();  // Prevent direct ETH transfers
    }

    fallback() external payable {
        revert NoEtherAllowed();  // Prevent function calls with ETH
    }

    function yearOfVoting() public view returns (uint) {
        return year;
    }

    function addCandidates(string memory name, address walletAddress, uint id, string memory state) public onlyOwner {
        require(bytes(name).length > 0, "Candidate name is required");
        require(walletAddress != address(0), "Invalid wallet address");
        require(bytes(state).length > 0, "State name is required");

        candidate[id] = Candidate(name, walletAddress);
        stateCandidates[state].push(id);
    }

    function getCandidatesByState(string memory state) public view returns (Candidate[] memory) {
        require(bytes(state).length > 0, "State name is required");
        
        uint[] memory candidateIds = stateCandidates[state];
        Candidate[] memory candidatesList = new Candidate[](candidateIds.length);

        for (uint i = 0; i < candidateIds.length; i++) {
            candidatesList[i] = candidate[candidateIds[i]];
        }
        return candidatesList;
    }
}
