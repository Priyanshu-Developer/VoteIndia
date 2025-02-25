// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface ISwarajToken {
    function balanceOf(address account) external view returns (uint256);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function decimals() external view returns (uint8);
    function allowance(address user, address spender) external view returns (uint256);
}

interface IParties {
    function getParty(uint partyId) external view returns (string memory name, string memory symbol, uint256 registeredTime);
}



contract CentralVote {
    address public owner;
    uint public electionYear;
    string public voteType;
    ISwarajToken public swarajToken;
    IParties public partiesContract;

    string[29] public states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
    "Uttar Pradesh", "Uttarakhand", "West Bengal"
];


    struct Candidate {
        uint256 partyId;
        string name;
        string image;
        uint256 totalVoteCount;
        mapping(string => uint256) stateVoteCount;
    }

    struct ReturnCandidate {
        string name;
        string image;
        uint256 partyId;
        uint256 totalVoteCount;
        string symbol;
    }

    mapping(uint256 => Candidate) public candidates;
    uint256 public candidateCount;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    event CandidateRegistered(uint256 candidateId, string name, uint256 partyId);
    event VoteCasted(address indexed voter, uint256 candidateId, string state, uint256 totalVotes, uint256 stateVotes);

    constructor(address _tokenAddress, address _partiesAddress, string memory _voteType) {
        swarajToken = ISwarajToken(_tokenAddress);
        partiesContract = IParties(_partiesAddress);
        electionYear = block.timestamp;
        voteType = _voteType;
        owner = msg.sender;
    }

    function registerCandidate(uint256 partyId, string memory name, string memory image) public onlyOwner {
        require(bytes(name).length > 0, "Candidate name is required");
        require(bytes(image).length > 0, "Image should be provided");

        (string memory partyName,, ) = partiesContract.getParty(partyId);
        require(bytes(partyName).length > 0, "Party does not exist");

        candidateCount++;
        candidates[candidateCount].partyId = partyId;
        candidates[candidateCount].name = name;
        candidates[candidateCount].image = image;
        candidates[candidateCount].totalVoteCount = 0;

        for (uint i = 0; i < states.length; i++) {
            candidates[candidateCount].stateVoteCount[states[i]] = 0;
        }

        emit CandidateRegistered(candidateCount, name, partyId);
    }

    function voteForCandidate(uint256 candidateId, string memory state) public {
        require(candidateId > 0 && candidateId <= candidateCount, "Candidate does not exist");
        require(bytes(state).length > 0, "State name is required");

        uint256 voteAmount = 1 * (10 ** swarajToken.decimals());
        uint256 voterBalance = swarajToken.balanceOf(msg.sender);
        require(voterBalance >= voteAmount, "Insufficient tokens");

        uint256 allowance = swarajToken.allowance(msg.sender, address(this));
        require(allowance >= voteAmount, "Not enough allowance, approve more tokens");

        bool success = swarajToken.transferFrom(msg.sender, address(this), voteAmount);
        require(success, "Token transfer failed");

        candidates[candidateId].totalVoteCount++;
        candidates[candidateId].stateVoteCount[state]++;

        emit VoteCasted(msg.sender, candidateId, state, candidates[candidateId].totalVoteCount, candidates[candidateId].stateVoteCount[state]);
    }

    function getCandidate(uint256 candidateId) public view returns (ReturnCandidate memory) {
        require(candidateId > 0 && candidateId <= candidateCount, "Candidate does not exist");

        Candidate storage candidate = candidates[candidateId];
        (, string memory partySymbol, ) = partiesContract.getParty(candidate.partyId);

        return ReturnCandidate({
            name: candidate.name,
            image: candidate.image,
            partyId: candidate.partyId,
            totalVoteCount: candidate.totalVoteCount,
            symbol: partySymbol
        });
    }
}
