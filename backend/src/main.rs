use std::env;

use actix_cors::Cors;
use actix_web::{http, web::{self, Data}, App, HttpServer};
use dotenv::dotenv;
use mongodb::Client;

mod routes;
mod utils;

mod middlewares;
#[actix_web::main]
async fn main() -> std::io::Result<()> {

    if env::var("RUST_LOG").is_err() {
        env::set_var("RUST_LOG", "actix_web=debug,actix_server=debug");
    }
    env_logger::init();


    dotenv().ok();

    let address = env::var("ADDRESS").unwrap_or_else(|_| "127.0.0.1".to_string());
    let port: u16 = env::var("PORT")
        .unwrap_or_else(|_| "8000".to_string()) 
        .parse()
        .expect("PORT must be a valid u16");

    let uri = std::env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".into());
    let client = Client::with_uri_str(uri).await.expect("failed to connect");
    HttpServer::new(move || {
        App::new()
    .wrap(actix_web::middleware::Logger::default())
    .app_data(web::PayloadConfig::new(20 * 1024 * 1024))
    .wrap(
        Cors::default()
            .allow_any_origin()// Allow frontend origin
            .allowed_methods(vec!["GET", "POST", "PATCH", "OPTIONS"])
            .allowed_headers(vec![
                http::header::ACCEPT,
                http::header::CONTENT_TYPE,
            ])
            .expose_headers(&[http::header::SET_COOKIE])  
            .supports_credentials() 
            .max_age(3600)
    )
    .app_data(Data::new(client.clone()))
    .configure(routes::user_routes)   
    })
    .bind((address,port))?
    .run()
    .await
}

