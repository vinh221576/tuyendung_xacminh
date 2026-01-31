//C:\Users\HP\Desktop\CongNgheChuoiKhoi\team_duan\tuyendung_xacminh\blockchain-tuyendung\hardhat.config.ts
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.20",
  networks: {
    cronosTestnet: {
      url: "https://evm-t3.cronos.org", // RPC ổn định
      chainId: 338,
      accounts: process.env.KHOA_BI_MAT ? [process.env.KHOA_BI_MAT] : [],
      gasPrice: "auto"
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;