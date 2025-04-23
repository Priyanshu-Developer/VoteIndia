use actix_web::web;
use parties::{get_all_national_party, get_all_state_party, get_national_party_by_name, get_national_party_by_symbol, get_state_party_by_name, get_state_party_by_symbol, register_national_party, register_state_party};

pub mod user;
pub mod candidates;
pub mod forms;
pub mod admin;
pub mod swarajtoken;
pub mod parties;
pub mod nationalparty;
// use crate::middlewares::auth::Auth; // Import the AuthMiddleware

pub fn user_routes(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/user")
                
                .service(user::login)
                .service(user::register)
                .service(user::generate_wallet)
                .service(user::get_details)
                .service(user::get_image)
                .service(user::get_voter)
                .service(user::get_user)
                .service(user::update_password)
                .service(user::get_adhar)
                .service(user::check_id)
                .service(user::get_all)
        )
        .service(
                web::scope("/admin")
                .service(admin::login)
                .service(admin::register)
                .service(admin::update)
                .service(admin::get_all_admin)
                .service(admin::delete)
                .service(
                        web::scope("/national-party")
                        .service(register_national_party)
                        .service(get_national_party_by_name)
                        .service(get_national_party_by_symbol)
                        .service(get_all_national_party)
                )
                .service(
                        web::scope("/state-party")
                        .service(register_state_party)
                        .service(get_state_party_by_name)
                        .service(get_state_party_by_symbol)
                        .service(get_all_state_party)
                )
        );
}