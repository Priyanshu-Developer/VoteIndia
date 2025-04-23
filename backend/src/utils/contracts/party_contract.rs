use std::{ fmt::Debug, io::Error, path::Path, time::{Duration, UNIX_EPOCH}};

use chrono::{DateTime, NaiveDateTime, TimeZone, Utc};
use serde::Serialize;
use web3::{contract::{tokens::Detokenize, Contract, Options}, ethabi::Token, transports::Http, types::{U256, U64}, Web3};

use super::helper::{load_contract, load_key, upload};



pub fn load_configs() -> (Contract<Http>, Web3<Http>) {
    dotenv::dotenv().ok();
    let contract_address= std::env::var("PARTIES_CONTRACT_ADDRESS").expect("PARTIES_CONTRACT_ADDRESS must be set");
    let abi_path = std::env::var("PARTIES_CONTRACT_ABI").expect("PARTIES_CONTRACT_ABI must be set");
    load_contract(contract_address, abi_path)
}



#[allow(dead_code)]
#[derive(Debug,Clone)]
pub struct NationalParty {
    pub name: String,
    pub symbol: String,
    pub logo :String
}
#[allow(dead_code)]
#[derive(Debug, Clone,Serialize)]
pub struct NationalPartyInfo{
    pub id: i128,
    pub name: String,
    pub symbol: String,
    pub logo: String,
    pub registered_time: String,

}

impl Detokenize for NationalPartyInfo {
    fn from_tokens(tokens: Vec<Token>) -> Result<Self, web3::contract::Error>
    where
        Self: Sized {

            if let Some(Token::Tuple(tuple_tokens)) = tokens.get(0) {
                if let [Token::Uint(id), Token::String(name), Token::String(symbol), Token::String(logo), Token::Uint(registered_time)] = &tuple_tokens[..] {
                    let dts = Utc.timestamp_opt(registered_time.as_u64() as i64, 0).single().expect("invalid format").format("%Y-%m-%d %H:%M:%S").to_string();
                  
                    return Ok(NationalPartyInfo {
                        id: id.as_u128() as i128,
                        name: name.clone(),
                        symbol: symbol.clone(),
                        logo: logo.clone(),
                        registered_time: dts,
                    });
                }
            }
            Err(web3::contract::Error::InvalidOutputType(
                "Invalid token structure".to_string(),
            ))
           
        }
}


#[allow(dead_code)]
#[derive(Debug,Clone)]
pub struct StateParty {
    pub name: String,
    pub symbol: String,
    pub logo :String,
    pub state: String
}
#[allow(dead_code)]
#[derive(Debug,Clone,Serialize)]
pub struct StatePartyInfo{
    pub id: u128,
    pub name: String,
    pub symbol: String,
    pub logo: String,
    pub state: String,
    pub registered_time: String,
}

impl Detokenize for StatePartyInfo {
    fn from_tokens(tokens: Vec<Token>) -> Result<Self, web3::contract::Error>
    where
        Self: Sized,
    {
        if let Some(Token::Tuple(tuple_token)) = tokens.get(0) {
            if let [Token::Uint(id),Token::String(name),Token::String(symbol),Token::String(logo), Token::String(state),Token::Uint(registered_time),] = &tuple_token[..]
            {
                let dts = Utc.timestamp_opt(registered_time.as_u64() as i64, 0).single().expect("invalid format").format("%Y-%m-%d %H:%M:%S").to_string();
                return Ok(StatePartyInfo {
                    id: id.as_u128(),
                    name: name.clone(),
                    symbol: symbol.clone(),
                    logo: logo.clone(),
                    state: state.clone(),
                    registered_time: dts,
                });
            }
        }
        Err(web3::contract::Error::InvalidOutputType(
            "Invalid token structure".to_string(),
        ))
    }
}

#[allow(dead_code)]
impl NationalParty {
    pub async fn new(name: &str, symbol: &str, logopath: &Path) -> Result<NationalParty, Error> {
        println!("path : {:?}",logopath);
        match upload(&logopath).await{

            Ok(logo) => {
                println!("logo :{}",logo);
                if name.len() == 0 || symbol.len() == 0 || name.len() > 20 || symbol.len() > 6 {
                    return Err(Error::new(std::io::ErrorKind::Other, "Name and Symbol cannot be empty"));
                }
                else {
                    return Ok(NationalParty {
                        name: name.to_string(),
                        symbol: symbol.to_string(),
                        logo,
                    });
                }
            },
            Err(e) => {
                Err(e)
            }
            
        }
    }

