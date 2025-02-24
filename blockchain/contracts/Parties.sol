// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Parties {
    address public owner;

    struct Party {
        string name;
        string symbol;
        uint256 registeredTime;

    }
    event PartyAdded(uint partyId, string name, string symbol);

    mapping(uint => Party) public parties;
    uint[] private partyIds; // To keep track of all party IDs

    error NoEtherAllowed();  // Custom error for rejecting ETH transfers

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    receive() external payable {
        revert NoEtherAllowed();  // Prevent direct ETH transfers
    }

    fallback() external payable {
        revert NoEtherAllowed();  // Prevent function calls with ETH
    }

    /**
     * @dev Adds a new political party to the contract.
     * @param partyId Unique identifier for the party.
     * @param partyName Name of the political party.
     * @param partySymbol Symbol representing the party.
     
     */
    function addParty(uint partyId,string memory partyName,string memory partySymbol) public onlyOwner {
        require(partyId != 0, "Invalid party ID");
        require(bytes(partyName).length > 0, "Party name required");
        require(bytes(partySymbol).length > 0, "Party symbol required");
        require(bytes(parties[partyId].name).length == 0, "Party ID already exists");

        // Store party details in mapping
        parties[partyId] = Party({
            name: partyName,
            symbol: partySymbol,
            registeredTime: block.timestamp
        });

        // Store party ID in an array for retrieval
        partyIds.push(partyId);
        emit PartyAdded(partyId, partyName, partySymbol);

    }

   
    function getParty(uint partyId) public view returns (string memory name,string memory symbol,uint256 registeredTime){
        require(bytes(parties[partyId].name).length > 0, "Party does not exist");

        Party memory p = parties[partyId];
        return (p.name, p.symbol, p.registeredTime);
    }

    /**
     * @dev Fetches all registered parties.
     * @return Array of all parties.
     */
    function getAllParties() public view returns (Party[] memory) {
        uint totalParties = partyIds.length;
        Party[] memory allParties = new Party[](totalParties);

        for (uint i = 0; i < totalParties; i++) {
            allParties[i] = parties[partyIds[i]];
        }

        return allParties;
    }
}
