// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

interface ISwarajToken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
}

interface IParties {
    function getParty(uint partyId) external view returns (
        string memory name,
        string memory symbol,
        uint256 registeredTime,
        address walletAddress
    );
}

contract StateVote {
    address public owner;
    uint public year;
    ISwarajToken public swarajToken;
    IParties public partiesContract;  

    struct Candidate {
        string name;
        uint partieid; 
        address walletAddress;
    }
    struct returnCantidate{
        string name;
        uint partieid; 
        address walletAddress;
        string symbol;
    }

    mapping(uint => Candidate) public candidate;
    mapping(string => uint[]) public stateCandidates;  

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    constructor(address _tokenAddress, address _partiesAddress) {
        swarajToken = ISwarajToken(_tokenAddress);
        partiesContract = IParties(_partiesAddress);
        year = block.timestamp;
        owner = msg.sender;
    }

    receive() external payable {
        revert("No Ether Allowed");
    }

    fallback() external payable {
        revert("No Ether Allowed");
    }

    function yearOfVoting() public view returns (uint) {
        return year;
    }

    function addCandidates(string memory name,address walletAddress,uint id,uint partieid,string memory state) public onlyOwner {
        // Verify that the party exists in the Parties contract
        (string memory partyName, , , ) = partiesContract.getParty(partieid);
        require(bytes(partyName).length > 0, "Party does not exist");

        require(bytes(name).length > 0, "Candidate name is required");
        require(walletAddress != address(0), "Invalid wallet address");
        require(bytes(state).length > 0, "State name is required");


        candidate[id] = Candidate(name, partieid, walletAddress);
        stateCandidates[state].push(id);
    }

    function getCandidatesByState(string memory state) public view returns (returnCantidate[] memory) {
        require(bytes(state).length > 0, "State name is required");

        uint[] memory candidateIds = stateCandidates[state];
        uint length = candidateIds.length;

        returnCantidate[] memory candidatesList = new returnCantidate[](length);

        for (uint i = 0; i < length; i++) {
            uint candidateId = candidateIds[i];
            Candidate storage c = candidate[candidateId];

            // Fetch party symbol from the Parties contract
            (, string memory symbol, , ) = partiesContract.getParty(c.partieid);

            candidatesList[i] = returnCantidate({
                name: c.name,
                partieid: c.partieid,
            walletAddress: c.walletAddress,
            symbol: symbol
        });
    }

    return candidatesList;
}

    function voteForCandidate(uint candidateId) public {
        require(candidate[candidateId].walletAddress != address(0), "Invalid candidate");
        address candidateWallet = candidate[candidateId].walletAddress;
        uint256 voterBalance = swarajToken.balanceOf(msg.sender);
        require(voterBalance > 0, "Not enough tokens");
        uint256 voteAmount = 1 * (10 ** swarajToken.decimals());
        require(voterBalance >= voteAmount, "Insufficient tokens");
        bool success = swarajToken.transferFrom(msg.sender, candidateWallet, voteAmount);
        require(success, "Token transfer failed");
        emit VoteCasted(msg.sender, candidateId);
    }

    event VoteCasted(address indexed voter, uint candidateId);
}