    pub async fn save(&self) -> Result<bool, Error> {
        dotenv::dotenv().ok();
        let account = load_key();
        let (contract, web3) = load_configs();

        // ✅ Define transaction options
        let options = Options {
            gas: Some(3_000_000.into()),
            ..Default::default()
        };

        let tx_hash = contract
            .signed_call_with_confirmations(
                "addNationalParty",
                (self.name.clone(), self.symbol.clone(), self.logo.clone()),
                options,
                1,
                &account, // ✅ Fix: Use correct key for signing
            )
            .await
            .expect("❌ Transaction failed");

        match web3.eth().transaction_receipt(tx_hash.transaction_hash).await.unwrap() {
            Some(receipt) => {
                if receipt.status == Some(U64::from(1)) {
                    return Ok(true);
                } else {
                    return Err(Error::new(std::io::ErrorKind::Other, "ID Exist"));
                }
            }
            None => return Err(Error::new(std::io::ErrorKind::Other, "Transaction receipt not found. Try increasing gas.")),
        }
    }

    pub async fn get_national_parties_by_symbol(symbol: &str) -> Result<NationalPartyInfo, Error> {
        let (contract, _) = load_configs();
        let result: Token = contract
            .query("getNationalPartyBySymbol", (symbol.to_string(),), None, Options::default(), None)
            .await
            .map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?;

        Ok(NationalPartyInfo::from_tokens(vec![result]).map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?)
    }

    pub async fn get_national_parties_by_name(name: &str) -> Result<NationalPartyInfo, Error> {
        let (contract, _) = load_configs();
        let result: Token = contract
            .query("getNationalPartyByName", (name.to_string(),), None, Options::default(), None)
            .await
            .map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?;

        Ok(NationalPartyInfo::from_tokens(vec![result]).map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?)
    }
    

    pub async fn get_all_national_parties() -> Result<Vec<NationalPartyInfo>, Error> {
        let (contract, _) = load_configs();
        let result: Vec<Token> = contract
            .query("getAllNationalParties", (), None, Options::default(), None)
            .await
            .map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?;

        let mut parties = Vec::new();
        for token in result {
            let party_info = NationalPartyInfo::from_tokens(vec![token])
                .map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?;
            parties.push(party_info);
        }

        Ok(parties)
    }
    
}

#[allow(dead_code)]
impl StateParty {
    pub async fn new(name: &str, symbol: &str, logopath: &Path, state: &str) -> Result<StateParty, Error> {

        match upload(&logopath).await{
            Ok(logo) => {
                if name.len() == 0 || symbol.len() == 0 {
                    return Err(Error::new(std::io::ErrorKind::Other, "Name and Symbol cannot be empty"));
                }
                else {
                    return Ok(StateParty {
                        name: name.to_string(),
                        symbol: symbol.to_string(),
                        logo,
                        state: state.to_string()
                    });
                }
            },
            Err(e) => {  Err(e) }
            
        }
        
    }
    pub async fn save(&self) -> Result<bool, Error> {
        dotenv::dotenv().ok();
        let account = load_key();
        let (contract, web3) = load_configs();

        // ✅ Define transaction options
        let options = Options {
            gas: Some(3_000_000.into()),
            ..Default::default()
        };

        let tx_hash = contract
            .signed_call_with_confirmations(
                "addStateParty",
                (self.name.clone(), self.symbol.clone(), self.logo.clone(), self.state.clone()),
                options,
                1,
                &account, // ✅ Fix: Use correct key for signing
            )
            .await
            .expect("❌ Transaction failed");

        match web3.eth().transaction_receipt(tx_hash.transaction_hash).await.unwrap() {
            Some(receipt) => {
                if receipt.status == Some(U64::from(1)) {
                    return Ok(true);
                } else {
                    return Err(Error::new(std::io::ErrorKind::Other, "ID Exist"));
                }
            }
            None => return Err(Error::new(std::io::ErrorKind::Other, "Transaction receipt not found. Try increasing gas.")),
        }
    }

    pub async fn get_state_parties_by_symbol(symbol: &str) -> Result<StatePartyInfo, Error> {
        let (contract, _) = load_configs();
        let result: Token = contract
            .query("getStatePartyBySymbol", (symbol.to_string(),), None, Options::default(), None)
            .await
            .map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?;

        Ok(StatePartyInfo::from_tokens(vec![result]).map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?)
    }

    pub async fn get_state_parties_by_name(name: &str) -> Result<StatePartyInfo, Error> {
        let (contract, _) = load_configs();
        let result: Token = contract
            .query("getStatePartyByName", (name.to_string(),), None, Options::default(), None)
            .await
            .map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?;

        Ok(StatePartyInfo::from_tokens(vec![result]).map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?)
    }

    pub async fn get_all_state_parties() -> Result<Vec<StatePartyInfo>, Error> {
        let (contract, _) = load_configs();
        let result: Vec<Token> = contract
            .query("getAllStateParties", (), None, Options::default(), None)
            .await
            .map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?;

        let mut parties = Vec::new();
        for token in result {
            let party_info = StatePartyInfo::from_tokens(vec![token])
                .map_err(|e| Error::new(std::io::ErrorKind::Other, e.to_string()))?;
            parties.push(party_info);
        }
        Ok(parties)
    }
}