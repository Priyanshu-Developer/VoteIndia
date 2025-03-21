// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract Parties {
    address public owner;
   

    event PartyAdded(uint partyId, string name, string symbol);

    struct NationalParty {
        string name;
        string symbol;
        string logo;
        uint256 registeredTime;
    }

    mapping(uint => NationalParty) public Nationalparties;  
    uint[] public NationalpartyIds;

    struct ReturnNationalParty {
        uint256 partyId;
        string partyName;
        string partySymbol;
        string partyLogo;
        uint256 registeredTime;
    }

    struct StateParty {
        string name;
        string symbol;
        string logo;
        string state;
        uint256 registeredTime;
    }
    mapping(uint => StateParty) public Stateparties;  
    uint[] public StatepartyIds;

    struct ReturnStateParty {
        uint256 partyId;
        string partyName;
        string partySymbol;
        string partyLogo;
        string partystate;
        uint256 registeredTime;
    }
    /**
     * @dev Throws if called with ETH
     */

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
     * @dev Add a new national party
     * @param _name Name of the party
     * @param _symbol Symbol of the party
     * @param _logo Logo of the party
     */

    function addNationalParty(string memory _name, string memory _symbol, string memory _logo) public onlyOwner {
        for (uint i = 0; i < NationalpartyIds.length; i++) {
            require(keccak256(bytes(Nationalparties[NationalpartyIds[i]].name)) != keccak256(bytes(_name)), "Party name already exists");
            require(keccak256(bytes(Nationalparties[NationalpartyIds[i]].symbol)) != keccak256(bytes(_symbol)), "Party symbol already exists");
            require(keccak256(bytes(Nationalparties[NationalpartyIds[i]].logo)) != keccak256(bytes(_logo)), "Party logo already exists");
        }
        uint partyId = NationalpartyIds.length + 1;
        Nationalparties[partyId] = NationalParty(_name, _symbol, _logo, block.timestamp);
        NationalpartyIds.push(partyId);
        emit PartyAdded(partyId, _name, _symbol);
    }

    /**
     * @dev Retrieves details of a national party by its ID.
     * @param _partyId The unique identifier of the national party.
     * @return partyid The ID of the national party.
     * @return partyname The name of the national party.
     * @return partysymbol The symbol of the national party.
     * @return partylogo The logo of the national party.
     * @return registeredtime The timestamp when the party was registered.
     */
    
    function getNationalPartyById(uint _partyId) public view returns (uint partyid,string memory partyname,string memory partysymbol,string memory partylogo,uint256 registeredtime) {
        require(_partyId > 0 && _partyId <= NationalpartyIds.length, "Invalid party ID");
        return (_partyId,
            Nationalparties[_partyId].name,
            Nationalparties[_partyId].symbol,
            Nationalparties[_partyId].logo,
            Nationalparties[_partyId].registeredTime
        );
    }


    /**
     * @dev Retrieves details of a national party by its ID.
     * @param symbol The unique symbol of the national party.
     * @return partyid The ID of the national party.
     * @return partyname The name of the national party.
     * @return partysymbol The symbol of the national party.
     * @return partylogo The logo of the national party.
     * @return registeredtime The timestamp when the party was registered.
     */
    function getNationalPartyBySymbol(string memory symbol) public view returns (uint partyid,string memory partyname,string memory partysymbol,string memory partylogo,uint256 registeredtime) {
        for (uint i = 0; i < NationalpartyIds.length; i++) {
            uint partyId = NationalpartyIds[i];
            if (keccak256(bytes(Nationalparties[partyId].symbol)) == keccak256(bytes(symbol))) {
                return (partyId,
                    Nationalparties[partyId].name,
                    Nationalparties[partyId].symbol,
                    Nationalparties[partyId].logo,
                    Nationalparties[partyId].registeredTime
                );
            }
        }
        revert("Party with the given symbol not found");
    }

    
   /**
     * @dev Retrieves details of a national party by its ID.
     * @param name The name  of the national party.
     * @return partyid The ID of the national party.
     * @return partyname The name of the national party.
     * @return partysymbol The symbol of the national party.
     * @return partylogo The logo of the national party.
     * @return registeredtime The timestamp when the party was registered.
     */
    function getNationalPartyByName(string memory name) public view returns (uint partyid,string memory partyname,string memory partysymbol,string memory partylogo,uint256 registeredtime) {
        for (uint i = 0; i < NationalpartyIds.length; i++) {
            uint partyId = NationalpartyIds[i];
            if (keccak256(bytes(Nationalparties[partyId].name)) == keccak256(bytes(name))) {
                return (partyId,
                    Nationalparties[partyId].name,
                    Nationalparties[partyId].symbol,
                    Nationalparties[partyId].logo,
                    Nationalparties[partyId].registeredTime
                );
            }
        }
        revert("Party with the given name not found");
    }


    /**
     * @dev Get all national parties
     * @return allParties Array of all national parties
     */
    
    function getAllNationalParties() public view returns (ReturnNationalParty[] memory) {
        uint totalParties = NationalpartyIds.length;
        ReturnNationalParty[] memory allParties = new ReturnNationalParty[](totalParties);

        for (uint i = 0; i < totalParties; i++) {
            allParties[i] = ReturnNationalParty(NationalpartyIds[i], Nationalparties[NationalpartyIds[i]].name, Nationalparties[NationalpartyIds[i]].symbol, Nationalparties[NationalpartyIds[i]].logo, Nationalparties[NationalpartyIds[i]].registeredTime);
        }

        return allParties;
    }

    /**
     * @dev Add a new state party
     * @param _name Name of the party
     * @param _symbol Symbol of the party
     * @param _logo Logo of the party
     * @param _state State from which the party belongs
     */

    function addStateParty(string memory _name, string memory _symbol, string memory _logo, string memory _state) public onlyOwner {
        require(bytes(_name).length > 0, "Name is required");
        require(bytes(_symbol).length > 0, "Symbol is required");
        require(bytes(_logo).length > 0, "Logo is required");
        require(bytes(_state).length > 0, "From state is required");
        for (uint i = 0; i < StatepartyIds.length; i++) {
            require(keccak256(bytes(Stateparties[StatepartyIds[i]].name)) != keccak256(bytes(_name)), "Party name already exists");
            require(keccak256(bytes(Stateparties[StatepartyIds[i]].symbol)) != keccak256(bytes(_symbol)), "Party symbol already exists");
            require(keccak256(bytes(Stateparties[StatepartyIds[i]].logo)) != keccak256(bytes(_logo)), "Party logo already exists");
        }
        uint partyId = StatepartyIds.length + 1;
        Stateparties[partyId] = StateParty(_name, _symbol, _logo, _state, block.timestamp);
        StatepartyIds.push(partyId);
        emit PartyAdded(partyId, _name, _symbol);
    }
        /**
     * @dev Retrieves a state party by its ID.
     * @param _partyId The unique ID of the state party.
     * @return partyid The ID of the State party.
     * @return partyname The name of the State party.
     * @return partysymbol The symbol of the State party.
     * @return partylogo The logo of the State party.
     * @return partystate The state of th State party.
     * @return registeredtime The timestamp when the party was registered.
     */
    function getStatePartyById(uint _partyId) public view returns (uint partyid,string memory partyname,string memory partysymbol,string memory partylogo, string memory partystate ,uint256 registeredtime) {
        require(_partyId > 0 && _partyId <= StatepartyIds.length, "Invalid party ID");

        return (_partyId,
            Stateparties[_partyId].name,
            Stateparties[_partyId].symbol,
            Stateparties[_partyId].logo,
            Stateparties[_partyId].state,
            Stateparties[_partyId].registeredTime
        );
    }

    /**
     * @dev Retrieves a state party by its symbol.
     * @param symbol The unique symbol of the state party.
     * @return partyid The ID of the State party.
     * @return partyname The name of the State party.
     * @return partysymbol The symbol of the State party.
     * @return partylogo The logo of the State party.
     * @return partystate The state of th State party.
     * @return registeredtime The timestamp when the party was registered.
     * @notice The function reverts if no party is found with the given symbol.
     */
    function getStatePartyBySymbol(string memory symbol) public view returns (uint partyid,string memory partyname,string memory partysymbol,string memory partylogo, string memory partystate ,uint256 registeredtime) {
        for (uint i = 0; i < StatepartyIds.length; i++) {
            uint partyId = StatepartyIds[i];
            if (keccak256(bytes(Stateparties[partyId].symbol)) == keccak256(bytes(symbol))) {
                return (partyId,
                    Stateparties[partyId].name,
                    Stateparties[partyId].symbol,
                    Stateparties[partyId].logo,
                    Stateparties[partyId].state,
                    Stateparties[partyId].registeredTime
                );
            }
        }
        revert("Party with the given symbol not found");
    }

        /**
     * @dev Retrieves a state party by its name.
     * @param name The unique name of the state party.
     * @return partyid The ID of the State party.
     * @return partyname The name of the State party.
     * @return partysymbol The symbol of the State party.
     * @return partylogo The logo of the State party.
     * @return partystate The state of th State party.
     * @return registeredtime The timestamp when the party was registered.notice The function reverts if no party is found with the given name.
     */
    function getStatePartyByName(string memory name) public view returns (uint partyid,string memory partyname,string memory partysymbol,string memory partylogo, string memory partystate ,uint256 registeredtime) {
        for (uint i = 0; i < StatepartyIds.length; i++) {
            uint partyId = StatepartyIds[i];
            if (keccak256(bytes(Stateparties[partyId].name)) == keccak256(bytes(name))) {
                return (partyId,
                    Stateparties[partyId].name,
                    Stateparties[partyId].symbol,
                    Stateparties[partyId].logo,
                    Stateparties[partyId].state,
                    Stateparties[partyId].registeredTime
                );
            }
        }
        revert("Party with the given name not found");
    }


    /**
     * @dev Get all state parties
     * @return allParties Array of all state parties
     */
    function getAllStateParties() public view returns (ReturnStateParty[] memory) {
        uint totalParties = StatepartyIds.length;
        ReturnStateParty[] memory allParties = new ReturnStateParty[](totalParties);

        for (uint i = 0; i < totalParties; i++) {
            allParties[i] = ReturnStateParty(StatepartyIds[i], Stateparties[StatepartyIds[i]].name, Stateparties[StatepartyIds[i]].symbol, Stateparties[StatepartyIds[i]].logo, Stateparties[StatepartyIds[i]].state, Stateparties[StatepartyIds[i]].registeredTime);
        }

        return allParties;
    }
}
