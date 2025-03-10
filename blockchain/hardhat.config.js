require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    geth: {
      url: "http://127.0.0.1:8547",
      accounts: ["dec0923d341c552dc9d36d02cac4aefaf997d62f857b5fe0b58b2dec0b0b27ff"]  // Replace with your actual private key
    },
  },
  solidity: "0.8.28",
}



// eth.sendTransaction({
//   from: "0xd1e05c2a3b759f1cb1d825b4993349a39526d920",
//   to: " 0xde67ef2e20d0700bac6a073c8d7e6892db12bcbb",
//   value: web3.toWei(10, "ether")
// })
