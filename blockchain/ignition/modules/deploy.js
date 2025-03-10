import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("DeploySimpleStorage", (m) => {
  const simpleStorage = m.contract("SwarajToken", );

  return { simpleStorage };
});
