// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Parties {
    address public owner;

    struct Party {
        string name;
        string symbol;
        uint256 registeredTime;
        address walletAddress;
    }
    event PartyAdded(uint partyId, string name, string symbol, address walletAddress);

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
     * @param partyAddress Wallet address associated with the party.
     */
    function addParty(uint partyId,string memory partyName,string memory partySymbol,address partyAddress) public onlyOwner {
        require(partyAddress != address(0), "Invalid wallet address");
        require(partyId != 0, "Invalid party ID");
        require(bytes(partyName).length > 0, "Party name required");
        require(bytes(partySymbol).length > 0, "Party symbol required");
        require(bytes(parties[partyId].name).length == 0, "Party ID already exists");

        // Store party details in mapping
        parties[partyId] = Party({
            name: partyName,
            symbol: partySymbol,
            registeredTime: block.timestamp,
            walletAddress: partyAddress
        });

        // Store party ID in an array for retrieval
        partyIds.push(partyId);
        emit PartyAdded(partyId, partyName, partySymbol, partyAddress);

    }

    /**
     * @dev Fetch details of a party by its ID.
     * @param partyId Unique identifier of the party.
     * @return Party struct containing the party details.
     */
    function getParty(uint partyId) public view returns (string memory, string memory, uint256, address) {
        require(bytes(parties[partyId].name).length > 0, "Party does not exist");

        Party memory p = parties[partyId];
        return (p.name, p.symbol, p.registeredTime, p.walletAddress);
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
