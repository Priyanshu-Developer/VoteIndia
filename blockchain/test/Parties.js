const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Parties Contract", function () {
    let Parties, parties, owner, addr1, addr2;

    beforeEach(async function () {
        [owner, addr1, addr2] = await ethers.getSigners();
        Parties = await ethers.getContractFactory("Parties");
        parties = await Parties.deploy(); 

        await parties.waitForDeployment(); 
    });

    it("Should deploy with correct owner", async function () {
        expect(await parties.owner()).to.equal(owner.address);
    });

    it("Should allow only the owner to add a party", async function () {
        await expect(
            parties.connect(addr1).addParty(1, "Liberty Party", "LP")
        ).to.be.revertedWith("Not the owner");

        await expect(
            parties.addParty(1, "Liberty Party", "LP")
        ).to.emit(parties, "PartyAdded");
    });

    it("Should store party details correctly", async function () {
        await parties.addParty(1, "Justice League", "JL");
        const party = await parties.getParty(1);

        expect(party[0]).to.equal("Justice League");
        expect(party[1]).to.equal("JL");
        expect(party[2]).to.be.a("bigint"); // Registered time
    });

    it("Should return all parties", async function () {
        await parties.addParty(1, "Liberty Party", "LP");
        await parties.addParty(2, "Justice League", "JL");

        const allParties = await parties.getAllParties();
        expect(allParties.length).to.equal(2);
        expect(allParties[0].name).to.equal("Liberty Party");
        expect(allParties[1].name).to.equal("Justice League");
    });

    it("Should reject ETH transfers", async function () {
        await expect(owner.sendTransaction({
            to: await parties.getAddress(), // ✅ Ensure `getAddress()` is used correctly
            value: ethers.parseEther("1")  // ✅ Use ethers.parseEther() for Ethers v6
        })).to.be.revertedWithCustomError(parties, "NoEtherAllowed"); // ✅ Check the correct error
    });
    

    it("Should revert when fetching a non-existent party", async function () {
        await expect(parties.getParty(99)).to.be.revertedWith("Party does not exist");
    });

    it("Should not allow duplicate party IDs", async function () {
        await parties.addParty(1, "Liberty Party", "LP");
        await expect(parties.addParty(1, "Another Party", "AP")).to.be.reverted;
    });

    it("Should validate inputs when adding a party", async function () {
        await expect(parties.addParty(0, "Liberty", "LP"))
            .to.be.revertedWith("Invalid party ID");

        await expect(parties.addParty(1, "", "LP"))
            .to.be.revertedWith("Party name required");

        await expect(parties.addParty(1, "Liberty", ""))
            .to.be.revertedWith("Party symbol required");
    });

});
