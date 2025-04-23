use std::{io::Error, path::Path};
use web3::{contract::{Contract, Options, tokens::Detokenize}, transports::Http, types::{U256, U64}, Web3};
use super::{helper::{load_contract, load_key, upload}, party_contract::NationalParty};

pub fn load_configs() -> (Contract<Http>, Web3<Http>) {
    dotenv::dotenv().ok();
    let contract_address = std::env::var("NATIONAL_ELECTION_CONTRACT_ADDRESS").expect("NATIONAL_ELECTION_CONTRACT_ADDRESS must be set");
    let abi_path = std::env::var("NATIONAL_ELECTION_CONTRACT_ABI").expect("NATIONAL_ELECTION_CONTRACT_ABI must be set");
    load_contract(contract_address, abi_path)
}

pub struct NationalElection {
    contract: Contract<Http>,
    web: Web3<Http>,
}

#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct CandidateVotes {
    pub candidate_id: U256,
    pub candidate_name: String,
    pub image: String,
    pub total_vote: U256,
    pub party_name: String,
    pub party_symbol: String,
    pub party_logo: String,
    pub statewise_votes: Vec<(String, U256)>,
}

impl Detokenize for CandidateVotes {
    fn from_tokens(tokens: Vec<web3::ethabi::Token>) -> Result<Self, web3::contract::Error> {
        if tokens.len() != 8 {
            return Err(web3::contract::Error::InvalidOutputType(format!(
                "Expected 8 tokens, got {}",
                tokens.len()
            )));
        }
        Ok(CandidateVotes {
            candidate_id: tokens[0].clone().into_uint().unwrap(),
            candidate_name: tokens[1].clone().to_string(),
            image: tokens[2].clone().to_string(),
            total_vote: tokens[3].clone().into_uint().unwrap(),
            party_name: tokens[4].clone().to_string(),
            party_symbol: tokens[5].clone().to_string(),
            party_logo: tokens[6].clone().to_string(),
            statewise_votes: tokens[7]
                .clone()
                .into_array()
                .unwrap()
                .into_iter()
                .map(|token| {
                    let tuple = token.into_tuple().unwrap();
                    (
                        tuple[0].clone().to_string(),
                        tuple[1].clone().into_uint().unwrap(),
                    )
                })
                .collect(),
        })
    }
}

impl NationalElection {
    pub fn load() -> NationalElection {
        let (_contract, _web) = load_configs();
        NationalElection { contract: _contract, web: _web }
    }

    pub async fn register_candidates(&self, partyid: U256, candidate_name: &str, candidate_image: &Path) -> Result<bool, Error> {
        match upload(candidate_image).await {
            Ok(image_url) => {
                let option = Options {
                    gas: Some(3_000_000.into()),
                    ..Default::default()
                };
                let tx_hash = self.contract.signed_call_with_confirmations(
                    "registerCandidate", 
                    (partyid.clone(), candidate_name.to_string(), image_url),
                    option, 
                    1, 
                    &load_key()
                ).await.expect("❌ Transaction failed");
                
                match self.web.eth().transaction_receipt(tx_hash.transaction_hash).await.unwrap() {
                    Some(receipt) => {
                        if receipt.status == Some(U64::from(1)) {
                            return Ok(true);
                        } else {
                            return Err(Error::new(std::io::ErrorKind::Other, "ID Exist"));
                        }
                    }
                    None => Err(Error::new(std::io::ErrorKind::Other, "Transaction receipt not found. Try increasing gas.")),
                }
            }
            Err(e) => Err(Error::new(std::io::ErrorKind::Other, format!("Failed to upload candidate image: {}", e))),
        }
    }

    pub async fn vote_for_candidate(&self, candidate_id: U256, state: &str) -> Result<bool, Error> {
        let option = Options {
            gas: Some(3_000_000.into()),
            ..Default::default()
        };
        let tx_hash = self.contract.signed_call_with_confirmations(
            "voteForCandidate", 
            (candidate_id.clone(), state.to_string()),
            option, 
            1, 
            &load_key()
        ).await.expect("❌ Transaction failed");

        match self.web.eth().transaction_receipt(tx_hash.transaction_hash).await.unwrap() {
            Some(receipt) => {
                if receipt.status == Some(U64::from(1)) {
                    Ok(true)
                } else {
                    Err(Error::new(std::io::ErrorKind::Other, "Vote failed"))
                }
            }
            None => Err(Error::new(std::io::ErrorKind::Other, "Transaction receipt not found. Try increasing gas.")),
        }
    }

    pub async fn get_candidate(&self, candidate_id: U256) -> Result<(U256, String, String, U256, String, String, String), Error> {
        let result: (U256, String, String, U256, String, String, String) = 
            self.contract.query("getCandidate", candidate_id, None, Options::default(), None).await.expect("❌ Query failed");
        Ok(result)
    }

    pub async fn get_candidate_votes_by_state(&self, candidate_id: U256, state: &str) -> Result<(U256, String, String, U256, String, String, String), Error> {
        let result: (U256, String, String, U256, String, String, String) = 
            self.contract.query("getCandidateVotesByState", (candidate_id, state.to_string()), None, Options::default(), None).await.expect("❌ Query failed");
        Ok(result)
    }

    pub async fn get_candidate_votes(&self, candidate_id: U256) -> Result<CandidateVotes, Error> {
        let result: CandidateVotes = 
            self.contract.query("getCandidateVotes", candidate_id, None, Options::default(), None).await.expect("❌ Query failed");
        Ok(result)
    }
}
