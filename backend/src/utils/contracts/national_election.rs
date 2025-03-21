
use web3::ethabi::Uint;


pub struct Party{
    pub name :String ,
    pub symbol : String,
    pub image : String,
}

#[allow(dead_code)]
#[derive(Debug)]
pub struct Candidate{
    pub partyid : usize,
    pub name: String,
    pub image:String
}

pub struct CandidateInfo{
    pub id : usize,
    pub name :String,
    pub image : String,
    pub totalvote : usize,
    pub party : Party,
}