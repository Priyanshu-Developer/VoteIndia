const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Parties Contract", function () {
    let Parties, parties;
    let owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();
        Parties = await ethers.getContractFactory("Parties");
        parties = await Parties.deploy();
        await parties.waitForDeployment();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await parties.owner()).to.equal(owner.address);
        });
    });

    describe("Adding National Parties", function () {
        it("Should allow only the owner to add a national party", async function () {
            await expect(parties.connect(addr1).addNationalParty("Party A", "PA", "logoA"))
                .to.be.revertedWith("Not the owner");
        });

        it("Should add a national party successfully", async function () {
            await parties.addNationalParty("Party A", "PA", "logoA");
            await parties.addNationalParty("Party B", "PB", "logoB");
            await parties.addNationalParty("Party C", "PC", "logoC");
            const party = await parties.getNationalPartyById(1);
            const party2 = await parties.getNationalPartyById(2);
            const party3 = await parties.getNationalPartyById(3);

            console.log(party);
            console.log(party2);
            console.log(party3);

            expect(party.partyName).to.equal("Party A");
            expect(party2.partyName).to.equal("Party B");
            expect(party3.partyName).to.equal("Party C");
            
            
        });

        it("Should prevent duplicate party names, symbols, or logos", async function () {
            await parties.addNationalParty("Party A", "PA", "logoA");
            await expect(parties.addNationalParty("Party A", "PB", "logoB"))
                .to.be.revertedWith("Party name already exists");
            await expect(parties.addNationalParty("Party B", "PA", "logoB"))
                .to.be.revertedWith("Party symbol already exists");
            await expect(parties.addNationalParty("Party C", "PC", "logoA"))
                .to.be.revertedWith("Party logo already exists");
        });
    });

    describe("Retrieving National Parties", function () {
        beforeEach(async function () {
            await parties.addNationalParty("Party A", "PA", "logoA");
        });

        it("Should retrieve a national party by ID", async function () {
            const party = await parties.getNationalPartyById(1);
            expect(party.partyName).to.equal("Party A");
        });

        it("Should retrieve a national party by symbol", async function () {
            const party = await parties.getNationalPartyBySymbol("PA");
            expect(party.partyName).to.equal("Party A");
        });

        it("Should retrieve a national party by name", async function () {
            const party = await parties.getNationalPartyByName("Party A");
            expect(party.partySymbol).to.equal("PA");
        });
    });

    describe("Adding State Parties", function () {
        it("Should allow only the owner to add a state party", async function () {
            await expect(parties.connect(addr1).addStateParty("State Party A", "SPA", "logoSPA", "StateX"))
                .to.be.revertedWith("Not the owner");
        });

        it("Should add a state party successfully", async function () {
            await parties.addStateParty("State Party A", "SPA", "logoSPA", "StateX");
            const party = await parties.getStatePartyById(1);
            expect(party.partyName).to.equal("State Party A");
            expect(party.partystate).to.equal("StateX");
        });

        it("Should prevent duplicate state party names, symbols, or logos", async function () {
            await parties.addStateParty("State Party A", "SPA", "logoSPA", "StateX");
            await expect(parties.addStateParty("State Party A", "SPB", "logoSPB", "StateY"))
                .to.be.revertedWith("Party name already exists");
            await expect(parties.addStateParty("State Party B", "SPA", "logoSPB", "StateY"))
                .to.be.revertedWith("Party symbol already exists");
            await expect(parties.addStateParty("State Party C", "SPC", "logoSPA", "StateZ"))
                .to.be.revertedWith("Party logo already exists");
        });
    });

    describe("Retrieving State Parties", function () {
        beforeEach(async function () {
            await parties.addStateParty("State Party A", "SPA", "logoSPA", "StateX");
        });

        it("Should retrieve a state party by ID", async function () {
            const party = await parties.getStatePartyById(1);
            expect(party.partyName).to.equal("State Party A");
        });

        it("Should retrieve a state party by symbol", async function () {
            const party = await parties.getStatePartyBySymbol("SPA");
            expect(party.partyName).to.equal("State Party A");
        });

        it("Should retrieve a state party by name", async function () {
            const party = await parties.getStatePartyByName("State Party A");
            expect(party.partySymbol).to.equal("SPA");
        });
    });

    describe("ETH Transfer Prevention", function () {
        it("Should reject ETH sent to the contract", async function () {
            await expect(owner.sendTransaction({ to: parties.address, value: ethers.utils.parseEther("1") }))
                .to.be.revertedWithCustomError(parties, "NoEtherAllowed");
        });
    });
});
