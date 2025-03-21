use std::{thread::sleep, time::Duration};

use web3::{contract::{Contract, Error, Options}, ethabi::Address, transports::Http, types::{H256, U256}, Web3};

use super::helper::{get_wallet_address, load_contract};

pub struct SwarajToken{
    contract: Contract<Http>,
    web3 : Web3<Http> 
   
}
#[allow(dead_code)]
impl SwarajToken {

    pub fn new() -> SwarajToken{

        dotenv::dotenv().ok();
        let contract_address= std::env::var("SWARAJTOKEN_CONTRACT_ADDRESS").expect("PARTIES_CONTRACT_ADDRESS must be set");
        let abi_path = std::env::var("SWARAJTOKEN_CONTRACT_ABI").expect("SWARAJTOKEN_CONTRACT_ADDRESS_ABI must be set");
        let (_contract,_web3) = load_contract(contract_address, abi_path);
        SwarajToken { contract: _contract,web3:_web3}
    }
    pub async fn confirm_transaction(&self, tx_hash: H256) -> Result<(), Error> {
        for _ in 0..10 { // Check up to 10 times
            if let Some(receipt) = self.web3.eth().transaction_receipt(tx_hash).await? {
                println!("Transaction confirmed in block: {:?}", receipt.block_number);
                return Ok(());
            }
            println!("Waiting for confirmation...");
            sleep(Duration::from_secs(15));
        }
        Err(Error::from("Transaction not confirmed".to_string()))
    }
    /// `balanceOf` - Fetch the balance of a user
    pub async fn balance_of(&self, user: Address) -> Result<U256, Error> {
        self.contract.query("balanceOf", (user,), None, Options::default(), None).await
    }

    /// `allowance` - Fetch allowance for a spender
    pub async fn allowance(&self, owner: Address, spender: Address) -> Result<U256, Error> {
        self.contract.query("allowance", (owner, spender), None, Options::default(), None).await
    }

    /// `approve` - Approve a spender
    pub async fn approve(&self, from: Address, spender: Address, amount: U256) -> Result<(), Error> {
       let tx =  self.contract.call("approve", (spender, amount), from, Options::default()).await.unwrap();
       self.confirm_transaction(tx).await
       
    }

    /// `transfer` - Transfer tokens
    pub async fn transfer(&self, from: Address, to: Address, amount: U256) -> Result<(), Error> {
       let tx =  self.contract.call("transfer", (to, amount), from, Options::default()).await.unwrap();
       self.confirm_transaction(tx).await
    }

    /// `transferFrom` - Transfer tokens from an approved account
    pub async fn transfer_from(&self, caller: Address, from: Address, to: Address, amount: U256) -> Result<(), Error> {
       let tx =  self.contract.call("transferFrom", (from, to, amount), caller, Options::default()).await.unwrap();
       self.confirm_transaction(tx).await
    }

    /// `batchTransfer` - Batch transfer to multiple recipients
    pub async fn batch_transfer(&self,  recipients: Vec<Address>) -> Result<(), Error> {

       let tx =  self.contract.call("batchTransfer", (recipients,),get_wallet_address().await, Options::default()).await.unwrap();
       self.confirm_transaction(tx).await
    }

    /// `batchBurn` - Burn tokens from multiple holders
    pub async fn batch_burn(&self, holders: Vec<Address>) -> Result<(), Error> {
       let tx =  self.contract.call("batchBurn", (holders,), get_wallet_address().await, Options::default()).await.unwrap();
       self.confirm_transaction(tx).await
    }

    /// `mint` - Mint new tokens
    pub async fn mint(&self, amount: U256) -> Result<(), Error> {
       let tx =  self.contract.call("mint", (amount,), get_wallet_address().await, Options::default()).await.unwrap();
       self.confirm_transaction(tx).await
    }

    /// `burnAllTokens` - Burn all tokens
    pub async fn burn_all_tokens(&self) -> Result<(), Error> {
       let tx =  self.contract.call("burnAllTokens", (), get_wallet_address().await, Options::default()).await.unwrap();
       self.confirm_transaction(tx).await
    }

    /// `depositGasFunds` - Deposit ETH to contract
    pub async fn deposit_gas_funds(&self, amount: U256) -> Result<(), Error> {
       let tx =  self.contract.call("depositGasFunds", (), get_wallet_address().await, Options { value: Some(amount), ..Options::default() }).await.unwrap();
       self.confirm_transaction(tx).await
    }

    /// `withdrawGasFunds` - Withdraw ETH from contract
    pub async fn withdraw_gas_funds(&self, amount: U256) -> Result<(), Error> {
       let tx =  self.contract.call("withdrawGasFunds", (amount,), get_wallet_address().await, Options::default()).await.unwrap();
       self.confirm_transaction(tx).await
    }


    
    
}