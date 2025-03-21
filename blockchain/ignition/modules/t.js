const { ethers } = require("ethers");

const wallet = ethers.Wallet.createRandom();

console.log("Private Key:", wallet.privateKey);
console.log("Address:", wallet.address);


// Private Key: 0x24563146e4273837b9622aef24485ae0f417f65dea3459980a8edce93b4aa46b
// Address: 0xf7F5c357C6Cd0bF40260Fdddee33A96d88820aF9