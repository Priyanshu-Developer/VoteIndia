const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StateVote Contract", function () {
    let StateVote, stateVote, SwarajToken, swarajToken, Parties, parties, owner, addr1, addr2, addr3;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3] = await ethers.getSigners();

        // Deploy mock SwarajToken contract
        SwarajToken = await ethers.getContractFactory("SwarajToken");
        swarajToken = await SwarajToken.deploy();
        await swarajToken.waitForDeployment();


        // Deploy mock Parties contract
        Parties = await ethers.getContractFactory("Parties");
        parties = await Parties.deploy();
        await parties.waitForDeployment();

        // Deploy StateVote contract with token and parties addresses
        StateVote = await ethers.getContractFactory("StateVote");
        stateVote = await StateVote.deploy(swarajToken.getAddress(), parties.getAddress());
        await stateVote.waitForDeployment();
    });

    describe("Contract Initialization", function () {
        it("Should set the correct token and parties contract addresses", async function () {
            expect(await stateVote.swarajToken()).to.equal(await swarajToken.getAddress());
            expect(await stateVote.partiesContract()).to.equal(await parties.getAddress());
        });

        it("Should set the correct owner", async function () {
            expect(await stateVote.owner()).to.equal(owner.address);
        });

        const { time } = require("@nomicfoundation/hardhat-network-helpers");

        it("Should store the correct year of voting", async function () {
            const contractYear = await stateVote.yearOfVoting(); // Get year from contract
            const currentYear = await time.latest(); // Get the latest block timestamp
            expect(Number(contractYear)).to.be.closeTo(Number(currentYear), 5); // Allow slight time difference
        });
    });

    describe("Adding Candidates", function () {
        it("Should allow only the owner to add candidates", async function () {
            await expect(
                stateVote.connect(addr1).addCandidates("John Doe", addr1.address, 1, 1, "Maharashtra")
            ).to.be.revertedWith("Not the owner");
        });

        it("Should not allow adding a candidate with an empty name", async function () {
            await parties.addParty(1, "Justice League", "JL", addr1.address);
            await expect(
                stateVote.addCandidates("", addr1.address, 1, 1, "Maharashtra")
            ).to.be.revertedWith("Candidate name is required");
        });

        it("Should not allow adding a candidate with an invalid wallet address", async function () {
            await parties.addParty(1, "Justice League", "JL", addr1.address);
            await expect(
                stateVote.addCandidates("John Doe",ethers.ZeroAddress, 1, 1, "Maharashtra")
            ).to.be.revertedWith("Invalid wallet address");
        });

        it("Should not allow adding a candidate with an empty state", async function () {
            await parties.addParty(1, "Justice League", "JL", addr1.address);
            await expect(
                stateVote.addCandidates("John Doe", addr1.address, 1, 1, "")
            ).to.be.revertedWith("State name is required");
        });

        it("Should not allow adding a candidate with a non-existent party", async function () {
            await parties.addParty(1, "Justice League", "JL", addr1.address);
            await expect(
                stateVote.addCandidates("John Doe", addr1.address, 1, 999, "Maharashtra") // Party ID 999 does not exist
            ).to.be.revertedWith("Party does not exist");
        });

        it("Should successfully add a candidate", async function () {
            await parties.addParty(1, "Justice League", "JL", addr1.address);
            await stateVote.addCandidates("John Doe", addr1.address, 1, 1, "Maharashtra");

            const candidate = await stateVote.candidate(1);
            expect(candidate.name).to.equal("John Doe");
            expect(candidate.walletAddress).to.equal(addr1.address);
            expect(candidate.partieid).to.equal(1);
        });
    });

    describe("Retrieving Candidates by State", function () {
        it("Should return an empty array if no candidates exist for the given state", async function () {
            const candidates = await stateVote.getCandidatesByState("Maharashtra");
            expect(candidates.length).to.equal(0);
        });

        it("Should return correct candidates with party symbols", async function () {
            await parties.addParty(1, "Justice League", "JL", addr1.address);
            await stateVote.addCandidates("John Doe", addr1.address, 1, 1, "Maharashtra");

            const candidates = await stateVote.getCandidatesByState("Maharashtra");

            expect(candidates.length).to.equal(1);
            expect(candidates[0].name).to.equal("John Doe");
            expect(candidates[0].partieid).to.equal(1);
            expect(candidates[0].walletAddress).to.equal(addr1.address);
            expect(candidates[0].symbol).to.equal("JL"); // Party symbol check
        });

        it("Should handle multiple candidates for the same state", async function () {
            await parties.addParty(1, "Democratic Party", "DP", addr1.address);
            await parties.addParty(2, "Republic Party", "RP", addr2.address);

            await stateVote.addCandidates("John Doe", addr1.address, 1, 1, "Maharashtra");
            await stateVote.addCandidates("Jane Smith", addr2.address, 2, 2, "Maharashtra");

            const candidates = await stateVote.getCandidatesByState("Maharashtra");

            expect(candidates.length).to.equal(2);
            expect(candidates[0].name).to.equal("John Doe");
            expect(candidates[0].symbol).to.equal("DP");
            expect(candidates[1].name).to.equal("Jane Smith");
            expect(candidates[1].symbol).to.equal("RP");
        });
    });

    describe("Voting", function () {
        it("Should allow voting only for valid candidates", async function () {
            await expect(
                stateVote.voteForCandidate(999)
            ).to.be.revertedWith("Invalid candidate");
        });

        it("Should revert if the voter has insufficient tokens", async function () {
            await parties.addParty(1, "Democratic Party", "DP", addr1.address);
            await stateVote.addCandidates("John Doe", addr1.address, 1, 1, "Maharashtra");

            await expect(
                stateVote.voteForCandidate(1)
            ).to.be.revertedWith("Not enough tokens");
        });

        it("Should successfully transfer tokens upon voting", async function () {
        
            console.log(owner.address)
            await parties.addParty(1, "Democratic Party", "DP", addr1.address);
            await stateVote.addCandidates("John Doe", addr1.address, 1, 1, "Maharashtra");
            // Mint tokens for voter (must be done by contract owner)
            await swarajToken.mint(owner.address, ethers.parseEther("3"));

            await swarajToken.connect(owner).depositGasFunds({ value: ethers.parseEther("0.005") });
            await swarajToken.batchTransfer([addr1.address, addr2.address, addr3.address]);

            expect(await swarajToken.balanceOf(addr1.address)).to.equal(ethers.parseUnits("1", 18));
            expect(await swarajToken.balanceOf(addr2.address)).to.equal(ethers.parseUnits("1", 18));
            expect(await swarajToken.balanceOf(addr3.address)).to.equal(ethers.parseUnits("1", 18));

            // Approve the contract to spend tokens
            await swarajToken.connect(addr2).approve(await stateVote.getAddress(), ethers.parseEther("1"));
            // Vote for candidate
            await expect(stateVote.connect(addr2).voteForCandidate(1))
                .to.emit(stateVote, "VoteCasted")
                .withArgs(addr2.address, 1);
        });
    });
});
