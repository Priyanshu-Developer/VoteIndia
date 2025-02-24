const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("StateVote Contract", function () {
    let StateVote, stateVote, SwarajToken, swarajToken, Parties, parties, owner, addr1, addr2, addr3, addr4;

    beforeEach(async function () {
        [owner, addr1, addr2, addr3, addr4] = await ethers.getSigners();

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

        // Add a party for testing
        await parties.addParty(1, "Democratic Party", "DP");
    });

    describe("Deployment", function () {
        it("Should set the correct owner", async function () {
            expect(await stateVote.owner()).to.equal(owner.address);
        });

        it("Should set the correct token and parties contract addresses", async function () {
            expect(await stateVote.swarajToken()).to.equal(await swarajToken.getAddress());
            expect(await stateVote.partiesContract()).to.equal(await parties.getAddress());
        });
    });

    describe("Adding Candidates", function () {
        it("Should allow only the owner to add a candidate", async function () {
            await expect(
                stateVote.connect(addr1).addCandidates("John Doe", 1, 1, "Maharashtra")
            ).to.be.revertedWith("Not the owner");
        });

        it("Should allow owner to add a candidate successfully", async function () {
            await expect(stateVote.connect(owner).addCandidates("John Doe", 1, 1, "Maharashtra"))
                .to.emit(stateVote, "CandidateAdded")
                .withArgs("John Doe", 1, 0);

            const candidate = await stateVote.candidate(1);
            expect(candidate.name).to.equal("John Doe");
            expect(candidate.partieid).to.equal(1);
            expect(candidate.votecount).to.equal(0);
        });

        it("Should not allow adding a candidate with an empty name", async function () {
            await expect(
                stateVote.addCandidates("", 1, 1, "Maharashtra")
            ).to.be.revertedWith("Candidate name is required");
        });
    });

    describe("Fetching Candidates by State", function () {
        it("Should return correct candidates for a state", async function () {
            await stateVote.addCandidates("John Doe", 1, 1, "Maharashtra");

            const candidates = await stateVote.getCandidatesByState("Maharashtra");
            expect(candidates.length).to.equal(1);
            expect(candidates[0].name).to.equal("John Doe");
        });

        it("Should return an empty array if no candidates exist", async function () {
            const candidates = await stateVote.getCandidatesByState("UnknownState");
            expect(candidates.length).to.equal(0);
        });
    });

    describe("Voting Mechanism", function () {

        it("Should allow a voter to vote successfully", async function () {
            await swarajToken.mint(owner.address, ethers.parseEther("5"));
            await swarajToken.connect(owner).depositGasFunds({ value: ethers.parseEther("0.010") });
            await swarajToken.batchTransfer([addr1.address, addr2.address, addr3.address,addr4.address]);
            const voteAmount = ethers.parseUnits("1", 18);

            await stateVote.addCandidates("John Doe", 1, 1, "Maharashtra");


        
            await swarajToken.connect(addr1).approve(stateVote.target, voteAmount);
            await expect(stateVote.connect(addr1).voteForCandidate(1))
                .to.emit(stateVote, "VoteCasted")    
                .withArgs(addr1.address, 1, 1);

            const candidate = await stateVote.candidate(1);
            expect(candidate.votecount).to.equal(1);
        });

        it("Should not allow a voter with insufficient tokens to vote", async function () {
            await swarajToken.mint(owner.address, ethers.parseEther("5"));
            await swarajToken.connect(owner).depositGasFunds({ value: ethers.parseEther("0.010") });
            const voteAmount = ethers.parseUnits("1", 18);
            await stateVote.addCandidates("John Doe", 1, 1, "Maharashtra");
            await swarajToken.connect(addr1).approve(stateVote.target, voteAmount);
            await expect(stateVote.connect(addr3).voteForCandidate(1))
                .to.be.revertedWith("Insufficient tokens");
        });
    });

    describe("Security & Edge Cases", function () {

        it("Should not allow invalid candidate IDs for voting", async function () {
            await swarajToken.mint(owner.address, ethers.parseEther("5"));
            await swarajToken.connect(owner).depositGasFunds({ value: ethers.parseEther("0.010") });
            await swarajToken.batchTransfer([addr1.address, addr2.address, addr3.address,addr4.address]);
            const voteAmount = ethers.parseUnits("1", 18);
            await swarajToken.connect(addr2).approve(stateVote.target, voteAmount);
            await expect(stateVote.connect(addr2).voteForCandidate(999))
                .to.be.revertedWith("Candidate does not exist");
        });
    });

    describe('Actual Voting ', () => {
      it("Working of actual Voting System ",async () => {
        await swarajToken.mint(owner.address, ethers.parseUnits("1000", 18));
        expect(await swarajToken.balanceOf(owner.address)).to.equal(ethers.parseUnits("1000", 18));

        await swarajToken.connect(owner).depositGasFunds({ value: ethers.parseEther("0.010") });

        await swarajToken.batchTransfer([addr1.address, addr2.address, addr3.address,addr4.address]);

        const voteAmount = ethers.parseUnits("1", 18);

        await swarajToken.connect(addr1).approve(stateVote.target, voteAmount);
        await swarajToken.connect(addr2).approve(stateVote.target, voteAmount);
        await swarajToken.connect(addr3).approve(stateVote.target, voteAmount);
        await swarajToken.connect(addr4).approve(stateVote.target, voteAmount);

        await parties.addParty(2, "Democratic Republic", "DR");

        await stateVote.addCandidates("John Doe", 1, 1, "Maharashtra");
        await stateVote.addCandidates("John baba", 2, 2, "Maharashtra");



        await expect(stateVote.connect(addr1).voteForCandidate(1)).to.emit(stateVote, "VoteCasted").withArgs(addr1.address, 1, 1);
        await expect(stateVote.connect(addr2).voteForCandidate(1)).to.emit(stateVote, "VoteCasted").withArgs(addr2.address, 1, 2);
        await expect(stateVote.connect(addr3).voteForCandidate(2)).to.emit(stateVote, "VoteCasted").withArgs(addr3.address, 2, 1);
        await expect(stateVote.connect(addr4).voteForCandidate(1)).to.emit(stateVote, "VoteCasted").withArgs(addr4.address, 1, 3);
        





      })
    })
    
});