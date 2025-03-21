use std::time::Duration;
use std::{fs::File, io::Read};
use std::str::FromStr;
use web3::signing::SecretKey;
use web3::{contract::Contract, transports::Http, types::Address, Web3};


pub  fn load_contract(contract_address:String,contract_abi:String) -> (Contract<Http>, Web3<Http>) {
    dotenv::dotenv().ok();
    let rpc_url = std::env::var("RPC_URL").expect("RPC_URL must be set");
    let http = Http::new(&rpc_url).unwrap();
    let web3 = Web3::new(http);
    let contract_address = Address::from_str(&contract_address).unwrap();
    let mut abi_json = File::open(contract_abi).expect("❌ Unable to open ABI file");
    let mut buffer = Vec::new();
    abi_json.read_to_end(&mut buffer).expect("❌ Unable to read ABI file");
    (Contract::from_json(web3.eth(), contract_address, buffer.as_slice()).unwrap(),web3)
}

pub fn load_key() -> web3::signing::SecretKey {
    dotenv::dotenv().ok();
    let pkey = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY must be set");
    SecretKey::from_str(&pkey).unwrap()
}

pub async fn get_wallet_address() -> Address {
    dotenv::dotenv().ok();
    let address :Address = std::env::var("WALLET_ADDRESS").expect("Specify WALLET_ADDRESS in .env file").parse().unwrap();
    let password = std::env::var("OWNER_PASSWORD").expect("Specify OWNER_PASSWORD in .env file");
    let rpc_url = std::env::var("RPC_URL").expect("RPC_URL must be set");

    let web3 = Web3::new(Http::new(&rpc_url).unwrap());
    let personal = web3.personal();
    personal.unlock_account(address, &password, Some(300)).await.unwrap(); 
    return address;
}