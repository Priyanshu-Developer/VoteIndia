const keythereum = require("keythereum");
const fs = require("fs");

const keystore = JSON.parse(fs.readFileSync("/home/anonymous/.ethereum/voters/keystore/UTC--2025-02-11T09-32-25.769124935Z--d6f19cbb898e55b24e775d41dcc30eaf98a55bda", "utf8"));
const password = "Priyanshu2002@"; // Replace with your actual password

const privateKey = keythereum.recover(password, keystore);
console.log("Private Key:", privateKey.toString("hex"));
