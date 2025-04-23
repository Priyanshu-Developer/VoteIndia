use actix_multipart::form::{tempfile::TempFile, text::Text, MultipartForm};
use actix_web::{get, post, web::Query, HttpResponse, Responder};
use serde::Deserialize;
use serde_json::json;

use crate::utils::contracts::party_contract::{NationalParty, StateParty};


#[derive(MultipartForm,Debug)]
pub struct RegisterNationalParty {
    pub name: Text<String>,
    pub symbol: Text<String>,
    pub logo : TempFile
}


#[derive(MultipartForm,Debug)]
pub struct RegisterStateParty {
    pub name: Text<String>,
    pub symbol: Text<String>,
    pub logo : TempFile,
    pub state:Text<String>
}

#[derive(Deserialize)]
struct PartynameQuery {
    name: String,  // Change to i64 if expecting numeric ID
}

#[derive(Deserialize)]
struct PartysymbolQuery {
    symbol: String,  // Change to i64 if expecting numeric ID
}


#[post("register")]
pub async fn register_national_party(form: MultipartForm<RegisterNationalParty>) -> impl Responder {

    if form.0.logo.size == 0 || form.0.name.is_empty() || form.0.symbol.is_empty(){
        return HttpResponse::Ok().json(json!({"message" : "paramters missing"}));
    }
    match NationalParty::new(&form.0.name,&form.0.symbol,form.0.logo.file.path()).await{
        Ok(party) => {
            party.save().await.unwrap();
            HttpResponse::Ok().body("National party registered successfully")
        },
        Err(e) => {HttpResponse::from_error(e)}
    }
}
#[get("get")]
pub async fn get_national_party_by_name(query: Query<PartynameQuery>) -> impl Responder {
    match NationalParty::get_national_parties_by_name(&query.name).await{
        Ok(party) => {
            HttpResponse::Ok().json(json!({"id": party.id,"name":party.name,"symbol":party.symbol,"logo":party.logo,"registeredtime":party.registered_time}))
        },
        Err(e) => {
            HttpResponse::from_error(e)
        }
    }
    
}
#[get("get")]
pub async fn get_national_party_by_symbol(query: Query<PartysymbolQuery>) -> impl Responder {
    match NationalParty::get_national_parties_by_name(&query.symbol).await{
        Ok(party) => {
            HttpResponse::Ok().json(json!({"id": party.id,"name":party.name,"symbol":party.symbol,"logo":party.logo,"registeredtime":party.registered_time}))
        },
        Err(e) => {
            HttpResponse::from_error(e)
        }
    }
}

#[get("get-all")]
pub async fn get_all_national_party() -> impl Responder{
    match NationalParty::get_all_national_parties().await{
        Ok(_party) => {
            HttpResponse::Ok().json(_party)
        },
        Err(e) => {
            HttpResponse::from_error(e)
        }
    }
    
}

#[post("/register")]
pub async fn register_state_party(form: MultipartForm<RegisterStateParty>) -> impl Responder {

    if form.0.logo.size == 0 || form.0.name.is_empty() || form.0.symbol.is_empty() || form.0.state.is_empty(){
        return HttpResponse::Ok().json(json!({"message" : "paramters missing"}));
    }
    match StateParty::new(&form.0.name,&form.0.symbol,form.0.logo.file.path(),&form.0.state).await{
        Ok(party) => {
            party.save().await.unwrap();
            HttpResponse::Ok().body("National party registered successfully")
        },
        Err(e) => {HttpResponse::from_error(e)}
    }
}
#[get("/get")]
pub async fn get_state_party_by_name(query: Query<PartynameQuery>) -> impl Responder {
    match StateParty::get_state_parties_by_name(&query.name).await{
        Ok(party) => {
            HttpResponse::Ok().json(json!({"id": party.id,"name":party.name,"symbol":party.symbol,"logo":party.logo,"state":party.state,"registeredtime":party.registered_time}))
        },
        Err(e) => {
            HttpResponse::from_error(e)
        }
    }
    
}
#[get("/get")]
pub async fn get_state_party_by_symbol(query: Query<PartysymbolQuery>) -> impl Responder {
    match StateParty::get_state_parties_by_name(&query.symbol).await{
        Ok(party) => {
            HttpResponse::Ok().json(json!({"id": party.id,"name":party.name,"symbol":party.symbol,"logo":party.logo,"state":party.state,"registeredtime":party.registered_time}))
        },
        Err(e) => {
            HttpResponse::from_error(e)
        }
    }
    
}
#[get("get-all")]
pub async fn get_all_state_party() -> impl Responder{
    match StateParty::get_all_state_parties().await{
        Ok(party) => {
            HttpResponse::Ok().json(party)
        },
        Err(e) => {
            HttpResponse::from_error(e)
        }
    }
    
}