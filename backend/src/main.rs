// use std::env;

// use actix_cors::Cors;
// use actix_web::{http, web::{self, Data}, App, HttpServer};
// use dotenv::dotenv;
// use mongodb::Client;

// mod routes;
// mod utils;

// mod middlewares;
// #[actix_web::main]
// async fn main() -> std::io::Result<()> {

//     if env::var("RUST_LOG").is_err() {
//         env::set_var("RUST_LOG", "actix_web=debug,actix_server=debug");
//     }
//     env_logger::init();


//     dotenv().ok();

//     let address = env::var("ADDRESS").unwrap_or_else(|_| "127.0.0.1".to_string());
//     let port: u16 = env::var("PORT")
//         .unwrap_or_else(|_| "8000".to_string()) 
//         .parse()
//         .expect("PORT must be a valid u16");

//     let uri = std::env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".into());
//     let client = Client::with_uri_str(uri).await.expect("failed to connect");
//     HttpServer::new(move || {
//         App::new()
//     .wrap(actix_web::middleware::Logger::default())
//     .app_data(web::PayloadConfig::new(20 * 1024 * 1024))
//     .wrap(
//         Cors::default()
//             .allow_any_origin()// Allow frontend origin
//             .allowed_methods(vec!["GET", "POST", "PATCH", "OPTIONS"])
//             .allowed_headers(vec![
//                 http::header::ACCEPT,
//                 http::header::CONTENT_TYPE,
//             ])
//             .expose_headers(&[http::header::SET_COOKIE])  
//             .supports_credentials() 
//             .max_age(3600)
//     )
//     .app_data(Data::new(client.clone()))
//     .configure(routes::user_routes)   
//     })
//     .bind((address,port))?
//     .run()
//     .await
// }

use utils::contracts::{helper::get_wallet_address, swarajtoken::SwarajToken};
use web3::{ethabi::Address, transports::Http, types::U256, Web3};

mod utils;

#[actix_web::main]
async fn main() -> web3::Result<()> {
    let swarajtoken = SwarajToken::new();
    let address:Address = "0x5232a11aced4d3e7e78685669486520683e88e4f".parse().unwrap();
    let too : Address = "0xac8dacbcea9a56d5003a67202bc0d7ac705fef0b".parse().unwrap();
    let password = std::env::var("OWNER_PASSWORD").expect("Specify OWNER_PASSWORD in .env file");
    let rpc_url = std::env::var("RPC_URL").expect("RPC_URL must be set");

    let web3 = Web3::new(Http::new(&rpc_url).unwrap());
    let personal = web3.personal();
    personal.unlock_account(address, &password, Some(300)).await.unwrap(); 
    // swarajtoken.mint( U256::from(100000) ).await.unwrap();

    print!("{:?}",swarajtoken.transfer(address, too, U256::from(10)).await);

    println!("{:?}",swarajtoken.balance_of(address).await);

   

    Ok(())
}