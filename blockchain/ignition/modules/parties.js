import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("PartiesModule", (m) => {
  const parties = m.contract("Parties", []);

  return { parties };
});
