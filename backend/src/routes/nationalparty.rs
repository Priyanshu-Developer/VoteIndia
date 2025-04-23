use actix_web::{get, post, web::{Data, Query}, HttpResponse, Responder};
use mongodb::{bson::{doc, DateTime}, Client, Collection};
use serde::{Deserialize, Serialize};
use serde_json::json;


const DB_NAME: &str = "voteIndia";
const COLL_NAME: &str = "National Contract";

#[derive(Deserialize)]
struct contractQuery{
    address:String,
}
#[derive(Debug, Serialize, Deserialize)]
struct Contract{
    address:String,
    contract_type:String,
    date:DateTime
}

#[post("add-contract")]
pub async fn add_contract(query:Query<contractQuery>,client: Data<Client>) -> impl Responder{

    let collection:Collection<Contract> = client.database(DB_NAME).collection(COLL_NAME);

    match collection.find_one(doc!{"address": &query.address}).await{
        Ok(Some(contract))=>{
            HttpResponse::Conflict().json(json!({ "message": "Contrcat already Exists" }));
        }
        Ok(None) => {
            match collection.insert_one(doc)
        }
        Err(err) => {}
    }

    HttpResponse::Ok().body("ojoej")
}