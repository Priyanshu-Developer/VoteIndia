require('@nomicfoundation/hardhat-toolbox');

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337,
      // Persist state between restarts
      mining: {
        auto: true,
        interval: 5000
      },
      // Save state to file
      dbPath: "./hardhat-db",
    }
  },
  solidity: "0.8.28",
}
