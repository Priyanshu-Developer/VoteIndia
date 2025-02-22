use std::borrow::Cow;
use std::str::FromStr;

use alloy::primitives::Address;
use alloy::providers::{Provider, ProviderBuilder};

use std::{env, io};
pub async fn create_account() -> Result<String,io::Error>{

    match env::var("GETH_URL") {
        Ok(url) => {
            let provider = ProviderBuilder::new().on_http(url.parse().unwrap());
            match env::var("WALLET_PASSWORD") {
                Ok(password) => {
                    let address_str: String = provider.raw_request(Cow::from("personal_newAccount"), [password]).await.unwrap();
        
                    return Ok(Address::from_str(&address_str).unwrap().to_string());
                    
                }
                Err(_) => Err(std::io::Error::new(
                    std::io::ErrorKind::Other,
                    "WALLET_PASSWORD environment variable not set" )),
                
            }
        },
        Err(_) => Err(io::Error::new(std::io::ErrorKind::Other,"WALLET_PASSWORD environment variable not set" ))
    }
}