use std::str::FromStr;
use std::{ fs::File, io::{Cursor, Error, Read}, path::Path};
use ipfs_api_backend_actix::{IpfsApi, IpfsClient};
use web3::signing::SecretKey;
use web3::{contract::Contract, transports::Http, types::Address, Web3};



pub struct Owner{
    pub address : Address,
    pub pkey : SecretKey,
}


impl  Owner {
    pub fn new () -> Owner{
        dotenv::dotenv().ok();
        let _address :Address = std::env::var("WALLET_ADDRESS").expect("Specify WALLET_ADDRESS in .env file").parse().unwrap();
        let _pkey = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY must be set");

        Owner{address: _address,
             pkey: SecretKey::from_str(&_pkey).unwrap()}

    }

    pub async fn unlock(&self) -> Result<Address, web3::Error>{
        let password = std::env::var("OWNER_PASSWORD").expect("Specify OWNER_PASSWORD in .env file");
        let rpc_url = std::env::var("RPC_URL").expect("RPC_URL must be set");

        let web3 = Web3::new(Http::new(&rpc_url).unwrap());
        let personal = web3.personal();
        personal.unlock_account(self.address, &password, Some(300)).await.unwrap();
        return Ok(self.address);
    }
}

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

pub fn load_key() -> SecretKey{
    let _pkey = std::env::var("PRIVATE_KEY").expect("PRIVATE_KEY must be set");
    SecretKey::from_str(&_pkey).unwrap()
}

pub async fn upload(path: &Path) -> Result<String, Error> {
       
    let client = IpfsClient::default(); 
    match File::open(path){
        Ok(mut file) => {
            let mut buffer = Vec::new();
                file.read_to_end(&mut buffer)?;
                let cursor = Cursor::new(buffer);
                match client.add(cursor).await{
                    Ok(response) => {
                        Ok(response.hash)
                    },
                    Err(e) => {
                        Err(std::io::Error::new(std::io::ErrorKind::Other, e.to_string()))
                    }
                }
        },
        Err(e) => return Err(e)
        
    }
}