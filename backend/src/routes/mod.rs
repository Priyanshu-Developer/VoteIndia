use actix_web::web;

pub mod user;
pub mod candidates;
pub mod forms;
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
                .service(user::hy)
        );
}